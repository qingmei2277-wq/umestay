"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createUmestayServerClient, createUmestayServiceClient } from "@umestay/db";

export async function submitVerificationAction(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createUmestayServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {}
    },
  });
  const serviceClient = createUmestayServiceClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const frontFile = formData.get("front") as File;
  const backFile = formData.get("back") as File | null;
  const docType = formData.get("doc_type") as string;

  const { data: kyc, error } = await supabase
    .from("kyc_verifications")
    .insert({ user_id: user.id, doc_type: docType, status: "pending" })
    .select("id")
    .single();
  if (error) return { error: "提交失败，请重试" };

  await serviceClient.storage
    .from("kyc-documents")
    .upload(`${user.id}/${kyc.id}/front`, frontFile, { upsert: true });

  if (backFile && backFile.size > 0) {
    await serviceClient.storage
      .from("kyc-documents")
      .upload(`${user.id}/${kyc.id}/back`, backFile, { upsert: true });
  }

  revalidatePath("/[locale]/account/profile", "page");
}
