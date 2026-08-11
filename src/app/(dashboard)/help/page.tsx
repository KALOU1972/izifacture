"use client";

import { useState } from "react";
import { MessageSquare, Phone, Mail, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function HelpPage() {
  const { t } = useLanguage();
  const { companyData } = useSettings();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const FAQS = [
    {
      question: t.help.faq.q1,
      answer: t.help.faq.a1
    },
    {
      question: t.help.faq.q2,
      answer: t.help.faq.a2
    },
    {
      question: t.help.faq.q3,
      answer: t.help.faq.a3
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">{t.help.title}</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {t.help.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contact Info (Sidebar) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
              <CardTitle>{t.help.contact.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-main)]">{t.help.contact.email}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{companyData.email || "support@izifacture.com"}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{t.help.contact.emailDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-main)]">{t.help.contact.phone}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{companyData.phone || "+225 01 02 03 04 05"}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{t.help.contact.phoneDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-main)]">{t.help.contact.chat}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.help.contact.chatDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs and Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
              <CardTitle>{t.help.faq.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {FAQS.map((faq, index) => (
                <div key={index} className="group border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-[var(--color-text-main)] text-sm">{faq.question}</h3>
                    <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
              <CardTitle>{t.help.form.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => { 
                e.preventDefault(); 
                setShowSuccessModal(true); 
                (e.target as HTMLFormElement).reset();
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.help.form.subject}</label>
                    <select className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors">
                      <option>{t.help.form.subjects.tech}</option>
                      <option>{t.help.form.subjects.billing}</option>
                      <option>{t.help.form.subjects.suggestion}</option>
                      <option>{t.help.form.subjects.other}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.help.form.message}</label>
                  <textarea 
                    rows={5}
                    placeholder={t.help.form.placeholder}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                    required
                  />
                </div>
                <button type="submit" className="group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200">
                  <MessageSquare className="h-4 w-4" />
                  {t.help.form.send}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>

      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        title="Message envoyé !"
        description={t.help.form.success}
        type="success"
        confirmText="OK"
        hideCancel={true}
      />
    </div>
  );
}
