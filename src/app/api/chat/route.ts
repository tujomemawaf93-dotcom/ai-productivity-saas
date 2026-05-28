import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Отключаем edge runtime для обеспечения надежного пулинга соединений Prisma во время потоковой передачи
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let { userId } = await auth();
    if (!userId) {
      if (process.env.NODE_ENV === "development") {
        userId = "user_test_dev_sandbox";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { messages, workspaceId, sessionId } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
    }

    // Убеждаемся, что пользователь существует в БД
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "placeholder@email.com",
      },
    });

    // Ищем запрошенный воркспейс, принадлежащий пользователю
    let workspace = await db.workspace.findFirst({
      where: { slug: workspaceId, userId },
    });

    // Фолбэк: если воркспейс не найден, берем первое доступное пространство пользователя
    if (!workspace) {
      workspace = await db.workspace.findFirst({
        where: { userId }
      });
    }

    // Супер-фолбэк (самовосстановление): если у пользователя вообще нет пространств
    if (!workspace) {
      const defaultSlug = `personal-${userId.toLowerCase()}`;
      workspace = await db.workspace.create({
        data: {
          name: "Личное пространство",
          slug: defaultSlug,
          theme: "purple",
          userId,
        },
      });
    }

    const dbWorkspaceId = workspace.id;
    let activeSessionId = sessionId;

    // Автоматическое создание сессии диалога, если она еще не создана
    if (!activeSessionId || activeSessionId === "new") {
      const generatedTitle =
        lastMessage.content.trim().substring(0, 30) +
        (lastMessage.content.trim().length > 30 ? "..." : "");

      const newSession = await db.chatSession.create({
        data: {
          title: generatedTitle || "Новый диалог",
          workspaceId: dbWorkspaceId,
          userId,
        },
      });
      activeSessionId = newSession.id;
    } else {
      // Проверяем, что сессия принадлежит пользователю и текущему workspace
      const existingSession = await db.chatSession.findFirst({
        where: {
          id: activeSessionId,
          userId,
          workspaceId: dbWorkspaceId,
        },
      });

      if (!existingSession) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
      }

      // Обновляем updatedAt у сессии для подъема наверх списка
      await db.chatSession.update({
        where: { id: activeSessionId },
        data: { updatedAt: new Date() },
      });
    }

    // Сохраняем сообщение пользователя в БД
    await db.message.create({
      data: {
        role: "user",
        content: lastMessage.content,
        sessionId: activeSessionId,
      },
    });

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Имитационный стриминг (Fallback-режим для изолированной песочницы), если ключ не задан
      const mockResponses = [
        "Я проанализировал вашу рабочую область Aether OS. Проект выглядит великолепно! Стек Next.js 16, Prisma, PostgreSQL и Tailwind CSS v4 настроен корректно.\n\nКакую именно часть логики (умные заметки с блочным редактором или календарь) мы начнем разрабатывать прямо сейчас?",
        "Отличный вопрос! База данных PostgreSQL и Prisma ORM полностью готовы к работе. Все модели (User, Workspace, Note, ChatSession, Message, AnalyticsSnapshot) имеют каскадные связи и поддерживают Text-поля.\n\nДавайте напишем Server Action для создания новой заметки в вашей БД?",
        "Aether AI полностью готов. Я могу помочь вам спроектировать:\n\n1. Написать SQL-запросы для сквозной аналитики и виджетов.\n2. Спланировать календарную сетку.\n3. Сгенерировать ИИ-сводку (AI Summary) ваших заметок в реальном времени.",
      ];
      const selectedResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      const encoder = new TextEncoder();
      const customStream = new ReadableStream({
        async start(controller) {
          const words = selectedResponse.split(" ");
          let accumulatedContent = "";

          for (const word of words) {
            const wordWithSpace = word + " ";
            accumulatedContent += wordWithSpace;
            controller.enqueue(encoder.encode(wordWithSpace));
            await new Promise((resolve) => setTimeout(resolve, 80)); // Имитация скорости стриминга
          }

          // Сохраняем финальный ответ модели в БД
          try {
            await db.message.create({
              data: {
                role: "model",
                content: accumulatedContent.trim(),
                sessionId: activeSessionId,
              },
            });
          } catch (dbErr) {
            console.error("Failed to save mock response message to DB:", dbErr);
          }

          controller.close();
        },
      });

      return new Response(customStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Chat-Session-Id": activeSessionId
        },
      });
    }

    // Официальный вызов Gemini API через REST (streamGenerateContent)
    // Поддерживаем историю диалога для модели
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages.map((m: any) => ({
            role: m.role === "model" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        let accumulatedModelContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Парсим поток JSON от Gemini
          try {
            // Очищаем квадратные скобки JSON-массива в потоке streamGenerateContent
            const cleaned = buffer.replace(/^\[/, "").replace(/\]$/, "").trim();
            const chunks = cleaned.split(/,\s*\n\s*/);

            for (const chunk of chunks) {
              if (chunk.trim() && chunk.trim().startsWith("{")) {
                const parsed = JSON.parse(chunk);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  accumulatedModelContent += text;
                  controller.enqueue(encoder.encode(text));
                }
              }
            }
            buffer = ""; // Очищаем буфер при успешном парсинге
          } catch {
            // Чанк не завершен, ждем продолжения потока в буфере
          }
        }

        // Сохраняем финальный сгенерированный ответ ИИ в БД
        if (accumulatedModelContent) {
          try {
            await db.message.create({
              data: {
                role: "model",
                content: accumulatedModelContent,
                sessionId: activeSessionId,
              },
            });
          } catch (dbErr) {
            console.error("Failed to save Gemini response message to DB:", dbErr);
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Session-Id": activeSessionId
      },
    });
  } catch (error: any) {
    console.error("Error in AI Chat POST handler:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
