"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getUserId() {
  let { userId } = await auth();
  if (!userId && process.env.NODE_ENV === "development") {
    userId = "user_test_dev_sandbox";
  }
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

async function getOrCreateWorkspace(slug: string, userId: string) {
  let workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    const defaultWorkspaces: Record<string, { id: string, name: string, theme: string }> = {
      "design-synapse": { id: "ws-1", name: "Design Synapse", theme: "purple" },
      "vercel-alpha": { id: "ws-2", name: "Vercel Alpha", theme: "blue" },
      "personal-lab": { id: "ws-3", name: "Personal Lab", theme: "amber" },
      "default-workspace": { id: "ws-1", name: "Design Synapse", theme: "purple" },
    };

    const wsInfo = defaultWorkspaces[slug] || { id: "ws-1", name: "Design Synapse", theme: "purple" };

    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "placeholder@email.com",
      },
    });

    workspace = await db.workspace.upsert({
      where: { id: wsInfo.id },
      update: { slug: slug },
      create: {
        id: wsInfo.id,
        name: wsInfo.name,
        slug: slug,
        theme: wsInfo.theme,
        userId,
      },
    });
  }

  return workspace;
}

export async function getFoldersAndNotes(workspaceSlug: string) {
  const userId = await getUserId();

  const workspace = await getOrCreateWorkspace(workspaceSlug, userId);

  const folders = await db.folder.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "asc" },
  });

  const notes = await db.note.findMany({
    where: { workspaceId: workspace.id, userId },
    orderBy: { updatedAt: "desc" },
  });

  return { folders, notes };
}

export async function createFolder(workspaceSlug: string, name: string) {
  const userId = await getUserId();

  const workspace = await getOrCreateWorkspace(workspaceSlug, userId);

  const folder = await db.folder.create({
    data: {
      name,
      workspaceId: workspace.id,
    },
  });

  revalidatePath(`/${workspaceSlug}/notes`);
  return folder;
}

export async function createNote(workspaceSlug: string, folderId: string | null) {
  const userId = await getUserId();

  const workspace = await getOrCreateWorkspace(workspaceSlug, userId);

  const note = await db.note.create({
    data: {
      title: "Новая заметка",
      content: "",
      workspaceId: workspace.id,
      userId,
      folderId,
    },
  });

  revalidatePath(`/${workspaceSlug}/notes`);
  return note;
}

export async function updateNote(id: string, data: { title?: string; content?: string; folderId?: string | null }) {
  const userId = await getUserId();

  const note = await db.note.update({
    where: { id, userId },
    data,
  });

  return note;
}

export async function deleteNote(id: string, workspaceSlug: string) {
  const userId = await getUserId();

  await db.note.delete({
    where: { id, userId },
  });
  
  revalidatePath(`/${workspaceSlug}/notes`);
  return { success: true };
}

export async function deleteFolder(id: string, workspaceSlug: string) {
  await db.folder.delete({
    where: { id },
  });
  
  revalidatePath(`/${workspaceSlug}/notes`);
  return { success: true };
}

export async function generateAISummary(noteContent: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "Это пример ИИ-выжимки (работает в режиме песочницы). Заметка содержит ключевые идеи и структуру.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Сделай краткую, профессиональную и красиво отформатированную (в Markdown) ИИ-выжимку следующей заметки. Выдели ключевые тезисы:\n\n${noteContent}` }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1024,
          }
        }),
      }
    );
    if (!response.ok) throw new Error("Gemini API Error");
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Не удалось сгенерировать выжимку.";
  } catch (error) {
    console.error(error);
    return "Ошибка генерации ИИ-выжимки.";
  }
}
