import { cn } from "../utils/cn";

type AspectRatio = "square" | "4/3" | "16/9";

interface PhotoProps {
  src?: string | undefined;
  alt?: string;
  aspectRatio?: AspectRatio;
  className?: string;
  children?: React.ReactNode;
}

const aspectClasses: Record<AspectRatio, string> = {
  "square": "aspect-square",
  "4/3":    "aspect-[4/3]",
  "16/9":   "aspect-video",
};

export function Photo({ src, alt, aspectRatio = "4/3", className, children }: PhotoProps) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-gray-100", aspectClasses[aspectRatio], className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
          style={{ backgroundImage: "linear-gradient(#d4d4d4 1px,transparent 1px),linear-gradient(90deg,#d4d4d4 1px,transparent 1px)", backgroundSize: "30px 30px", opacity: 0.55 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1.4">
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-[10px] text-gray-400 tracking-widest uppercase font-normal">photo</span>
        </div>
      )}
      {children}
    </div>
  );
}
