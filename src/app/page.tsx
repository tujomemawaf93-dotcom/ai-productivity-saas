import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function Home() {
  const { userId } = await auth();

  // Если пользователь не авторизован, отправляем на страницу логина
  if (!userId) {
    redirect("/login");
  }

  // Ищем первый доступный воркспейс текущего пользователя
  let workspace = await db.workspace.findFirst({
    where: { userId },
  });

  // Если воркспейс еще не создался (например, вебхук Clerk немного запаздывает), 
  // подождем 1.5 секунды и попробуем еще раз (Graceful degradation)
  if (!workspace) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    workspace = await db.workspace.findFirst({
      where: { userId },
    });
  }

  // Супер-фолбэк: если вебхук полностью упал, создаем юзера и воркспейс на лету
  if (!workspace) {
    const defaultSlug = `personal-${userId.toLowerCase()}`;
    
    // Убедимся, что юзер существует в локальной БД
    await db.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: `fallback-${userId}@aether.local`,
            name: 'Пользователь',
        }
    });

    // Создаем резервный воркспейс
    workspace = await db.workspace.upsert({
        where: { slug: defaultSlug },
        update: {},
        create: {
          name: "Личное пространство",
          slug: defaultSlug,
          theme: "purple",
          userId,
        }
    });
  }

  // Динамически перенаправляем в реальный воркспейс пользователя
  redirect(`/${workspace.slug}`);
}
