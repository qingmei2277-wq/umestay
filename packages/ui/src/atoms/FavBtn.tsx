"use client";

import { useState } from "react";
import { cn } from "../utils/cn";

interface FavBtnProps {
  propertyId: string;
  initialFaved?: boolean;
  onToggle?: (faved: boolean, propertyId: string) => Promise<void>;
  className?: string;
}

export function FavBtn({ propertyId, initialFaved = false, onToggle, className }: FavBtnProps) {
  const [faved, setFaved] = useState(initialFaved);
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    if (pending) return;
    const next = !faved;
    setFaved(next);
    if (!onToggle) return;
    setPending(true);
    try {
      await onToggle(next, propertyId);
    } catch {
      setFaved(!next); // rollback on error
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); void toggle(); }}
      disabled={pending}
      aria-label={faved ? "取消收藏" : "收藏"}
      // className={cn(
      //   "p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-transform hover:scale-110",
      //   pending && "opacity-50 cursor-not-allowed",
      //   className
      // )}
      className={cn(
        "p-2 backdrop-blur-sm shadow-sm transition-transform hover:scale-110",
        pending && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <svg
        className={cn("w-5 h-5 transition-colors", faved ? "fill-accent-500 text-accent-500" : "fill-none text-gray-400")}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
