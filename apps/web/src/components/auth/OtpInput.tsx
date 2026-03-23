"use client";

import { useRef, useState, useCallback } from "react";

interface OtpInputProps {
  name: string;
  length?: number;
  onChange?: (value: string) => void;
}

export function OtpInput({ name, length = 6, onChange }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const fullValue = digits.join("");

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Allow paste of full OTP
      if (value.length > 1) {
        const pasted = value.replace(/\D/g, "").slice(0, length);
        const next = Array(length).fill("");
        pasted.split("").forEach((c, i) => (next[i] = c));
        setDigits(next);
        onChange?.(next.join(""));
        inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
        return;
      }

      const digit = value.replace(/\D/g, "");
      const next = [...digits];
      next[index] = digit;
      setDigits(next);
      onChange?.(next.join(""));
      if (digit && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [digits, length, onChange]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  return (
    <div className="flex gap-2 justify-center">
      <input type="hidden" name={name} value={fullValue} />
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={length}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      ))}
    </div>
  );
}
