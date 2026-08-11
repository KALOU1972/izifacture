"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, DollarSign, Clock, CheckCircle2, Plus, ArrowRight, Loader2 } from "lucide-react";
import { Stat } from "@/components/ui/Stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatFCFA } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

type Invoice = Database['public']['Tables']['invoices']['Row'];
type DashboardInvoice = Invoice & { clientName: string };

export default function DashboardPage() {
  const { t } = useLanguage();
  const { profileData } = useSettings();
  const supabase = createClient();
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Load clients for mapping names
      const { data: clientsData } = await supabase.from('clients').select('*');
      
      // Load invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .order('issue_date', { ascending: false });

      if (invoicesData && clientsData) {
        const mappedInvoices = invoicesData.map(inv => {
          const client = clientsData.find(c => c.id === inv.client_id);
          return {
            ...inv,
            clientName: client?.name || "Client Inconnu"
          };
        });
        setInvoices(mappedInvoices);
      } else if (invoicesData) {
        setInvoices(invoicesData.map(inv => ({ ...inv, clientName: "Client Inconnu" })));
      }
      setIsLoading(false);
    }
    
    loadData();
  }, [supabase]);

  const totalInvoices = invoices.length;
  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'Payée').reduce((sum, inv) => sum + Number(inv.total || 0), 0);
  const totalPending = invoices.filter(i => i.status === 'Envoyée' || i.status === 'Brouillon' || i.status === 'En retard').reduce((sum, inv) => sum + Number(inv.total || 0), 0);
  
  // Calculate trends
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getMonthAndYear = (dateString: string) => {
    const d = new Date(dateString);
    return { month: d.getMonth(), year: d.getFullYear() };
  }

  const currentMonthInvoices = invoices.filter(inv => {
    const { month, year } = getMonthAndYear(inv.issue_date);
    return month === currentMonth && year === currentYear;
  });

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousMonthInvoices = invoices.filter(inv => {
    const { month, year } = getMonthAndYear(inv.issue_date);
    return month === previousMonth && year === previousYear;
  });

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const trendInvoices = getPercentageChange(
    currentMonthInvoices.length, 
    previousMonthInvoices.length
  );
  const trendInvoiced = getPercentageChange(
    currentMonthInvoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0),
    previousMonthInvoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0)
  );

  // Pourcentage du revenu total pour "Factures Payées" et "Factures en Attente"
  const trendPaid = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;
  const trendPending = totalInvoiced > 0 ? Math.round((totalPending / totalInvoiced) * 100) : 0;

  const recentInvoices = invoices.slice(0, 5); // Show latest 5 on the dashboard

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'Payée': return 'paid';
      case 'Envoyée': return 'sent';
      case 'En retard': return 'overdue';
      default: return 'draft';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'Payée': return t.dashboard.status.paid;
      case 'Envoyée': return t.dashboard.status.pending;
      case 'En retard': return t.dashboard.status.overdue;
      default: return t.dashboard.status.draft;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-[var(--color-text-muted)] text-sm">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">Bonjour, {profileData.fullName} 👋</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>
        <Link href="/invoices/create" className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-black hover:text-white active:bg-black active:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 self-end sm:self-auto">
          <Plus className="h-4 w-4 group-hover:rotate-90 group-active:rotate-90 transition-transform duration-300" />
          {t.invoices.create}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Stat 
          title={t.dashboard.totalInvoices} 
          value={totalInvoices} 
          isCurrency={false} 
          icon={FileText} 
          trend={{ value: Math.abs(trendInvoices), isPositive: trendInvoices >= 0 }}
        />
        <Stat 
          title={t.dashboard.totalRevenue} 
          value={totalInvoiced} 
          icon={DollarSign} 
          trend={{ value: Math.abs(trendInvoiced), isPositive: trendInvoiced >= 0 }}
        />
        <Stat 
          title={t.dashboard.paidInvoices} 
          value={totalPaid} 
          icon={CheckCircle2} 
          trend={{ value: trendPaid, isPositive: true, description: "du revenu total", hideSign: true }}
        />
        <Stat 
          title={t.dashboard.pendingInvoices} 
          value={totalPending} 
          icon={Clock} 
          trend={{ value: trendPending, isPositive: false, description: "du revenu total", hideSign: true }}
          valueClassName="text-[var(--color-status-overdue)]"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-4">
        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>{t.dashboard.recentInvoices}</CardTitle>
            <Link href="/invoices" className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-black hover:text-white active:bg-black active:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200">
              {t.dashboard.viewAll}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Column Headers */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-3 pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border)]">
                <div className="col-span-3">{t.dashboard.table.client}</div>
                <div className="col-span-2">{t.invoices.table.number}</div>
                <div className="col-span-2">{t.dashboard.table.date}</div>
                <div className="col-span-2">{t.dashboard.table.status}</div>
                <div className="col-span-3 text-right">{t.dashboard.table.amount}</div>
              </div>

              {/* Invoice Rows */}
              <div className="space-y-2 pt-2">
                {recentInvoices.length === 0 ? (
                  <div className="text-center py-6 text-[var(--color-text-muted)]">
                    Aucune facture récente.
                  </div>
                ) : recentInvoices.map((invoice) => (
                  <Link href={`/invoices/${invoice.id}`} key={invoice.id} className="group flex items-center justify-between sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center p-3 rounded-lg hover:bg-[var(--color-sidebar-hover)] hover:scale-[1.01] hover:shadow-sm transition-all duration-200 border border-transparent hover:border-[var(--color-border)]">
                    
                    {/* Column 1: Client Info */}
                    <div className="flex-1 min-w-0 sm:col-span-3">
                      <span className="text-sm font-semibold text-[var(--color-text-main)] truncate block">{invoice.clientName}</span>
                    </div>

                    {/* Column 2: Numéro (Desktop) */}
                    <div className="hidden sm:block text-sm text-[var(--color-text-muted)] sm:col-span-2 truncate">
                      {invoice.invoice_number}
                    </div>

                    {/* Column 3: Date (Desktop) */}
                    <div className="hidden sm:block text-sm text-[var(--color-text-muted)] sm:col-span-2">
                      {formatDate(invoice.issue_date)}
                    </div>

                    {/* Columns 4 & 5: Status & Amount */}
                    <div className="flex items-center gap-2 sm:gap-0 sm:contents shrink-0">
                      <div className="sm:col-span-2">
                        <Badge variant={getStatusVariant(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </div>
                      <div className="text-sm font-bold text-[var(--color-text-main)] sm:col-span-3 sm:text-right">
                        {formatFCFA(invoice.total || 0)}
                      </div>
                    </div>

                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
