"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  currency: string;
  language: string;
  role: 'admin' | 'agent';
  adminId: string | null;
}

export interface CompanyData {
  name: string;
  siret: string;
  email: string;
  phone: string;
  address: string;
}

interface SettingsContextType {
  avatarUrl: string | null;
  logoUrl: string | null;
  profileData: ProfileData;
  companyData: CompanyData;
  updateSettings: (profile: ProfileData, company: CompanyData, avatar: string | null, logo: string | null) => Promise<{error: string | null}>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    currency: "XOF",
    language: "fr",
    role: "admin",
    adminId: null
  });

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    siret: "",
    email: "",
    phone: "",
    address: ""
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (profile) {
        setProfileData({
          fullName: profile.full_name || "",
          email: profile.email || user.email || "",
          phone: profile.phone || "",
          currency: "XOF", // Hardcoded for now unless added to DB
          language: "fr",
          role: profile.role || "admin",
          adminId: profile.admin_id || null
        });
        setAvatarUrl(profile.avatar_url || null);
      } else {
        setProfileData(prev => ({ ...prev, email: user.email || "" }));
      }

      // Determine whose company settings to fetch
      // If user is an agent, we fetch their admin's company settings. Otherwise we fetch theirs.
      const targetUserId = profile?.role === 'agent' && profile?.admin_id ? profile.admin_id : user.id;

      // 2. Fetch Company Settings
      const { data: company } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (company) {
        setCompanyData({
          name: company.name || "",
          siret: company.siret || "",
          email: company.email || "",
          phone: company.phone || "",
          address: company.address || ""
        });
        setLogoUrl(company.logo_url || null);
      }

      setIsLoading(false);
    }

    loadSettings();
  }, [supabase]);

  const updateSettings = async (profile: ProfileData, company: CompanyData, avatar: string | null, logo: string | null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Utilisateur non connecté" };

    try {
      // 1. Update Profile
      const { data: existingProfile } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      let profileError = null;
      if (existingProfile) {
        const { error } = await supabase.from('profiles').update({
          full_name: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          avatar_url: avatar
        }).eq('user_id', user.id);
        profileError = error;
      } else {
        const { error } = await supabase.from('profiles').insert({
          user_id: user.id,
          full_name: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          avatar_url: avatar
        });
        profileError = error;
      }

      if (profileError) throw profileError;

      // 2. Update Company (ONLY if admin)
      if (profileData.role === 'admin') {
        const { data: existingCompany } = await supabase.from('company_settings').select('id').eq('user_id', user.id).maybeSingle();
        let companyError = null;
        if (existingCompany) {
          const { error } = await supabase.from('company_settings').update({
            name: company.name,
            siret: company.siret,
            email: company.email,
            phone: company.phone,
            address: company.address,
            logo_url: logo
          }).eq('user_id', user.id);
          companyError = error;
        } else {
          const { error } = await supabase.from('company_settings').insert({
            user_id: user.id,
            name: company.name,
            siret: company.siret,
            email: company.email,
            phone: company.phone,
            address: company.address,
            logo_url: logo
          });
          companyError = error;
        }

        if (companyError) throw companyError;
        setCompanyData(company);
        setLogoUrl(logo);
      }

      setProfileData(profile);
      setAvatarUrl(avatar);

      return { error: null };
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde :", err);
      return { error: err.message };
    }
  };

  return (
    <SettingsContext.Provider value={{ avatarUrl, logoUrl, profileData, companyData, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
