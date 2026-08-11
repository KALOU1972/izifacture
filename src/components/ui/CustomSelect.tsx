import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = "Sélectionner...", icon, label, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[var(--color-background)] border ${isOpen ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10' : 'border-[var(--color-border)]'} rounded-xl p-3 text-left flex items-center justify-between transition-all duration-200 hover:border-[var(--color-primary)]`}
      >
        <div className="flex items-center gap-3 truncate">
          {icon && <div className="shrink-0">{icon}</div>}
          <span className={`text-sm ${selectedOption ? 'text-[var(--color-text-main)] font-medium' : 'text-[var(--color-text-muted)]'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${value === option.value ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold' : 'text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)]'}`}
              >
                {option.label}
                {value === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
