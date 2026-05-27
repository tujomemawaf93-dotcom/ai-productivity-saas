import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Разрешаем доступ к статическим ресурсам, API и страницам авторизации
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Считываем сессию из кук (созданную при входе / регистрации)
  const session = request.cookies.get("aether-session");

  // Если сессии нет и путь защищен, перенаправляем на логин
  if (!session) {
    if (pathname !== "/login" && pathname !== "/register") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // Если сессия есть, не даем заходить на /login, /register и / и сразу перенаправляем во фреймворк
    if (pathname === "/" || pathname === "/login" || pathname === "/register") {
      const workspaceUrl = new URL("/default-workspace", request.url);
      return NextResponse.redirect(workspaceUrl);
    }
  }

  return NextResponse.next();
}

// Защищаем воркспейсы и подстраницы
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
