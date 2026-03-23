"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@umestay/ui";

interface CountdownButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  countdownLabel?: (s: number) => string;
  seconds?: number;
}

export function CountdownButton({
  onClick,
  disabled,
  className,
  children,
  countdownLabel,
  seconds = 60,
}: CountdownButtonProps) {
  const [remaining, setRemaining] = useState(0);

  const start = useCallback(() => {
    setRemaining(seconds);
    onClick();
  }, [seconds, onClick]);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const isCounting = remaining > 0;

  return (
    <button
      type="button"
      onClick={start}
      disabled={disabled || isCounting}
      className={cn(
        "w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
        isCounting || disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary-600",
        className
      )}
    >
      {isCounting
        ? countdownLabel
          ? countdownLabel(remaining)
          : `${remaining}s`
        : children}
    </button>
  );
}
