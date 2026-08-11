"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Printer, CheckCircle, Send, FileText, Building, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatFCFA } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

type Invoice = Database['public']['Tables']['invoices']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];

export default function InvoiceDetailPage() {
  const { logoUrl, profileData, companyData } = useSettings();
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const supabase = createClient();
  
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false);
  const [editForm, setEditForm] = useState({ dueDate: "", status: "Brouillon" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Invoice
      const { data: invoice } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();
        
      if (!invoice) {
        setIsLoading(false);
        return;
      }
      
      setInvoiceData(invoice);
      setEditForm({ 
        dueDate: invoice.due_date, 
        status: invoice.status 
      });

      // 2. Fetch Client
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', invoice.client_id)
        .single();
      
      if (clientData) {
        setClient(clientData);
      }

      // 3. Fetch Items
      const { data: itemsData } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoice.id);
        
      if (itemsData) {
        setItems(itemsData);
      }

      setIsLoading(false);
    }
    
    if (invoiceId) loadData();
  }, [invoiceId, supabase]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-[var(--color-text-muted)] text-sm">Chargement de la facture...</p>
      </div>
    );
  }

  if (!invoiceData || !client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-[var(--color-text-muted)] text-lg">Facture introuvable.</p>
        <Link href="/invoices" className="text-[var(--color-primary)] hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const confirmDelete = async () => {
    setIsDeleting(true);
    await supabase.from('invoices').delete().eq('id', invoiceId);
    router.push("/invoices");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase
      .from('invoices')
      .update({
        due_date: editForm.dueDate,
        status: editForm.status
      })
      .eq('id', invoiceId);
      
    if (!error) {
      setInvoiceData({ ...invoiceData, due_date: editForm.dueDate, status: editForm.status });
      setIsEditing(false);
    }
    
    setIsSaving(false);
  };

  const toggleStatus = async () => {
    if (!invoiceData) return;
    
    let newStatus = invoiceData.status;
    if (invoiceData.status === 'Brouillon') newStatus = 'Envoyée';
    else if (invoiceData.status === 'Envoyée' || invoiceData.status === 'En retard') newStatus = 'Payée';
    else if (invoiceData.status === 'Payée') newStatus = 'Brouillon';
    
    setIsSaving(true);
    
    const { error } = await supabase
      .from('invoices')
      .update({ status: newStatus })
      .eq('id', invoiceId);
      
    if (!error) {
      setInvoiceData({ ...invoiceData, status: newStatus });
      setEditForm({ ...editForm, status: newStatus });
    }
    
    setIsSaving(false);
  };

  const isOverdue = invoiceData.due_date && new Date(invoiceData.due_date) < new Date(new Date().setHours(0, 0, 0, 0)) && invoiceData.status !== 'Payée';
  const penaltyAmount = isOverdue ? Math.round((Number(invoiceData.subtotal) + Number(invoiceData.tax_amount)) * 0.1) : 0;
  const grandTotal = Number(invoiceData.total) + penaltyAmount;

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'Payée': return 'paid';
      case 'Envoyée': return 'sent';
      case 'En retard': return 'overdue';
      default: return 'draft';
    }
  };

  return (
    <div className="space-y-6 print:space-y-0 print:m-0">
      <style type="text/css" dangerouslySetInnerHTML={{__html: "@media print { @page { size: portrait; margin: 10mm; } body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } .print\\:hidden { display: none !important; } }" }} />
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link 
            href="/invoices"
            className="p-2 rounded-lg hover:bg-[var(--color-sidebar-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">{invoiceData.invoice_number}</h1>
              <Badge variant={getStatusVariant(invoiceData.status)}>
                {invoiceData.status}
              </Badge>
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Créée le {formatDate(invoiceData.issue_date)} • Échéance le {formatDate(invoiceData.due_date)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
          <button 
            onClick={toggleStatus}
            disabled={isSaving}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] hover:shadow-sm active:scale-95 transition-all duration-200 border border-[var(--color-border)]"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                {invoiceData.status === 'Brouillon' && <><Send className="h-4 w-4" /> Marquer comme envoyée</>}
                {(invoiceData.status === 'Envoyée' || invoiceData.status === 'En retard') && <><CheckCircle className="h-4 w-4" /> Marquer comme payée</>}
                {invoiceData.status === 'Payée' && <><FileText className="h-4 w-4" /> Convertir en brouillon</>}
              </>
            )}
          </button>
          
          <button 
            disabled={invoiceData.status === 'Brouillon'}
            onClick={() => window.print()}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] transition-all duration-200 ${invoiceData.status === 'Brouillon' ? 'text-[var(--color-text-muted)] opacity-50 cursor-not-allowed' : 'text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] hover:shadow-sm active:scale-95'}`}
            title={invoiceData.status === 'Brouillon' ? "Indisponible pour les brouillons" : ""}
          >
            <Printer className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white active:scale-95 transition-all duration-200"
          >
            <Edit2 className="h-4 w-4" />
            Statut
          </button>
          
          <button 
            onClick={() => setIsDeletingConfirm(true)}
            disabled={isDeleting}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-status-overdue)] bg-[var(--color-status-overdue)]/10 hover:bg-[var(--color-status-overdue)] hover:text-white active:bg-[var(--color-status-overdue)] active:text-white active:scale-95 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "..." : "Supprimer"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 print:block">
        <div className="xl:col-span-2 space-y-6 print:m-0 print:p-0">
          {/* Invoice Document Preview */}
          <Card className="overflow-hidden print:shadow-none print:border-none">
            <CardContent className="p-0">
              <div id="invoice-content" className="bg-white rounded-lg shadow-sm border border-[var(--color-border)] p-8 sm:p-12 w-full max-w-[800px] min-h-[900px] mx-auto flex flex-col relative print:shadow-none print:border-none print:p-0">
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                  <div>
                    <div className="h-12 w-12 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl mb-3 shadow-md overflow-hidden">
                      {logoUrl ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        </>
                      ) : (
                        <Building className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Émis par</h3>
                      <p className="font-bold text-lg">{companyData?.name || profileData?.fullName || "Votre Nom"}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Facture</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">{invoiceData.invoice_number}</p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Facturé à</h3>
                    <p className="font-bold text-lg">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p className="text-sm text-gray-600">{client.phone}</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{client.address}</p>
                  </div>
                  <div className="sm:text-right">
                    <div className="mb-4">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date d&apos;émission</h3>
                      <p className="font-semibold">{formatDate(invoiceData.issue_date)}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date d&apos;échéance</h3>
                      <p className="font-semibold">{formatDate(invoiceData.due_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Qté</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Prix Unit.</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3 text-sm">{item.description}</td>
                          <td className="py-3 text-sm text-center">{item.quantity}</td>
                          <td className="py-3 text-sm text-right">{formatFCFA(item.unit_price)}</td>
                          <td className="py-3 text-sm text-right font-medium">{formatFCFA(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-3">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Sous-total</span>
                      <span>{formatFCFA(invoiceData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>TVA (18%)</span>
                      <span>{formatFCFA(invoiceData.tax_amount)}</span>
                    </div>
                    {isOverdue && (
                      <div className="flex justify-between text-sm text-red-500 font-semibold">
                        <span>Pénalité retard (10%)</span>
                        <span>{formatFCFA(penaltyAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
                      <span className="font-bold text-gray-900">Total TTC</span>
                      <span className="text-xl font-black tracking-tighter text-[var(--color-primary)]">{formatFCFA(grandTotal)}</span>
                    </div>
                  </div>
                </div>
                
                {invoiceData.notes && (
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoiceData.notes}</p>
                  </div>
                )}

                {/* Company Footer */}
                <div className="mt-auto pt-2 border-t border-gray-200 w-full text-center text-[11px] sm:text-xs text-gray-500 flex flex-col items-center leading-tight">
                  <p className="font-medium mb-3">Note : Les retards de paiement entraîneront des pénalités annuelles de 10%.</p>
                  <p className="font-bold text-gray-800 text-sm mb-0.5">{companyData?.name || profileData?.fullName || "Votre Nom"}</p>
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Hidden on Print) */}
        <div className="space-y-6 print:hidden">
          <Card>
            <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
              <CardTitle>À propos du client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Nom</p>
                <p className="text-sm font-medium text-[var(--color-text-main)]">{client.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-[var(--color-text-main)]">{client.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Téléphone</p>
                <p className="text-sm font-medium text-[var(--color-text-main)]">{client.phone}</p>
              </div>
              <Link href={`/clients/${client.id}`} className="block text-center mt-4 text-sm text-[var(--color-primary)] hover:underline font-medium">
                Voir le profil complet →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">Modifier le statut</h2>
              <button onClick={() => setIsEditing(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] text-xl">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Statut</label>
                <select 
                  value={editForm.status} 
                  onChange={e => setEditForm({...editForm, status: e.target.value})} 
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Envoyée">Envoyée</option>
                  <option value="Payée">Payée</option>
                  <option value="En retard">En retard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Date d&apos;échéance</label>
                <input required type="date" value={editForm.dueDate} onChange={e => setEditForm({...editForm, dueDate: e.target.value})} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-sidebar-hover)]">Annuler</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-black/80 flex items-center justify-center gap-2">
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-status-overdue)]/10 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-[var(--color-status-overdue)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">Supprimer la facture ?</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Cette action est irréversible. La facture sera supprimée définitivement.</p>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={confirmDelete} disabled={isDeleting} className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-status-overdue)] text-white hover:bg-[var(--color-status-overdue)]/90 flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Oui, supprimer définitivement"}
              </button>
              <button onClick={() => setIsDeletingConfirm(false)} disabled={isDeleting} className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-sidebar-hover)]">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
