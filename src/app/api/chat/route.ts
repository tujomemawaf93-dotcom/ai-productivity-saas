import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
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
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((resolve) => setTimeout(resolve, 80)); // Имитация скорости стриминга
          }
          controller.close();
        },
      });

      return new Response(customStream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Официальный вызов Gemini API через REST (streamGenerateContent)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:streamGenerateContent?key=${apiKey}`,
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
                  controller.enqueue(encoder.encode(text));
                }
              }
            }
            buffer = ""; // Очищаем буфер при успешном парсинге
          } catch {
            // Чанк не завершен, ждем продолжения потока в буфере
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
