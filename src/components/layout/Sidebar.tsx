"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, FileText, Users, Settings, HelpCircle, Moon, Sun, X, Globe, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";

export function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, mounted } = useTheme();
  const { avatarUrl, profileData } = useSettings();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  useEffect(() => {
    if (isOpen) {
      setIsOpen?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const NAV_ITEMS = [
    { name: t.sidebar.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.sidebar.invoices, href: "/invoices", icon: FileText },
    { name: t.sidebar.clients, href: "/clients", icon: Users },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 z-50 h-[100dvh] overflow-y-auto w-64 border-r border-[var(--color-border)] bg-[var(--color-sidebar)] px-4 pt-6 pb-24 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen?.(false)}
          className="md:hidden absolute right-4 top-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-bold text-xl">
          I
        </div>
        <span className="text-xl font-bold text-[var(--color-text-main)]">IziFacture</span>
      </div>

      {/* Menu */}
      <div className="text-xs font-semibold text-[var(--color-text-muted)] mb-4 px-2 tracking-wider">
        MENU
      </div>
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen?.(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-main)] active:scale-[0.98] transition-all duration-200 data-[active=true]:bg-[var(--color-sidebar-hover)] data-[active=true]:text-[var(--color-text-main)]"
              data-active={isActive}
            >
              <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="space-y-1 mb-8 mt-auto border-t border-[var(--color-border)] pt-4">
        <Link
          href="/help"
          onClick={() => setIsOpen?.(false)}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-main)] active:scale-[0.98] transition-all duration-200 data-[active=true]:bg-[var(--color-sidebar-hover)] data-[active=true]:text-[var(--color-text-main)]"
          data-active={pathname === "/help"}
        >
          <HelpCircle className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
          {t.sidebar.help}
        </Link>
        <Link
          href="/settings"
          onClick={() => setIsOpen?.(false)}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-main)] active:scale-[0.98] transition-all duration-200 data-[active=true]:bg-[var(--color-sidebar-hover)] data-[active=true]:text-[var(--color-text-main)]"
          data-active={pathname === "/settings"}
        >
          <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
          {t.sidebar.settings}
        </Link>
        <div 
          onClick={toggleTheme}
          className="flex items-center justify-between px-3 py-2.5 group cursor-pointer hover:bg-[var(--color-sidebar-hover)] rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors duration-200">
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300" />
            )}
            {t.sidebar.darkMode}
          </div>
          {/* Toggle Switch */}
          <div className={`h-5 w-9 rounded-full relative transition-colors duration-300 flex items-center ${mounted && theme === 'dark' ? 'bg-[var(--color-primary)]' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
            <div className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${mounted && theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
          </div>
        </div>
        <div 
          onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
          className="flex items-center justify-between px-3 py-2.5 group cursor-pointer hover:bg-[var(--color-sidebar-hover)] rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors duration-200">
            <Globe className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            {t.sidebar.language}
          </div>
          <div className="text-xs font-bold text-[var(--color-text-main)] uppercase bg-[var(--color-border)] px-2 py-0.5 rounded">
            {language}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between rounded-xl bg-[var(--color-sidebar-hover)] p-3 mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            {avatarUrl ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border border-[var(--color-border)] shrink-0">
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </>
              </div>
            ) : (
              <Avatar fallback={profileData.fullName ? profileData.fullName.substring(0, 2).toUpperCase() : "U"} />
            )}
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-[var(--color-text-main)]">{profileData.fullName}</p>
              <p className="truncate text-xs text-[var(--color-text-muted)]">{profileData.email}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-status-overdue)] hover:bg-[var(--color-status-overdue-bg)] active:scale-[0.98] transition-all duration-200"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Déconnexion
        </button>
      </div>
    </aside>
    </>
  );
}
