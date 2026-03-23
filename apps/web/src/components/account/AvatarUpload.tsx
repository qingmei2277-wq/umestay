"use client";

import { useRef, useState } from "react";
import { createUmestayBrowserClient } from "@umestay/db";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  name: string;
  uploadLabel: string;
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  name,
  uploadLabel,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createUmestayBrowserClient();
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${userId}/avatar.webp`, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(publicUrl);
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", userId);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-20 h-20 rounded-full bg-primary-100 border-2 border-primary/20 overflow-hidden flex items-center justify-center hover:border-primary transition-colors"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-primary text-3xl font-semibold">
            {(name || "U")[0].toUpperCase()}
          </span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-sm text-primary hover:underline disabled:opacity-50"
      >
        {uploadLabel}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
