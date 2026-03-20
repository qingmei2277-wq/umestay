import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";

export type BtnVariant = "fill" | "outline" | "ghost" | "subtle";
export type BtnSize = "sm" | "md" | "lg";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<BtnVariant, string> = {
  fill:    "bg-primary text-white hover:bg-primary-600 disabled:bg-primary/50",
  outline: "border border-primary text-primary hover:bg-primary-50",
  ghost:   "text-primary hover:bg-primary-50",
  subtle:  "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

const sizeClasses: Record<BtnSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(
  ({ variant = "fill", size = "md", loading, fullWidth, icon, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        (disabled ?? loading) && "cursor-not-allowed opacity-60",
        className
      )}
      {...props}
    >
      {loading
        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        : icon}
      {children}
    </button>
  )
);
Btn.displayName = "Btn";
