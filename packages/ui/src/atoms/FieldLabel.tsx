import { type LabelHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FieldLabel({ children, required, className, ...props }: FieldLabelProps) {
  return (
    <label
      className={cn(
        "block text-[10px] font-medium text-gray-500 mb-1 tracking-widest uppercase",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
