"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Search, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Printer, MoreHorizontal, Eye, Download, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Client } from "@/lib/mock-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { createClient } from "@/lib/supabase/client";

export default function ClientsPage() {
  const { t } = useLanguage();
  const { logoUrl, companyData, profileData } = useSettings();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Failed to fetch clients from Supabase", error);
      } else if (data) {
        setClients(data as unknown as Client[]);
      }
      setIsLoading(false);
    };
    
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
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

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const filteredClients = clients.filter((client) => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Generic Modals State
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", desc: "" });
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    title: "", 
    desc: "", 
    type: "info" as "danger" | "warning" | "info" | "success",
    onConfirm: () => {} 
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModal({
      isOpen: true,
      title: "Confirmer l'ajout",
      desc: `Voulez-vous vraiment ajouter le client "${formData.name}" ?`,
      type: "info",
      onConfirm: async () => {
        const { data, error } = await supabase
          .from('clients')
          .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address
          } as never])
          .select();

        if (error) {
          console.error("Failed to add client", error);
          alert("Erreur lors de l'ajout du client : " + error.message);
          return;
        }

        if (data && data.length > 0) {
          const newClient = data[0] as unknown as Client;
          const updatedClients = [newClient, ...clients];
          setClients(updatedClients);
          setFormData({ name: "", email: "", phone: "", address: "" });
          setIsAdding(false);
          setSuccessModal({
            isOpen: true,
            title: "Client ajouté",
            desc: "Le client a été ajouté avec succès."
          });
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer le client",
      desc: "Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.",
      type: "danger",
      onConfirm: async () => {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', id);

        if (error) {
          console.error("Failed to delete client", error);
          alert("Erreur lors de la suppression : " + error.message);
          return;
        }

        const updatedClients = clients.filter(c => c.id !== id);
        setClients(updatedClients);
        setSuccessModal({
          isOpen: true,
          title: "Client supprimé",
          desc: "Le client a été supprimé avec succès."
        });
      }
    });
  };

  return (
    <div className="space-y-6 print:space-y-0 print:m-0 print:bg-white print:pb-24">
      <style type="text/css" dangerouslySetInnerHTML={{__html: "@media print { @page { size: landscape; margin: 10mm; } body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }" }} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">{t.clients.title}</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {t.clients.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button 
            onClick={() => window.print()}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
          >
            <Printer className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden sm:inline">{t.clients.printList || "Imprimer la liste"}</span>
          </button>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
            >
              <Plus className="h-4 w-4 group-hover:rotate-90 group-active:rotate-90 transition-transform duration-300" />
              {t.clients.add}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        
        {/* Formulaire d'ajout (visible seulement si isAdding est true sur mobile, ou toujours visible sur la gauche sur desktop si on veut, mais ici c'est un toggle) */}
        {isAdding && (
          <div className="lg:col-span-1 space-y-6 print:hidden">
            <Card>
              <CardHeader className="pb-4 border-b border-[var(--color-border)] mb-4 flex flex-row items-center justify-between">
                <CardTitle>{t.clients.form.addTitle}</CardTitle>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                >
                  {t.clients.form.cancel}
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.clients.form.name}</label>
                    <input 
                      type="text" required
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Tech Africa"
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.clients.form.email}</label>
                    <input 
                      type="email" required
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="contact@exemple.com"
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.clients.form.phone}</label>
                    <input 
                      type="tel"
                      value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+225 00 00 00 00 00"
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">{t.clients.form.address}</label>
                    <textarea 
                      rows={3}
                      value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Adresse complète"
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full group flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:!bg-black hover:!text-white active:!bg-black active:!text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 mt-4">
                    {t.clients.form.save}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste des clients */}
        <div className={`space-y-6 ${isAdding ? 'lg:col-span-2' : 'lg:col-span-3'} print:w-full`}>
          {/* Print Only Header */}
          <div className="hidden print:flex flex-row justify-between items-center mb-10 gap-4 bg-white relative print:max-w-5xl print:mx-auto">
            {/* Colonne Gauche: Info Entreprise */}
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

            {/* Colonne Centre: Titre Centré */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase border-b-2 border-[var(--color-primary)] pb-1">LISTE DES CLIENTS</h1>
            </div>

            {/* Colonne Droite: Date d'impression */}
            <div className="flex-1 text-right">
              <p className="text-sm font-semibold text-gray-600">Imprimé le :</p>
              <p className="text-sm text-gray-800">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>

          <Card className="print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-5xl print:mx-auto">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)] mb-4 print:hidden">
              <CardTitle>{t.clients.title}</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder={t.clients.search}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Column Headers */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-3 pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border)] print:grid print:text-black">
                  <div className="col-span-4">{t.clients.table.client}</div>
                  <div className="col-span-3">{t.clients.table.email}</div>
                  <div className="col-span-2">{t.clients.table.phone}</div>
                  <div className="col-span-2 print:col-span-3">{t.clients.table.address}</div>
                  <div className="col-span-1 text-right print:hidden">{t.clients.table.options}</div>
                </div>

                {/* Client Rows */}
                <div className="space-y-2 pt-2">
                  {currentClients.length > 0 ? (
                    currentClients.map((client) => (
                      <div 
                        key={client.id} 
                        className={`group flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center p-3 rounded-lg hover:bg-[var(--color-sidebar-hover)] hover:scale-[1.01] hover:shadow-sm transition-all duration-200 border border-transparent hover:border-[var(--color-border)] cursor-pointer relative ${openDropdownId === client.id ? 'z-50' : 'z-0'}`}
                        onClick={() => router.push(`/clients/${client.id}`)}
                      >
                        {/* Column 1: Client Info */}
                        <div className="flex items-center gap-3 sm:col-span-4 min-w-0 print:col-span-4">
                          <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-[var(--color-text-main)] truncate block">{client.name}</h3>
                            <p className="text-xs text-[var(--color-text-muted)] truncate">{client.id}</p>
                          </div>
                          
                          {/* Mobile Actions: shown only on mobile */}
                          <div className="flex sm:hidden items-center justify-end gap-1 relative shrink-0 ml-auto transition-opacity print:hidden">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === client.id ? null : client.id);
                              }}
                              className="action-button p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border)] transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            
                            {/* Mobile Dropdown */}
                            {openDropdownId === client.id && (
                              <div 
                                className="absolute right-0 top-8 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button 
                                  onClick={() => { setOpenDropdownId(null); router.push(`/clients/${client.id}`); }}
                                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.clients.actions?.view || "Voir"}
                                </button>
                                <button 
                                  onClick={() => { setOpenDropdownId(null); router.push(`/clients/${client.id}`); }}
                                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                                >
                                  <Download className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.clients.actions?.export || "Exporter"}
                                </button>
                                <div className="h-px bg-[var(--color-border)] my-1"></div>
                                <button 
                                  onClick={() => { setOpenDropdownId(null); router.push(`/clients/${client.id}?edit=true`); }}
                                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                                >
                                  <Edit2 className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.clients.actions?.edit || "Modifier"}
                                </button>
                                <button 
                                  onClick={() => { setOpenDropdownId(null); handleDelete(client.id); }}
                                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-status-overdue)] hover:bg-[var(--color-status-overdue-bg)] flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" /> {t.clients.actions?.delete || "Supprimer"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Email (Desktop) */}
                        <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-text-muted)] sm:col-span-3 truncate print:flex print:text-black">
                          <Mail className="h-3 w-3 shrink-0 print:hidden" />
                          <span className="truncate">{client.email}</span>
                        </div>

                        {/* Column 3: Phone (Desktop) */}
                        <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-text-muted)] sm:col-span-2 truncate print:flex print:text-black">
                          <Phone className="h-3 w-3 shrink-0 print:hidden" />
                          <span className="truncate">{client.phone}</span>
                        </div>

                        {/* Column 4: Address (Desktop) */}
                        <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-text-muted)] sm:col-span-2 truncate print:flex print:col-span-3 print:text-black">
                          <MapPin className="h-3 w-3 shrink-0 print:hidden" />
                          <span className="truncate">{client.address}</span>
                        </div>

                        {/* Column 5: Options (Desktop) */}
                        <div className="hidden sm:flex sm:col-span-1 items-center justify-end relative print:hidden">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === client.id ? null : client.id);
                            }}
                            className="action-button p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border)] transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          
                          {/* Desktop Dropdown */}
                          {openDropdownId === client.id && (
                            <div 
                              className="absolute right-0 top-8 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                onClick={() => { setOpenDropdownId(null); router.push(`/clients/${client.id}`); }}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.clients.actions?.view || "Voir"}
                              </button>
                              <button 
                                onClick={() => { setOpenDropdownId(null); router.push(`/clients/${client.id}`); }}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                              >
                                <Download className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.clients.actions?.export || "Exporter"}
                              </button>
                              <div className="h-px bg-[var(--color-border)] my-1"></div>
                              <button 
                                onClick={() => { setOpenDropdownId(null); router.push(`/clients/${client.id}?edit=true`); }}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] flex items-center gap-2"
                              >
                                <Edit2 className="h-4 w-4 text-[var(--color-text-muted)]" /> {t.clients.actions?.edit || "Modifier"}
                              </button>
                              <button 
                                onClick={() => { setOpenDropdownId(null); handleDelete(client.id); }}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--color-status-overdue)] hover:bg-[var(--color-status-overdue-bg)] flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" /> {t.clients.actions?.delete || "Supprimer"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
                      {isLoading ? "Chargement des clients..." : t.clients.empty}
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 pb-2 border-t border-[var(--color-border)] mt-6 print:hidden">
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {t.invoices.pagination.showing} <span className="font-semibold text-[var(--color-text-main)]">{startIndex + 1}</span> {t.invoices.pagination.to} <span className="font-semibold text-[var(--color-text-main)]">{Math.min(startIndex + itemsPerPage, filteredClients.length)}</span> {t.invoices.pagination.of} <span className="font-semibold text-[var(--color-text-main)]">{filteredClients.length}</span> {t.invoices.pagination.results}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="group flex items-center justify-center p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-sidebar-hover)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center gap-1 hidden sm:flex">
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
            </CardContent>
          </Card>
        </div>

      </div>

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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.desc}
        type={confirmModal.type}
      />

      <Modal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        description={successModal.desc}
        type="success"
      />
    </div>
  );
}
