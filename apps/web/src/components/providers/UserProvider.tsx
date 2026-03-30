"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createUmestayBrowserClient } from "@umestay/db";
import type { Profile } from "@umestay/db";
import { signOutAction } from "@/actions/auth";

interface UserContextValue {
  user: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  patchProfile: (patch: Partial<Profile>) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  patchProfile: () => {},
});

export function UserProvider({
  children,
  initialProfile,
}: {
  children: React.ReactNode;
  initialProfile?: Profile | null;
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile ?? null);
  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    // createUmestayBrowserClient() only called in the browser (inside useEffect).
    // Avoids dynamic process.env access during SSR which fails in the client bundle.
    const supabase = createUmestayBrowserClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const supabase = createUmestayBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) setProfile(data);
  };

  const patchProfile = (patch: Partial<Profile>) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : null));
  };

  const signOut = async () => {
    setProfile(null);
    const locale = window.location.pathname.split("/")[1] || "zh";
    await signOutAction(locale);
  };

  return (
    <UserContext.Provider value={{ user: profile, loading, signOut, refreshProfile, patchProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
