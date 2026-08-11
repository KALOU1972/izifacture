import { cn } from "@/lib/utils";
import Image from "next/image";

export function Avatar({ src, fallback, className }: { src?: string; fallback: string; className?: string }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-border)]", className)}>
      {src ? (
        <Image src={src} alt="Avatar" width={40} height={40} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--color-sidebar-hover)] text-sm font-medium text-[var(--color-text-main)]">
          {fallback}
        </div>
      )}
    </div>
  );
}
