import { cn } from "@/lib/utils";

/**
 * The Tethra mark, drawn with the supplied logo geometry.
 * Uses currentColor so it reads correctly on light and dark surfaces.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="230 85 220 270"
      role="img"
      aria-label="Tethra logo"
      className={cn("h-7 w-7", className)}
      fill="none"
    >
      <path
        d="M 250 165 L 300 105 L 340 145 L 380 105 L 430 165 L 375 165 L 375 300 L 305 300 L 305 165 Z"
        fill="currentColor"
      />
      <path
        d="M 255 330 Q 300 312 340 330 Q 380 348 425 330"
        fill="none"
        stroke="currentColor"
        strokeWidth={14}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-foreground", className)}>
      <LogoMark />
      <span className="font-display text-lg font-semibold tracking-tight">Tethra</span>
    </span>
  );
}
