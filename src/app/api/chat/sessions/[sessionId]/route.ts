import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// GET /api/chat/sessions/[sessionId]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    let { userId } = await auth();
    if (!userId) {
      if (process.env.NODE_ENV === "development") {
        userId = "user_test_dev_sandbox";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { sessionId } = await params;

    // Извлекаем сессию и проверяем права доступа пользователя
    const session = await db.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("Error fetching chat session details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/chat/sessions/[sessionId]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    let { userId } = await auth();
    if (!userId) {
      if (process.env.NODE_ENV === "development") {
        userId = "user_test_dev_sandbox";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { sessionId } = await params;
    const { title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Проверяем существование и права
    const session = await db.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // Обновляем название
    const updatedSession = await db.chatSession.update({
      where: { id: sessionId },
      data: { title: title.trim() },
    });

    return NextResponse.json(updatedSession);
  } catch (error: any) {
    console.error("Error renaming chat session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/chat/sessions/[sessionId]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    let { userId } = await auth();
    if (!userId) {
      if (process.env.NODE_ENV === "development") {
        userId = "user_test_dev_sandbox";
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { sessionId } = await params;

    // Проверяем права пользователя на удаление
    const session = await db.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // Удаляем сессию (каскадное удаление сообщений сработает из-за onDelete: Cascade в Prisma)
    await db.chatSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true, message: "Chat session deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting chat session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
