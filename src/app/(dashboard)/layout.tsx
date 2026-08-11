"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { OnboardingGuard } from "@/components/layout/OnboardingGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider>
          <OnboardingGuard>
            <div className="min-h-screen bg-[var(--color-background)] transition-colors duration-300 print:bg-white">
              <div className="print:hidden">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              </div>
              <div className="flex flex-col md:pl-64 print:pl-0 min-h-screen">
                <div className="print:hidden">
                  <Header onMenuClick={() => setIsSidebarOpen(true)} />
                </div>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 print:p-0 print:pb-0 w-full max-w-7xl mx-auto overflow-x-hidden print:overflow-visible">
                  {children}
                </main>
              </div>
            </div>
          </OnboardingGuard>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
