"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { profileData, companyData, avatarUrl, logoUrl, isLoading, updateSettings } = useSettings();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && profileData) {
      setTimeout(() => {
        if (profileData.fullName) setFullName(profileData.fullName);
        if (profileData.phone) setPhone(profileData.phone);
      }, 0);
    }
  }, [isLoading, profileData]);

  const isProfileComplete = profileData?.fullName?.trim() && profileData?.phone?.trim();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    );
  }

  if (!isProfileComplete) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Bienvenue ! 🎉</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Avant de commencer à utiliser IziFacture, veuillez compléter votre profil utilisateur.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--color-text-main)]">Nom complet *</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--color-text-main)]">Numéro de téléphone *</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +225 01 02 03 04 05"
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <button 
              onClick={async () => {
                if (!fullName.trim() || !phone.trim()) return;
                setIsSaving(true);
                await updateSettings(
                  { ...profileData, fullName, phone }, 
                  companyData, 
                  avatarUrl, 
                  logoUrl
                );
                setIsSaving(false);
              }}
              disabled={isSaving || !fullName.trim() || !phone.trim()}
              className="mt-4 group flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
              )}
              {isSaving ? "Enregistrement..." : "Continuer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
