"use client";

import { useRef, useState } from "react";
import { useUser } from "@/components/providers/UserProvider";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  name: string;
  uploadLabel: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  name,
  uploadLabel,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { patchProfile } = useUser();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/avatar", { method: "POST", body });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "上传失败，请重试");

      setAvatarUrl(json.url);
      patchProfile({ avatar_url: json.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败，请重试");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
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

      {error && (
        <p className="text-xs text-red-500 text-center max-w-[200px]">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
