"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Building, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Get the base URL correctly in Next.js app router
    const redirectUrl = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm relative">
        
        <Link href="/login" className="absolute top-6 left-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl shadow-md mb-4">
            <Building className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)] text-center">
            Mot de passe oublié
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1 text-center">
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {error && (
          <div className="bg-[var(--color-status-overdue-bg)] text-[var(--color-status-overdue)] p-3 rounded-lg text-sm mb-6 border border-[var(--color-status-overdue)]/20">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 flex flex-col items-center">
              <MailCheck className="h-10 w-10 text-green-500 mb-3" />
              <p className="text-sm font-medium">Email envoyé !</p>
              <p className="text-xs mt-1 text-green-600/80">
                Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.
              </p>
            </div>
            <Link href="/login" className="block text-[var(--color-primary)] font-semibold hover:underline text-sm pt-2">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--color-text-main)]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full group flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le lien"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
