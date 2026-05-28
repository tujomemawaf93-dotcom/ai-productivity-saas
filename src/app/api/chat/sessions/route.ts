import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Вспомогательная функция для ленивой инициализации воркспейсов в базе данных
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

    // Убеждаемся, что пользователь существует для предотвращения внешних ключей
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
      update: {
        slug: slug,
      },
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

// GET /api/chat/sessions?workspaceId=...
export async function GET(req: Request) {
  try {
    let { userId } = await auth();
    if (!userId) {
      if (process.env.NODE_ENV === "development") {
        userId = "user_test_dev_sandbox";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
    }

    // Автоматически инициализируем workspace при обращении, если он отсутствует
    const workspace = await getOrCreateWorkspace(workspaceId, userId);

    // Извлекаем все сессии чата пользователя в текущем Workspace по его ID
    const sessions = await db.chatSession.findMany({
      where: {
        workspaceId: workspace.id,
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/chat/sessions
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

    const { workspaceId, title } = await req.json();

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
    }

    // Автоматически инициализируем workspace при обращении, если он отсутствует
    const workspace = await getOrCreateWorkspace(workspaceId, userId);

    const newSession = await db.chatSession.create({
      data: {
        title: title || "Новый чат",
        workspaceId: workspace.id,
        userId,
      },
    });

    return NextResponse.json(newSession);
  } catch (error: any) {
    console.error("Error creating chat session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
