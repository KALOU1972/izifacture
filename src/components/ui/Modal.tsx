import { CheckCircle2, AlertCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type?: "success" | "info" | "warning";
  buttonText?: string;
}

export function Modal({ isOpen, onClose, title, description, type = "success", buttonText = "Continuer" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm transform transition-all duration-300 animate-in zoom-in-95 fade-in">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
            type === "success" ? "bg-green-100 text-green-600" :
            type === "warning" ? "bg-orange-100 text-orange-600" :
            "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          }`}>
            {type === "success" && <CheckCircle2 className="h-8 w-8" />}
            {type === "warning" && <AlertCircle className="h-8 w-8" />}
            {type === "info" && <CheckCircle2 className="h-8 w-8" />}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-main)]">
              {title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-4 group flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all duration-200 hover:shadow-lg"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
