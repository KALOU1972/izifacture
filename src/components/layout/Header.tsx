import { Search, Menu } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="md:hidden shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-2 max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-[var(--color-background)] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[var(--color-border)] focus-within:border-[var(--color-primary)] transition-colors ml-4 sm:ml-auto">
        <Search className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="bg-transparent border-none outline-none w-full text-xs sm:text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]"
        />
        <div className="hidden lg:flex shrink-0 items-center justify-center rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)] border border-[var(--color-border)] shadow-sm">
          ⌘ K
        </div>
      </div>
    </header>
  );
}
