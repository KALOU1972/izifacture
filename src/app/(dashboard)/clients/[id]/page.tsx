"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Printer, MapPin, Mail, Phone, FileText, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatFCFA } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

type Client = Database['public']['Tables']['clients']['Row'];
type Invoice = Database['public']['Tables']['invoices']['Row'];

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = params.id as string;
  const supabase = createClient();
  
  const [clientData, setClientData] = useState<Client | null>(null);
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "", id: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Load client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (clientError || !client) {
        setIsLoading(false);
        return;
      }
      
      setClientData(client);
      setEditForm({
        id: client.id,
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || ""
      });

      // Load invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientId);
        
      if (invoices) {
        setClientInvoices(invoices);
      }
      
      setIsLoading(false);
    }
    
    if (clientId) {
      loadData();
    }
  }, [clientId, supabase]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-[var(--color-text-muted)] text-sm">Chargement des détails du client...</p>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-[var(--color-text-muted)] text-lg">Client introuvable.</p>
        <Link href="/clients" className="text-[var(--color-primary)] hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const confirmDelete = async () => {
    setIsDeleting(true);
    await supabase.from('clients').delete().eq('id', clientId);
    router.push("/clients");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase
      .from('clients')
      .update({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address
      })
      .eq('id', clientId);
      
    if (!error) {
      setClientData({ ...clientData, ...editForm });
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  // Calculate statistics
  const totalInvoiced = clientInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
  const paidInvoices = clientInvoices.filter(inv => inv.status === 'Payée');
  const totalPaid = paidInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
  const pendingInvoices = clientInvoices.filter(inv => inv.status === 'Envoyée' || inv.status === 'En retard');
  const totalPending = pendingInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);

  // Helper pour badges de statut
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Payée': return 'paid';
      case 'Envoyée': return 'sent';
      case 'En retard': return 'overdue';
      default: return 'draft';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/clients"
            className="p-2 rounded-lg hover:bg-[var(--color-sidebar-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-xl">
              {clientData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">{clientData.name}</h1>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">{clientData.id}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
          <button 
            onClick={() => window.print()}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] hover:shadow-sm active:scale-95 transition-all duration-200 border border-[var(--color-border)]"
          >
            <Printer className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white active:scale-95 transition-all duration-200"
          >
            <Edit2 className="h-4 w-4" />
            <span className="hidden sm:inline">Modifier</span>
          </button>
          
          <button 
            onClick={() => setIsDeletingConfirm(true)}
            disabled={isDeleting}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-status-overdue)] bg-[var(--color-status-overdue)]/10 hover:bg-[var(--color-status-overdue)] hover:text-white active:bg-[var(--color-status-overdue)] active:text-white active:scale-95 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{isDeleting ? "..." : "Supprimer"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
              <CardTitle>Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[var(--color-text-muted)] mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm font-medium text-[var(--color-text-main)] break-words">{clientData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[var(--color-text-muted)] mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Téléphone</p>
                  <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{clientData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-text-muted)] mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Adresse</p>
                  <p className="text-sm font-medium text-[var(--color-text-main)] whitespace-pre-wrap">{clientData.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4">
              <CardTitle>Synthèse Financière</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Facturé</p>
                <p className="text-xl font-bold text-[var(--color-text-main)]">{formatFCFA(totalInvoiced)}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{clientInvoices.length} facture(s)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Encaissé</p>
                  <p className="text-sm font-bold text-[var(--color-primary)]">{formatFCFA(totalPaid)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{paidInvoices.length} payée(s)</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">En attente</p>
                  <p className="text-sm font-bold text-[var(--color-status-overdue)]">{formatFCFA(totalPending)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{pendingInvoices.length} attente(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Invoices History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)] mb-4">
              <CardTitle>Historique des factures</CardTitle>
              <Link 
                href="/invoices/create" 
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white transition-all duration-200"
              >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Créer une facture</span>
              </Link>
            </CardHeader>
            <CardContent>
              {clientInvoices.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 text-[var(--color-border)] mx-auto mb-3" />
                  <p className="text-[var(--color-text-muted)] text-sm">Aucune facture pour ce client.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-3 pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border)]">
                    <div className="col-span-3">Numéro</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-3">Statut</div>
                    <div className="col-span-3 text-right">Montant</div>
                  </div>
                  
                  {clientInvoices.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()).map((invoice) => (
                    <div 
                      key={invoice.id} 
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                      className="group flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center p-3 rounded-lg hover:bg-[var(--color-sidebar-hover)] hover:scale-[1.01] hover:shadow-sm transition-all duration-200 border border-transparent hover:border-[var(--color-border)] cursor-pointer"
                    >
                      <div className="sm:col-span-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--color-text-main)]">{invoice.invoice_number}</span>
                        <span className="sm:hidden font-bold text-[var(--color-text-main)]">{formatFCFA(invoice.total)}</span>
                      </div>
                      
                      <div className="sm:col-span-3 text-sm text-[var(--color-text-muted)]">
                        {formatDate(invoice.issue_date)}
                      </div>
                      
                      <div className="sm:col-span-3">
                        <Badge variant={getStatusVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      
                      <div className="hidden sm:block sm:col-span-3 text-sm font-bold text-[var(--color-text-main)] text-right">
                        {formatFCFA(invoice.total)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">Modifier le client</h2>
              <button onClick={() => setIsEditing(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] text-xl">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Nom de l&apos;entreprise</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Email</label>
                <input required type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Téléphone</label>
                <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Adresse</label>
                <textarea rows={3} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] resize-none" />
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
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">Supprimer ce client ?</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Cette action est irréversible. Toutes les données liées à ce client seront perdues.</p>
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
