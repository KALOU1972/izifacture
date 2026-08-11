"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, MoreHorizontal, Download, Mail, Building, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatFCFA } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

type Invoice = Database['public']['Tables']['invoices']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type InvoiceWithClient = Invoice & { client?: { name: string, email: string, phone: string } | null };

export default function InvoicesPage() {
  const { t } = useLanguage();
  const { logoUrl, companyData, profileData } = useSettings();
  const router = useRouter();
  const supabase = createClient();
  
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Load clients for displaying client names
      const { data: clientsData } = await supabase.from('clients').select('*');
      if (clientsData) setClients(clientsData);

      // Load invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(name, email, phone)
        `)
        .order('created_at', { ascending: false })
        .returns<InvoiceWithClient[]>();
        
      if (invoicesData) setInvoices(invoicesData);
      
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.action-button')) return;
      setOpenDropdownId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const statuses = [
    { id: "all", label: t.invoices.all },
    { id: "Brouillon", label: t.invoices.draft },
    { id: "Envoyée", label: t.invoices.pending },
    { id: "Payée", label: t.invoices.paid },
    { id: "En retard", label: t.invoices.overdue }
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const clientName = invoice.client?.name || "";
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    
    await supabase.from('invoices').delete().eq('id', invoiceToDelete);
    
    setInvoices(invoices.filter(inv => inv.id !== invoiceToDelete));
    setInvoiceToDelete(null);
    setIsDeleting(false);
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Helper pour les statuts UI
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'Payée': return 'paid';
      case 'Envoyée': return 'sent';
      case 'En retard': return 'overdue';
      default: return 'draft';
    }
  };

  return (
    <div className="space-y-6 print:space-y-0 print:m-0 print:bg-white print:pb-24">
      <style type="text/css" dangerouslySetInnerHTML={{__html: "@media print { @page { size: landscape; margin: 10mm; } body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }" }} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">{t.invoices.title}</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {t.invoices.subtitle}
          </p>
        </div>
        <Link href="/invoices/create" className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-black hover:text-white active:bg-black active:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 self-end sm:self-auto">
          <Plus className="h-4 w-4 group-hover:rotate-90 group-active:rotate-90 transition-transform duration-300" />
          {t.invoices.create}
        </Link>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:flex flex-row justify-between items-center mb-10 gap-4 bg-white relative print:max-w-5xl print:mx-auto">
        <div className="flex-1">
          <div className="h-12 w-12 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl mb-4 shadow-md overflow-hidden border border-gray-200">
            {logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </>
            ) : (
              <Building className="h-6 w-6" />
            )}
          </div>
          <div className="border-t-2 border-gray-300 pt-2 w-max">
            <h2 className="font-bold text-lg text-gray-900">{companyData?.name || "IziFacture Inc."}</h2>
            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
              <p>{companyData?.email || "contact@izifacture.com"}</p>
              <p>{companyData?.phone || "+225 01 02 03 04 05"}</p>
              <p>{companyData?.address || "Abidjan, Côte d'Ivoire"}</p>
              <p className="pt-1 text-gray-400 text-[10px]">NCC: {companyData?.siret || "123456789"}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase border-b-2 border-[var(--color-primary)] pb-1 text-center">
            {statusFilter === "En retard" ? "FACTURES EN RETARD" : statusFilter === "Payée" ? "FACTURES PAYÉES" : statusFilter === "Envoyée" ? "FACTURES EN ATTENTE" : statusFilter === "Brouillon" ? "FACTURES BROUILLON" : "LISTE DES FACTURES"}
          </h1>
        </div>

        <div className="flex-1 text-right">
          <p className="text-sm font-semibold text-gray-600">Imprimé le :</p>
          <p className="text-sm text-gray-800">{formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-5xl print:mx-auto">
        <CardHeader className="flex flex-col gap-4 pb-4 print:hidden">
          <CardTitle>{t.invoices.title}</CardTitle>
          
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 w-full mt-2">
            {/* Search (Left) */}
            <div className="relative w-full xl:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder={t.invoices.search}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            {/* Filter Tabs (Right) */}
            <div className="flex flex-wrap items-center justify-end gap-2 w-full">
              {statuses.map(status => (
                <button
                  key={status.id}
                  onClick={() => {
                    setStatusFilter(status.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    statusFilter === status.id 
                      ? 'bg-black text-white shadow-sm' 
                      : 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="print:p-0">
          <div className="space-y-2">
            {/* Column Headers */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-3 pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border)] print:grid print:text-black">
              <div className="col-span-3">{t.invoices.table.client}</div>
              <div className="col-span-2">{t.invoices.table.number}</div>
              <div className="col-span-2 whitespace-nowrap">{t.invoices.table.date}</div>
              <div className="col-span-2">{t.invoices.table.status}</div>
              <div className="col-span-2 text-right">{t.invoices.table.amount}</div>
              <div className="col-span-1 text-right print:hidden">{t.invoices.table.options}</div>
            </div>

            {/* Invoice Rows */}
            <div className="space-y-2 pt-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
                  <p className="text-sm text-[var(--color-text-muted)]">Chargement des factures...</p>
                </div>
              ) : currentInvoices.length > 0 ? (
                currentInvoices.map((invoice) => {
                  const client = invoice.client;
                  return (
                  <div 
                    key={invoice.id} 
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                    className={`group flex items-center justify-between sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center p-3 rounded-lg hover:bg-[var(--color-sidebar-hover)] hover:scale-[1.01] hover:shadow-sm transition-all duration-200 border border-transparent hover:border-[var(--color-border)] cursor-pointer relative ${openDropdownId === invoice.id ? 'z-50' : 'z-0'}`}
                  >
                    {/* Column 1: Client Info */}
                    <div className="flex-1 min-w-0 sm:col-span-3">
                      <span className="text-sm font-semibold text-[var(--color-text-main)] truncate block">{client?.name || "Client supprimé"}</span>
                      {statusFilter === 'En retard' && client && (
                        <span className="text-xs text-[var(--color-text-muted)] block truncate print:text-gray-800">
                          {client.phone} • {client.email}
                        </span>
                      )}
                    </div>

                    {/* Column 2: Numéro (Desktop) */}
                    <div className="hidden sm:block text-sm text-[var(--color-text-muted)] sm:col-span-2 truncate print:block print:text-black">
                      {invoice.invoice_number}
                    </div>

                    {/* Column 3: Date (Desktop) */}
                    <div className="hidden sm:block text-sm text-[var(--color-text-muted)] sm:col-span-2 print:block print:text-black">
                      {formatDate(invoice.issue_date)}
                    </div>

                    {/* Columns 4, 5 & 6: Status, Amount & Actions */}
                    <div className="flex items-center gap-2 sm:gap-0 sm:contents shrink-0">
                      <div className="sm:col-span-2">
                        <Badge variant={getStatusVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="text-sm font-bold text-[var(--color-text-main)] sm:col-span-2 sm:text-right whitespace-nowrap print:text-black">
                        {formatFCFA(invoice.total)}
                      </div>
                      <div className="hidden sm:flex sm:col-span-1 items-center justify-end relative print:hidden gap-1">
                        {statusFilter === 'En retard' && client && (
                          <>
                            <a href={`mailto:${client.email}?subject=Facture En Retard&body=Bonjour, nous vous informons que la facture ${invoice.invoice_number} est arrivée à échéance.`} 
                               onClick={(e) => e.stopPropagation()}
                               className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Alerter par Email">
                              <Mail className="h-4 w-4" />
                            </a>
                            <a href={`https://wa.me/${client.phone.replace(/[^0-9+]/g, '')}?text=Bonjour,%20nous%20vous%20informons%20que%20la%20facture%20${invoice.invoice_number}%20est%20arrivée%20à%20échéance.`}
                               target="_blank" rel="noopener noreferrer"
                               onClick={(e) => e.stopPropagation()}
                               className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors" title="Alerter par WhatsApp">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.551 4.195 1.597 6.012L.032 24l6.108-1.583A11.942 11.942 0 0012.031 24c6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm0 22.012c-1.802 0-3.565-.483-5.111-1.399l-.367-.217-3.799.985.999-3.722-.238-.38a9.986 9.986 0 01-1.472-5.267C2.043 5.485 7.42 1.988 12.031 1.988c4.611 0 9.988 5.485 9.988 10.043s-5.377 10.043-9.988 10.043zm5.485-7.399c-.301-.151-1.782-.879-2.058-.979-.276-.1-.477-.151-.678.151-.201.301-.778.979-.953 1.18-.176.201-.351.226-.653.075-1.927-.964-3.327-2.709-3.727-3.411-.1-.176-.011-.271.064-.346.069-.069.151-.176.226-.264.075-.088.101-.151.151-.251.05-.101.025-.188-.013-.264-.038-.075-.678-1.631-.928-2.233-.243-.586-.49-.507-.678-.516-.176-.009-.377-.013-.578-.013s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.509s1.079 2.911 1.23 3.112c.151.201 2.122 3.238 5.139 4.538 2.008.867 2.76.929 3.288.828.591-.113 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.075-.125-.276-.2-.578-.351z"/></svg>
                            </a>
                          </>
                        )}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === invoice.id ? null : invoice.id);
                          }} 
                          className="action-button p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border)] transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openDropdownId === invoice.id && (
                          <div 
                            className="absolute right-0 top-8 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => { setOpenDropdownId(null); router.push(`/invoices/${invoice.id}`); }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.invoices.actions?.view || "Voir la facture"}
                            </button>
                            <button 
                              disabled={invoice.status === 'Brouillon'}
                              onClick={() => { setOpenDropdownId(null); router.push(`/invoices/${invoice.id}`); }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${invoice.status === 'Brouillon' ? 'text-[var(--color-text-muted)] opacity-50 cursor-not-allowed' : 'text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)]'}`}
                              title={invoice.status === 'Brouillon' ? "Indisponible pour les brouillons" : ""}
                            >
                              <Download className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.invoices.actions?.download || "Télécharger PDF"}
                            </button>
                            <button 
                              disabled={invoice.status === 'Brouillon'}
                              onClick={() => { setOpenDropdownId(null); router.push(`/invoices/${invoice.id}`); }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${invoice.status === 'Brouillon' ? 'text-[var(--color-text-muted)] opacity-50 cursor-not-allowed' : 'text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)]'}`}
                              title={invoice.status === 'Brouillon' ? "Indisponible pour les brouillons" : ""}
                            >
                              <Mail className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.invoices.actions?.send || "Envoyer par email"}
                            </button>
                            <div className="h-px bg-[var(--color-border)] my-1"></div>
                            <button 
                              onClick={() => { setOpenDropdownId(null); router.push(`/invoices/create?edit=${invoice.id}`); }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                            >
                              <Edit2 className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.invoices.actions?.edit || "Modifier"}
                            </button>
                            <button 
                              onClick={() => { setOpenDropdownId(null); setInvoiceToDelete(invoice.id); }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--color-status-overdue)] hover:bg-[var(--color-status-overdue-bg)] flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" /> {t.invoices.actions?.delete || "Supprimer"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
                  {t.clients.empty}
                </div>
              )}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 pb-2 border-t border-[var(--color-border)] mt-6 print:hidden">
                <div className="text-sm text-[var(--color-text-muted)]">
                  {t.invoices.pagination.showing} <span className="font-semibold text-[var(--color-text-main)]">{startIndex + 1}</span> {t.invoices.pagination.to} <span className="font-semibold text-[var(--color-text-main)]">{Math.min(startIndex + itemsPerPage, filteredInvoices.length)}</span> {t.invoices.pagination.of} <span className="font-semibold text-[var(--color-text-main)]">{filteredInvoices.length}</span> {t.invoices.pagination.results}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="group flex items-center justify-center p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
                >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-main)]'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="group flex items-center justify-center p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
                >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-status-overdue)]/10 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-[var(--color-status-overdue)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">Supprimer cette facture ?</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Cette action est irréversible. La facture sera supprimée de la liste.</p>
            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting} 
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-status-overdue)] text-white hover:bg-[var(--color-status-overdue)]/90 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Oui, supprimer définitivement"}
              </button>
              <button 
                onClick={() => setInvoiceToDelete(null)} 
                disabled={isDeleting} 
                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-sidebar-hover)]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer d'impression */}
      <div className="hidden print:flex fixed bottom-0 left-0 right-0 w-full bg-white flex-col items-center gap-1 text-center text-[11px] sm:text-xs text-gray-500 py-4 border-t border-gray-200 z-50 leading-tight">
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
  );
}
