"use client";

import { useState, useEffect } from "react";
import { Save, User, Building, Bell, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { 
    avatarUrl: contextAvatarUrl, 
    logoUrl: contextLogoUrl, 
    profileData: contextProfile, 
    companyData: contextCompany, 
    updateSettings,
    isLoading: isContextLoading
  } = useSettings();

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    title: "", 
    desc: "", 
    type: "info" as "danger" | "warning" | "info" | "success",
    onConfirm: () => {} 
  });

  const [profileData, setProfileData] = useState({
    fullName: contextProfile?.fullName || "",
    email: contextProfile?.email || "",
    phone: contextProfile?.phone || "",
    password: "",
    currency: contextProfile?.currency || "XOF",
    language: contextProfile?.language || "fr",
    role: contextProfile?.role || "admin",
    adminId: contextProfile?.adminId || null
  });

  const [companyData, setCompanyData] = useState({
    name: contextCompany?.name || "",
    siret: contextCompany?.siret || "",
    email: contextCompany?.email || "",
    phone: contextCompany?.phone || "",
    address: contextCompany?.address || ""
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(contextAvatarUrl);
  const [logoUrl, setLogoUrl] = useState<string | null>(contextLogoUrl);

  useEffect(() => {
    if (!isContextLoading) {
      // eslint-disable-next-line
      setProfileData(prev => ({
        ...prev,
        fullName: contextProfile.fullName,
        email: contextProfile.email,
        phone: contextProfile.phone,
        currency: contextProfile.currency,
        language: contextProfile.language,
        role: contextProfile.role,
        adminId: contextProfile.adminId
      }));
      // eslint-disable-next-line
      setCompanyData(contextCompany);
      // eslint-disable-next-line
      setAvatarUrl(contextAvatarUrl);
      // eslint-disable-next-line
      setLogoUrl(contextLogoUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContextLoading]);

  const requestSave = () => {
    setConfirmModal({
      isOpen: true,
      title: "Enregistrer les modifications",
      desc: "Voulez-vous vraiment enregistrer ces paramètres ?",
      type: "info",
      onConfirm: () => handleSave()
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateSettings(profileData, companyData, avatarUrl, logoUrl);
    setIsSaving(false);

    if (error) {
      setConfirmModal({
        isOpen: true,
        title: "Erreur",
        desc: "Une erreur s'est produite lors de la sauvegarde : " + error,
        type: "danger",
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (isContextLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Save Success Toast */}
      {isSaved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10b981] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-semibold">Modifications enregistrées avec succès !</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">{t.settings.title}</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {t.settings.subtitle}
          </p>
        </div>
        {(activeTab !== 'company' || profileData.role === 'admin') && (
          <button 
            onClick={requestSave}
            disabled={isSaving}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            )}
            {isSaving ? "Enregistrement..." : t.settings.save}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Navigation Sidebar inside Settings */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          <button 
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex shrink-0 lg:shrink items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all duration-200 text-left ${activeTab === "profile" ? "bg-black text-white shadow-md scale-[1.02]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-main)]"}`}
          >
            <User className="h-5 w-5" />
            {t.settings.tabs.profile}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("company")}
            className={`w-full flex shrink-0 lg:shrink items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all duration-200 text-left ${activeTab === "company" ? "bg-black text-white shadow-md scale-[1.02]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-main)]"}`}
          >
            <Building className="h-5 w-5" />
            {t.settings.tabs.company}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex shrink-0 lg:shrink items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all duration-200 text-left ${activeTab === "notifications" ? "bg-black text-white shadow-md scale-[1.02]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-main)]"}`}
          >
            <Bell className="h-5 w-5" />
            {t.settings.tabs.notifications}
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className={activeTab === "profile" ? "block space-y-6" : "hidden"}>
            <Card>
              <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
                <CardTitle>{t.settings.profile.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-[var(--color-border)] shadow-sm">
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      </>
                    </div>
                  ) : (
                    <Avatar fallback={profileData.fullName.substring(0, 2).toUpperCase() || "MK"} />
                  )}
                  <div>
                    <label className="cursor-pointer inline-block px-3 py-1.5 rounded-lg bg-[var(--color-sidebar-hover)] text-sm font-medium text-[var(--color-text-main)] hover:!bg-black hover:!text-white hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 mr-2">
                      {t.settings.profile.changeAvatar}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onloadend = () => setAvatarUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                    <button type="button" onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        title: "Supprimer l'avatar",
                        desc: "Voulez-vous vraiment supprimer votre avatar ?",
                        type: "danger",
                        onConfirm: () => { setAvatarUrl(null); setConfirmModal(prev => ({ ...prev, isOpen: false })); }
                      });
                    }} className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-status-overdue)] hover:bg-[var(--color-status-overdue)]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200">
                      {t.settings.profile.deleteAvatar}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.profile.fullName}</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.profile.email}</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none opacity-60 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.profile.phone || "Téléphone"}</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.profile.password}</label>
                    <input 
                      type="password" 
                      value={profileData.password}
                      onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                      placeholder="•••••••• (Laissez vide pour conserver)"
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
                <CardTitle>{t.settings.profile.regional}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.profile.currency}</label>
                    <select 
                      value={profileData.currency}
                      onChange={(e) => setProfileData({...profileData, currency: e.target.value})}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    >
                      <option value="XOF">Franc CFA (XOF)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar Américain ($)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.profile.language}</label>
                    <select 
                      value={profileData.language}
                      onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    >
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={activeTab === "company" ? "block" : "hidden"}>
            <Card>
              <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
                <CardTitle>{t.settings.company.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.company.logo || "Logo de l'entreprise"}</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-16 w-16 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                      {logoUrl ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logoUrl} alt="Logo de l'entreprise" className="h-full w-full object-contain p-1" />
                        </>
                      ) : (
                        <Building className="h-8 w-8 text-[var(--color-text-muted)]" />
                      )}
                    </div>
                    {profileData.role === 'admin' && (
                      <div>
                        <label className="cursor-pointer inline-block px-3 py-1.5 rounded-lg bg-[var(--color-sidebar-hover)] text-sm font-medium text-[var(--color-text-main)] hover:!bg-black hover:!text-white hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 mr-2">
                          {t.settings.company.uploadLogo || "Importer un logo"}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onloadend = () => setLogoUrl(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                        <button type="button" onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: "Supprimer le logo",
                            desc: "Voulez-vous vraiment supprimer le logo de l'entreprise ?",
                            type: "danger",
                            onConfirm: () => { setLogoUrl(null); setConfirmModal(prev => ({ ...prev, isOpen: false })); }
                          });
                        }} className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-status-overdue)] hover:bg-[var(--color-status-overdue)]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200">
                          {t.settings.company.deleteLogo || "Supprimer"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.company.name}</label>
                  <input 
                    type="text" 
                    value={companyData.name}
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    disabled={profileData.role === 'agent'}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.company.siret}</label>
                  <input 
                    type="text" 
                    value={companyData.siret}
                    onChange={(e) => setCompanyData({...companyData, siret: e.target.value})}
                    disabled={profileData.role === 'agent'}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.company.email || "Email de contact"}</label>
                    <input 
                      type="email" 
                      value={companyData.email}
                      onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                      disabled={profileData.role === 'agent'}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.company.phone || "Téléphone de contact"}</label>
                    <input 
                      type="tel" 
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                      disabled={profileData.role === 'agent'}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.settings.company.address}</label>
                  <textarea 
                    rows={3} 
                    value={companyData.address}
                    onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                    disabled={profileData.role === 'agent'}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  ></textarea>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={activeTab === "notifications" ? "block" : "hidden"}>
            <Card>
              <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
                <CardTitle>{t.settings.notifications.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--color-primary)] rounded" />
                  <div>
                    <div className="font-semibold text-sm text-[var(--color-text-main)]">{t.settings.notifications.payments.title}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{t.settings.notifications.payments.desc}</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--color-primary)] rounded" />
                  <div>
                    <div className="font-semibold text-sm text-[var(--color-text-main)]">{t.settings.notifications.reminders.title}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{t.settings.notifications.reminders.desc}</div>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.desc}
        type={confirmModal.type}
      />
    </div>
  );
}
