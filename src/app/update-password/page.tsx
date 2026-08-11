"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Building, Loader2, Save } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optionally check if we have a valid session to update password
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If there is no session in the url hash, redirect to login
        // But the hash fragment from the email link usually sets it first
        const hash = window.location.hash;
        if (!hash.includes('access_token')) {
            router.push("/login");
        }
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl shadow-md mb-4">
            <Building className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)] text-center">
            Nouveau mot de passe
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1 text-center">
            Veuillez entrer votre nouveau mot de passe.
          </p>
        </div>

        {error && (
          <div className="bg-[var(--color-status-overdue-bg)] text-[var(--color-status-overdue)] p-3 rounded-lg text-sm mb-6 border border-[var(--color-status-overdue)]/20">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--color-text-main)]">
              Nouveau mot de passe (6 caractères min)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--color-text-main)]">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full group flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isLoading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
}
