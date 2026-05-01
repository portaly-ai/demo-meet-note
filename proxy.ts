import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/insforge/server";

const PROTECTED_PREFIXES = ["/dashboard", "/notes", "/settings"];

/**
 * Insforge cookie-based 路由保護。沒設 cookie 就 redirect 到 sign-in。
 * 不在 middleware 做完整 token 驗證（沒 secret 不能驗 JWT 簽名），
 * 真實驗證留給 server component 的 getCurrentUser()。
 */
export async function proxy(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirect_url", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
