import { cn } from "../utils/cn";

interface DividerProps {
  vertical?: boolean;
  className?: string;
}

export function Divider({ vertical, className }: DividerProps) {
  if (vertical) {
    return <div className={cn("w-px self-stretch bg-gray-200", className)} />;
  }
  return <div className={cn("h-px w-full bg-gray-200", className)} />;
}
