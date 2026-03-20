import { type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected, children, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "bg-primary text-white border-transparent"
          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
