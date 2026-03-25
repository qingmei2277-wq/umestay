"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUmestayServerClient } from "@umestay/db";

async function createActionClient() {
  const cookieStore = await cookies();
  return createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {
        // Called from Server Component context, safe to ignore
      }
    },
  });
}

// ── 邮箱登录 ──────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const supabase = await createActionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };
  const next = (formData.get("next") as string) || "/zh";
  redirect(next);
}

// ── 邮箱注册 ──────────────────────────────────────────────────────────────────

export async function registerEmailAction(formData: FormData) {
  const supabase = await createActionClient();
  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: { name: formData.get("name") as string },
    },
  });
  if (error) return { error: error.message };
  return { success: true };
}

// ── 手机号发送 OTP ────────────────────────────────────────────────────────────

export async function sendOtpAction(phone: string) {
  const supabase = await createActionClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) return { error: error.message };
  return { success: true };
}

// ── 手机号验证 OTP 并登录（首次自动注册）─────────────────────────────────────

export async function verifyOtpAction(formData: FormData) {
  const phone = formData.get("phone") as string;
  const token = formData.get("token") as string;
  const next = (formData.get("next") as string) || "/zh";

  const supabase = await createActionClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) return { error: error.message };
  redirect(next);
}

// ── 手机号注册（OTP 验证 + 写入姓名）────────────────────────────────────────

export async function registerPhoneAction(formData: FormData) {
  const phone = formData.get("phone") as string;
  const token = formData.get("token") as string;
  const fullName = formData.get("name") as string;
  const next = (formData.get("next") as string) || "/zh";

  const supabase = await createActionClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) return { error: error.message };

  // 写入姓名（trigger 已创建 profiles 记录，更新 name）
  if (data.user && fullName) {
    await supabase
      .from("profiles")
      .update({ name: fullName })
      .eq("user_id", data.user.id);
  }

  redirect(next);
}

// ── 发送密码重置邮件 ──────────────────────────────────────────────────────────

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const locale = (formData.get("locale") as string) || "zh";
  const supabase = await createActionClient();
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/${locale}/update-password`,
  });
  if (error) return { error: error.message };
  return { success: true };
}

// ── 更新新密码 ────────────────────────────────────────────────────────────────
// 若携带 token_hash（来自重置邮件），先完成 verifyOtp 再更新密码，
// 在同一 Server Action 上下文中完成，避免 session cookie 跨 redirect 丢失。

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const tokenHash = formData.get("token_hash") as string | null;
  const supabase = await createActionClient();

  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });
    if (error) return { error: error.message };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect("/zh/account");
}

// ── 退出登录 ──────────────────────────────────────────────────────────────────

export async function signOutAction() {
  const supabase = await createActionClient();
  await supabase.auth.signOut();
  redirect("/zh");
}
