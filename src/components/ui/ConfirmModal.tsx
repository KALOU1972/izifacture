import { AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  type = "info", 
  confirmText = "Confirmer",
  cancelText = "Annuler",
  hideCancel = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm transform transition-all duration-300 animate-in zoom-in-95 fade-in">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
            type === "danger" ? "bg-red-100 text-red-600" :
            type === "warning" ? "bg-orange-100 text-orange-600" :
            type === "success" ? "bg-green-100 text-green-600" :
            "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          }`}>
            {type === "danger" && <AlertTriangle className="h-8 w-8" />}
            {type === "warning" && <AlertCircle className="h-8 w-8" />}
            {type === "success" && <CheckCircle2 className="h-8 w-8" />}
            {type === "info" && <Info className="h-8 w-8" />}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-main)]">
              {title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full mt-6">
            {!hideCancel && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-text-main)] bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-sidebar-hover)] active:scale-95 transition-all duration-200"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all duration-200 hover:shadow-lg ${
                type === "danger" ? "bg-red-600 hover:bg-red-700" : 
                type === "warning" ? "bg-orange-600 hover:bg-orange-700" :
                type === "success" ? "bg-green-600 hover:bg-green-700" :
                "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
