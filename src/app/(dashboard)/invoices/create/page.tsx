"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Send, Check, CheckCircle, Loader2 } from "lucide-react";
import { formatFCFA, formatDate } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

type Client = Database['public']['Tables']['clients']['Row'];

// Custom Input Component to match the screenshot style
interface FloatingInputProps {
  label: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}
const FloatingInput = ({ label, value, onChange, type = "text", icon, placeholder, disabled = false, required = false }: FloatingInputProps) => (
  <div className="relative border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-primary)] transition-colors bg-[var(--color-surface)]">
    <label className="absolute -top-2 left-3 bg-[var(--color-surface)] px-1 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
      {label} {required && <span className="text-[var(--color-status-overdue)]">*</span>}
    </label>
    <div className="flex items-center px-3 py-2.5">
      {icon && <span className="text-[var(--color-text-muted)] mr-2 shrink-0">{icon}</span>}
      <input 
        type={type} 
        className="w-full text-sm font-semibold text-[var(--color-text-main)] bg-transparent outline-none placeholder-[var(--color-text-muted)]" 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  </div>
);



export default function CreateInvoicePage() {
  const { t } = useLanguage();
  const { logoUrl, profileData, companyData } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const editId = searchParams.get("edit");
  
  const [activeTab, setActiveTab] = useState("Standard");
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [modalState, setModalState] = useState<{isOpen: boolean, title: string, desc: string}>( {isOpen: false, title: "", desc: ""} );
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    title: "", 
    desc: "", 
    type: "info" as "danger" | "warning" | "info" | "success",
    onConfirm: () => {},
    hideCancel: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [fullName, setFullName] = useState(profileData?.fullName || "Administrateur");
  const [clientId, setClientId] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [addDiscount, setAddDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);

  const [splitCount, setSplitCount] = useState(2);
  const [recurrenceFreq, setRecurrenceFreq] = useState("Mensuelle");

  const [items, setItems] = useState([
    { id: "1", description: "Design System UI", quantity: 1, unitPrice: 250000, tax: 18 }
  ]);

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    async function loadData() {
      // Load clients
      const { data: clientsData } = await supabase.from('clients').select('*');
      if (clientsData) setClients(clientsData);

      if (editId) {
        // Load existing invoice
        const { data: invoice } = await supabase.from('invoices').select('*').eq('id', editId).single();
        if (invoice) {
          setInvoiceNumber(invoice.invoice_number);
          setClientId(invoice.client_id);
          setDate(invoice.issue_date);
          setDueDate(invoice.due_date);
          
          if (clientsData) {
            const c = clientsData.find(cl => cl.id === invoice.client_id);
            if (c) setClientEmail(c.email);
          }

          // Load items
          const { data: itemsData } = await supabase.from('invoice_items').select('*').eq('invoice_id', editId);
          if (itemsData && itemsData.length > 0) {
            setItems(itemsData.map(item => ({
              id: item.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              tax: 18 // Simplify for now since we didn't store tax % per item in the initial schema
            })));
          }
        }
      } else {
        // Generate new invoice number
        const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true });
        const nextNum = (count || 0) + 1;
        setInvoiceNumber(`INV-2026-${String(nextNum).padStart(3, '0')}`);
      }
      setIsLoading(false);
    }
    loadData();
  }, [editId, supabase]);

  useEffect(() => {
    if (clientId) {
      const selected = clients.find(c => c.id === clientId);
      if (selected) {
        setClientEmail(selected.email);
      }
    }
  }, [clientId, clients]);

  const client = clients.find(c => c.id === clientId);

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0, tax: 18 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.tax / 100)), 0);
  const discountAmount = addDiscount ? discountValue : 0;
  
  const isOverdue = dueDate && new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
  const penaltyAmount = isOverdue ? Math.round((subTotal + taxAmount) * 0.1) : 0;
  const grandTotal = Math.round(subTotal + taxAmount - discountAmount + penaltyAmount);

  const isDueDateValid = !!dueDate && new Date(dueDate) >= new Date(date);
  const canSaveDefinitive = !!clientId && isDueDateValid;

  const requestSaveInvoice = (status: "Brouillon" | "Envoyée" | "Payée") => {
    if (status !== "Brouillon" && !isDueDateValid) {
      setConfirmModal({
        isOpen: true,
        title: "Action impossible",
        desc: "Veuillez sélectionner une date d'échéance valide (qui n'est pas antérieure à la date d'émission).",
        type: "warning",
        onConfirm: () => {},
        hideCancel: true
      });
      return;
    }

    const actionText = status === "Brouillon" ? "sauvegarder cette facture en brouillon" 
                     : status === "Envoyée" ? "envoyer cette facture" 
                     : "marquer cette facture comme payée";

    setConfirmModal({
      isOpen: true,
      title: "Confirmer l'opération",
      desc: `Voulez-vous vraiment ${actionText} ?`,
      type: "info",
      onConfirm: () => handleSaveInvoice(status),
      hideCancel: false
    });
  };

  const handleSaveInvoice = async (status: "Brouillon" | "Envoyée" | "Payée") => {
    setIsSaving(true);
    let currentInvoiceId = editId;

    if (editId) {
      // Update existing
      await supabase.from('invoices').update({
        client_id: clientId,
        invoice_number: invoiceNumber,
        status: status,
        issue_date: date,
        due_date: dueDate,
        subtotal: subTotal,
        tax_amount: taxAmount,
        total: grandTotal,
        notes: "" // Not implemented in form yet
      }).eq('id', editId);

      // Delete old items and insert new ones
      await supabase.from('invoice_items').delete().eq('invoice_id', editId);
    } else {
      // Insert new
      const { data: insertedInvoice } = await supabase.from('invoices').insert({
        client_id: clientId,
        invoice_number: invoiceNumber,
        status: status,
        issue_date: date,
        due_date: dueDate,
        subtotal: subTotal,
        tax_amount: taxAmount,
        total: grandTotal
      }).select('id').single();
      
      if (insertedInvoice) {
        currentInvoiceId = insertedInvoice.id;
      }
    }

    if (currentInvoiceId) {
      // Insert items
      const itemsToInsert = items.map(item => ({
        invoice_id: currentInvoiceId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        amount: item.unitPrice * item.quantity
      }));
      await supabase.from('invoice_items').insert(itemsToInsert);
    }

    setIsSaving(false);

    if (status === "Brouillon") {
      setModalState({
        isOpen: true,
        title: "Sauvegardée",
        desc: "Facture sauvegardée en brouillon avec succès !"
      });
    } else if (status === "Payée") {
      setModalState({
        isOpen: true,
        title: "Enregistrée et Payée",
        desc: "La facture a été enregistrée avec le statut Payée."
      });
    } else {
      setModalState({
        isOpen: true,
        title: "Envoyée !",
        desc: "Votre facture a été envoyée avec succès au client."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-[var(--color-text-muted)] text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full max-w-[1600px] mx-auto print:block">
      <style type="text/css" dangerouslySetInnerHTML={{__html: "@media print { @page { size: portrait; margin: 10mm; } body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } .print\\:hidden { display: none !important; } }" }} />
      {/* LEFT COLUMN: FORM */}
      <div className={`flex flex-col space-y-8 print:hidden ${showPreviewMobile ? 'hidden xl:flex' : 'flex'}`}>
        
        {/* Header Left */}
        <div>
          <div className="flex items-center text-xs font-semibold text-[var(--color-text-muted)] mb-2">
            <Link href="/invoices" className="hover:text-[var(--color-primary)] transition-colors">{t.sidebar.invoices}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[var(--color-text-main)]">{t.createInvoice.title}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">{t.createInvoice.title}</h1>
              <p className="text-[var(--color-text-muted)] text-sm">{t.createInvoice.subtitle}</p>
            </div>
            {/* Mobile toggle for preview */}
            <button 
              onClick={() => setShowPreviewMobile(true)}
              className="xl:hidden px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-semibold flex items-center gap-2"
            >
              {t.createInvoice.showPreview} <div className="h-4 w-7 bg-[var(--color-primary)] rounded-full relative"><div className="absolute right-0.5 top-0.5 h-3 w-3 bg-white rounded-full"></div></div>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
          {[{ id: "Standard", label: t.createInvoice.tabs.standard }, { id: "Fractionnée", label: t.createInvoice.tabs.split }, { id: "Récurrente", label: t.createInvoice.tabs.recurring }].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "Fractionnée" && (
          <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-bold text-[var(--color-text-main)]">Paiement fractionné</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Le montant total sera divisé en plusieurs échéances égales.</p>
            <div className="w-full sm:w-64">
              <CustomSelect 
                label="Nombre de paiements"
                value={splitCount.toString()} 
                onChange={(val) => setSplitCount(Number(val))} 
                icon={<span className="text-gray-400">📅</span>}
                options={[
                  { value: "2", label: "En 2 fois" },
                  { value: "3", label: "En 3 fois" },
                  { value: "4", label: "En 4 fois" },
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === "Récurrente" && (
          <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-bold text-[var(--color-text-main)]">Facturation récurrente</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Cette facture sera générée et envoyée automatiquement à la fréquence choisie.</p>
            <div className="w-full sm:w-64">
              <CustomSelect 
                label="Fréquence"
                value={recurrenceFreq} 
                onChange={(val) => setRecurrenceFreq(String(val))} 
                icon={<span className="text-gray-400">🔄</span>}
                options={[
                  { value: "Hebdomadaire", label: "Chaque semaine" },
                  { value: "Mensuelle", label: "Chaque mois" },
                  { value: "Trimestrielle", label: "Chaque trimestre" },
                  { value: "Annuelle", label: "Chaque année" },
                ]}
              />
            </div>
          </div>
        )}

        {/* Invoice Information Form */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-[var(--color-text-main)]">{t.createInvoice.info.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FloatingInput 
              label={t.createInvoice.info.fullName} 
              required 
              value={fullName} onChange={(e) => setFullName(e.target.value)} 
              icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden"><UserIcon /></div>}
              placeholder="Ex: Angelina Carol"
            />
            <CustomSelect 
              label={t.createInvoice.info.billedTo} 
              value={clientId} onChange={(val) => setClientId(String(val))} 
              icon={<div className="w-5 h-5 bg-green-800 text-white rounded flex items-center justify-center text-xs font-black">#</div>}
              options={clients.map(c => ({ value: c.id, label: c.name }))}
            />

            <CustomDatePicker 
              label={t.createInvoice.info.dateIssue} 
              value={date} onChange={(val) => setDate(val)} 
            />
            <div className="space-y-1">
              <CustomDatePicker 
                label={t.createInvoice.info.dueDate} 
                value={dueDate} onChange={(val) => setDueDate(val)} 
              />
              {dueDate && new Date(dueDate) < new Date(date) && (
                <p className="text-[10px] text-[var(--color-status-overdue)] font-semibold px-2">
                  L&apos;échéance ne peut pas précéder l&apos;émission.
                </p>
              )}
            </div>
          </div>
          <FloatingInput 
            label={t.createInvoice.info.invoiceNumber} 
            value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} 
            icon={<span className="font-bold text-lg leading-none">#</span>}
          />
        </div>

        {/* Invoice Items/Service */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[var(--color-text-main)]">{t.createInvoice.items.title}</h2>
          
          <CustomSelect 
            label={t.createInvoice.items.currency} 
            value={currency} onChange={(val) => setCurrency(String(val))} 
            icon={<span className="text-lg">💰</span>}
            options={[
              { value: "XOF", label: "FCFA" },
              { value: "USD", label: "Dollar Américain" },
              { value: "EUR", label: "Euro" }
            ]}
          />

          {/* Items List */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-surface)] relative group">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-[var(--color-text-muted)]">{t.createInvoice.items.itemName.split(' ')[0]} {index + 1}</span>
                  <div className="flex items-center gap-2">
                    {items.length > 1 && (
                      <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-[var(--color-primary)]">
                      <span className="text-xs">^</span> {/* simulated expand/collapse icon */}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <FloatingInput 
                    label={t.createInvoice.items.itemName} 
                    value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} 
                    icon={<span className="text-gray-400">❖</span>}
                  />
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3">
                      <FloatingInput 
                        label={t.createInvoice.items.qty} 
                        type="number"
                        value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)} 
                        icon={<span className="text-gray-400">📚</span>}
                      />
                    </div>
                    <div className="col-span-3">
                      <CustomSelect 
                        label={t.createInvoice.items.tax} 
                        value={item.tax} onChange={(val) => handleItemChange(item.id, 'tax', Number(val))} 
                        icon={<span className="text-gray-400">%</span>}
                        options={[ { value: 0, label: "0%" }, { value: 10, label: "10%" }, { value: 18, label: "18%" } ]}
                      />
                    </div>
                    <div className="col-span-6">
                      <FloatingInput 
                        label={t.createInvoice.items.amount} 
                        type="number"
                        value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', parseInt(e.target.value) || 0)} 
                        icon={<span className="text-gray-400">$</span>}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleAddItem}
            className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 font-medium active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            {t.createInvoice.items.addBtn}
          </button>
        </div>

        {/* Footer actions of left pane */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className={`w-5 h-5 rounded border ${addDiscount ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-gray-300'} flex items-center justify-center transition-colors`}>
              {addDiscount && <Check className="h-3 w-3" />}
            </div>
            <input type="checkbox" className="hidden" checked={addDiscount} onChange={() => setAddDiscount(!addDiscount)} />
            <span className="text-sm font-semibold text-[var(--color-text-main)]">{t.createInvoice.discount.add}</span>
          </label>

          {addDiscount && (
            <div className="w-40">
              <FloatingInput 
                label={t.createInvoice.discount.amount} 
                type="number"
                value={discountValue} onChange={(e) => setDiscountValue(parseInt(e.target.value) || 0)} 
              />
            </div>
          )}
        </div>
        
        <div className="h-10"></div> {/* padding bottom */}
      </div>

      {/* RIGHT COLUMN: PREVIEW */}
      <div className={`flex-col h-full print:flex ${showPreviewMobile ? 'flex' : 'hidden xl:flex'}`}>
        
        {/* Header Right */}
        <div className="flex items-center justify-between bg-[var(--color-background)] sticky top-0 z-10 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            {showPreviewMobile && (
              <button onClick={() => setShowPreviewMobile(false)} className="xl:hidden p-2 rounded-lg bg-[var(--color-sidebar-hover)] text-gray-600">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">{t.createInvoice.preview.title}</h2>
            <div className="flex items-stretch gap-2 xl:gap-3">
              <button disabled={!canSaveDefinitive || isSaving} onClick={() => requestSaveInvoice("Envoyée")} className="group flex flex-col justify-center items-center px-3 py-2 rounded-lg text-xs xl:text-sm font-medium text-[var(--color-text-main)] bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 active:scale-95 transition-all hidden sm:flex text-center leading-tight disabled:opacity-50 disabled:cursor-not-allowed">
                {t.createInvoice.preview.emailBtn}
              </button>
              <button disabled={!clientId} onClick={() => window.print()} className="group flex flex-col justify-center items-center px-3 py-2 rounded-lg text-xs xl:text-sm font-medium text-[var(--color-text-main)] bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 active:scale-95 transition-all hidden sm:flex text-center leading-tight disabled:opacity-50 disabled:cursor-not-allowed">
                {t.createInvoice.preview.pdfBtn}
              </button>
            </div>
          </div>
          <div className="flex items-stretch gap-2 xl:gap-3">
            <button 
              onClick={() => requestSaveInvoice("Brouillon")}
              disabled={isSaving}
              className="group flex flex-col justify-center items-center gap-1 xl:flex-row xl:gap-2 px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium text-[var(--color-text-main)] bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 active:scale-95 active:translate-y-0 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 hidden sm:flex text-center leading-tight disabled:opacity-50"
            >
              {t.createInvoice.preview.saveDraft}
            </button>
            <button 
              disabled={!canSaveDefinitive || isSaving}
              onClick={() => requestSaveInvoice("Envoyée")}
              className="group flex flex-col justify-center items-center gap-1 xl:flex-row xl:gap-2 px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 text-center leading-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:!bg-[var(--color-primary)]/10 disabled:hover:!text-[var(--color-primary)]"
            >
              <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              {t.createInvoice.preview.send}
            </button>
            <button 
              disabled={!canSaveDefinitive || isSaving}
              onClick={() => requestSaveInvoice("Payée")}
              className="group flex flex-col justify-center items-center gap-1 xl:flex-row xl:gap-2 px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium text-[#10b981] bg-[#10b981]/10 hover:!bg-[#10b981] hover:!text-white active:!bg-[#10b981] active:!text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 text-center leading-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:!bg-[#10b981]/10 disabled:hover:!text-[#10b981]"
            >
              <CheckCircle className="h-4 w-4" />
              Payée
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 bg-gray-100 rounded-2xl p-2 sm:p-4 md:p-8 overflow-y-auto relative custom-scrollbar flex justify-center">
          
          {/* Simulated Paper */}
          <div className="bg-white shadow-2xl rounded w-full max-w-[800px] min-h-[900px] p-4 sm:p-8 md:p-12 font-sans relative flex flex-col">
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-gray-50 border-l border-b border-gray-100 rounded-bl-3xl"></div>

            <div className="relative z-10">
              {/* Invoice Top Header */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-16 gap-4 sm:gap-0">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 uppercase">{t.createInvoice.preview.invoice}</h1>
                  <p className="text-sm font-semibold text-gray-500 mt-1 sm:mt-2">{t.createInvoice.info.invoiceNumber} <span className="font-normal text-gray-400 block sm:inline"># {invoiceNumber || "INV-XXXX"}</span></p>
                </div>
                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-[#0f3b30] rounded-full flex items-center justify-center text-white relative overflow-hidden self-end sm:self-auto">
                  {logoUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    </>
                  ) : (
                    <div className="absolute w-8 h-8 flex items-center justify-center">
                      {/* Simulated logo */}
                      <div className="w-1 h-8 bg-[#8ce99a] absolute rotate-45"></div>
                      <div className="w-1 h-8 bg-[#8ce99a] absolute -rotate-45"></div>
                      <div className="w-8 h-1 bg-[#8ce99a] absolute"></div>
                      <div className="w-1 h-8 bg-[#8ce99a] absolute"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 mb-1">{t.createInvoice.preview.billedBy}</h3>
                  <p className="font-bold text-gray-900 text-base sm:text-lg">{fullName || "Votre Nom"}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 mb-1">{t.createInvoice.info.billedTo} :</h3>
                  <p className="font-bold text-gray-900 break-words">{client?.name || "Nom du Client"}</p>
                  <p className="text-sm text-gray-500 break-words">{clientEmail || "email@client.com"}</p>
                  <p className="text-sm text-gray-500 break-words">{client?.address || "Adresse du client"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 mb-1">{t.createInvoice.info.dateIssue} :</h3>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">{formatDate(date)}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 mb-1">{t.createInvoice.info.dueDate} :</h3>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">{formatDate(dueDate)}</p>
                </div>
              </div>

              {/* Table */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4">{t.createInvoice.items.title} :</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[300px]">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-gray-400">{t.createInvoice.items.itemName}</th>
                        <th className="py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-gray-400 text-center">{t.createInvoice.items.qty}</th>
                        <th className="py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-gray-400 text-center">{t.createInvoice.items.tax}</th>
                        <th className="py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-gray-400 text-right">{t.createInvoice.items.amount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.id} className="border-b border-gray-50">
                          <td className="py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 break-words max-w-[120px] sm:max-w-none">{item.description || `Article ${idx+1}`}</td>
                          <td className="py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-600 text-center">{item.quantity}</td>
                          <td className="py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-600 text-center">{item.tax}%</td>
                          <td className="py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-900 text-right whitespace-nowrap">{formatFCFA(item.unitPrice * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex sm:justify-end mb-12 border-b-2 border-gray-100 pb-8">
                <div className="w-full sm:w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-600">{t.createInvoice.preview.subtotal}</span>
                    <span className="font-bold text-gray-900">{formatFCFA(subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-600">{t.createInvoice.preview.taxes}</span>
                    <span className="font-bold text-gray-900">{formatFCFA(taxAmount)}</span>
                  </div>
                  {addDiscount && (
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span className="font-bold">{t.createInvoice.preview.discount}</span>
                      <span className="font-bold">- {formatFCFA(discountAmount)}</span>
                    </div>
                  )}
                  {isOverdue && (
                    <div className="flex justify-between text-red-500 font-semibold text-sm">
                      <span>Pénalité retard (10%)</span>
                      <span>{formatFCFA(penaltyAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 mt-2 border-t-2 border-gray-900">
                    <span className="font-black text-gray-900">{t.createInvoice.preview.grandTotal}</span>
                    <span className="font-black text-gray-900">{formatFCFA(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Notes removed from here to be placed in footer */}

              {/* Footer / Signature */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 sm:gap-4">
                <div className="order-2 sm:order-1">
                  <h3 className="text-xs font-bold text-gray-400 mb-1">{t.createInvoice.preview.paymentMethod}</h3>
                  <p className="font-bold text-gray-900 text-sm">{t.createInvoice.preview.bankTransfer}</p>
                  <p className="text-sm text-gray-500">{t.createInvoice.preview.accountNumber} : 332176141910371</p>
                </div>
                <div className="text-center w-full sm:w-48 order-1 sm:order-2 flex flex-col items-center sm:items-stretch">
                  <div className="h-16 mb-2 flex items-center justify-center border-b border-gray-300 w-full">
                    <span className="font-signature text-2xl text-gray-800" style={{fontFamily: 'cursive'}}>{fullName || "Signature"}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-600">{fullName || "Votre Nom"}</p>
                </div>
              </div>

              {/* Special Terms Based on Tab */}
              {(activeTab === "Fractionnée" || activeTab === "Récurrente") && (
                <div className="mb-12 p-4 bg-gray-50 border-l-4 border-gray-800 rounded-r-lg">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    {activeTab === "Fractionnée" ? "Modalités de paiement" : "Facturation récurrente"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {activeTab === "Fractionnée" 
                      ? `Le règlement de cette facture s'effectuera en ${splitCount} échéances égales de ${formatFCFA(Math.round(grandTotal / splitCount))}.`
                      : `Cette facture est générée automatiquement de façon ${recurrenceFreq.toLowerCase()}.`}
                  </p>
                </div>
              )}

              {/* Company Footer */}
              <div className="mt-auto pt-2 border-t border-gray-200 w-full text-center text-[11px] sm:text-xs text-gray-500 flex flex-col items-center leading-tight">
                <p className="font-medium mb-3">Note : Les retards de paiement entraîneront des pénalités annuelles de 10%.</p>
                <p className="font-bold text-gray-800 text-sm mb-0.5">{companyData?.name || fullName || "Votre Nom"}</p>
                <p className="mb-0.5">📍 {companyData?.address || "Abidjan, Côte d'Ivoire"}</p>
                <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4">
                  <span>✉️ {companyData?.email || "contact@izifacture.com"}</span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>📞 {companyData?.phone || "+225 01 02 03 04 05"}</span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>NCC: {companyData?.siret || "123456789"}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Custom Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.desc}
        type={confirmModal.type}
        hideCancel={confirmModal.hideCancel}
      />

      <Modal 
        isOpen={modalState.isOpen}
        onClose={() => {
          setModalState({ ...modalState, isOpen: false });
          router.push("/invoices");
        }}
        title={modalState.title}
        description={modalState.desc}
      />
    </div>
  );
}

// User Icon helper
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
