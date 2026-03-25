import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createUmestayServerClient } from "@umestay/db";
import type { CookieOptions } from "@umestay/db";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code      = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type      = searchParams.get("type");
  const next      = searchParams.get("next") ?? "/zh";

  const cookieStore = await cookies();

  // 收集 Supabase 想要写入的 cookie，统一设置到 redirect response 上
  const pendingCookies: CookieOptions[] = [];

  const supabase = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      pendingCookies.push(...cookiesToSet);
    },
  });

  // 把 cookie 附加到 response 上的工具函数
  function withCookies(response: NextResponse) {
    pendingCookies.forEach(({ name, value, options }) => {
      // response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
      if (options) {
        response.cookies.set(name, value, options);
      } else {
        response.cookies.set(name, value);
      }
    });
    return response;
  }

  // 模式一：PKCE code（OAuth、Magic Link 等）
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return withCookies(NextResponse.redirect(`${origin}${next}`));
    }
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    // 没有 token_hash 可回退时，直接报错并携带详情
    if (!tokenHash) {
      const locale = next.split("/")[1] || "zh";
      return NextResponse.redirect(
        `${origin}/${locale}/reset-password?error=invalid_link&detail=${encodeURIComponent(error.message)}`
      );
    }
    // 有 token_hash 时继续尝试 token_hash 模式（兜底）
  }

  // 模式二：token_hash（重置密码邮件、邮箱确认等）
  if (tokenHash && type) {
    // recovery 类型：直接把 token_hash 透传到修改密码页，由 Server Action 统一完成
    // verifyOtp + updateUser，避免 session cookie 在 redirect 后丢失的问题
    if (type === "recovery") {
      const locale = next.split("/")[1] || "zh";
      return NextResponse.redirect(
        `${origin}/${locale}/update-password?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`
      );
    }

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email" | "signup" | "invite" | "magiclink" | "email_change",
    });
    if (!error) {
      return withCookies(NextResponse.redirect(`${origin}${next}`));
    }
    console.error("[auth/callback] verifyOtp error:", error.message);
    return NextResponse.redirect(
      `${origin}/zh/reset-password?error=invalid_link&detail=${encodeURIComponent(error.message)}`
    );
  }

  // 两个分支都没命中（URL 格式不对）
  return NextResponse.redirect(`${origin}/zh/reset-password?error=invalid_link`);
}
