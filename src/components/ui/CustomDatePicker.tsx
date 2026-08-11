import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomDatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function CustomDatePicker({ label, value, onChange, className = "" }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse initial date or use today
  const initialDate = value ? new Date(value) : new Date();
  if (isNaN(initialDate.getTime())) {
    initialDate.setTime(new Date().getTime());
  }

  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

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

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    // Format to YYYY-MM-DD
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value && new Date(value).getDate() === day && new Date(value).getMonth() === currentMonth && new Date(value).getFullYear() === currentYear;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleSelectDate(day)}
          className={`h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
            isSelected 
              ? 'bg-[var(--color-primary)] text-white shadow-md' 
              : 'text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)]'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Formatting display value
  const displayValue = value ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "Sélectionner...";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[var(--color-background)] border ${isOpen ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10' : 'border-[var(--color-border)]'} rounded-xl p-3 text-left flex items-center gap-3 transition-all duration-200 hover:border-[var(--color-primary)]`}
      >
        <CalendarIcon className="h-5 w-5 text-[var(--color-text-muted)] shrink-0" />
        <span className={`text-sm ${value ? 'text-[var(--color-text-main)] font-medium' : 'text-[var(--color-text-muted)]'}`}>
          {displayValue}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-72 mt-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-[var(--color-sidebar-hover)] text-[var(--color-text-muted)] transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-bold text-[var(--color-text-main)]">
              {MONTHS[currentMonth]} {currentYear}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-[var(--color-sidebar-hover)] text-[var(--color-text-muted)] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
}
