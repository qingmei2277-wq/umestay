"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
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
        // Server Component context
      }
    },
  });
}

export async function toggleFavorite(propertyId: string) {
  const supabase = await createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("favorites")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .single();

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId);
    revalidatePath("/[locale]/favorites", "page");
    return { faved: false };
  } else {
    await supabase
      .from("favorites")
      .insert({ user_id: user.id, property_id: propertyId });
    revalidatePath("/[locale]/favorites", "page");
    return { faved: true };
  }
}
