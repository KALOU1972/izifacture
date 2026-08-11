export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  tax?: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string; // denormalized for easy table rendering
  amount: number;
  date: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue";
  items: InvoiceItem[];
  subTotal: number;
  tax: number;
  total: number;
}

const baseClients: Client[] = [
  { id: "C-001", name: "Tech Africa", email: "contact@techafrica.ci", phone: "+225 0102030405", address: "Plateau, Abidjan" },
  { id: "C-002", name: "Cansaas Agency", email: "hello@cansaas.com", phone: "+225 0708091011", address: "Cocody, Abidjan" },
  { id: "C-003", name: "Startup CI", email: "info@startup.ci", phone: "+225 0506070809", address: "Marcory, Abidjan" },
  { id: "C-004", name: "Menuiserie Koffi", email: "koffi.menuiserie@gmail.com", phone: "+225 0123456789", address: "Yopougon, Abidjan" },
  { id: "C-005", name: "Boutique Chez Awa", email: "awa.boutique@yahoo.fr", phone: "+225 0789101112", address: "Treichville, Abidjan" },
];

const generatedClients: Client[] = Array.from({ length: 45 }).map((_, i) => {
  const num = i + 6;
  return {
    id: `C-00${num < 10 ? '0'+num : num}`,
    name: `Entreprise Générée ${num}`,
    email: `contact${num}@entreprise.ci`,
    phone: `+225 0${((i * 7) % 9) + 1}00${num}00`,
    address: ["Plateau, Abidjan", "Cocody, Abidjan", "Marcory, Abidjan", "Yopougon, Abidjan"][i % 4]
  };
});

export const MOCK_CLIENTS: Client[] = [...baseClients, ...generatedClients];

const baseInvoices: Invoice[] = [
  { 
    id: "INV-2026-001", 
    clientId: "C-001",
    clientName: "Tech Africa", 
    amount: 250000, 
    date: "2026-08-01", 
    dueDate: "2026-08-15",
    status: "paid",
    items: [
      { id: "1", description: "Développement Site Web", quantity: 1, unitPrice: 211864, total: 211864 }
    ],
    subTotal: 211864,
    tax: 38136,
    total: 250000
  },
  { 
    id: "INV-2026-002", 
    clientId: "C-002",
    clientName: "Cansaas Agency", 
    amount: 150000, 
    date: "2026-08-05", 
    dueDate: "2026-08-20",
    status: "sent",
    items: [
      { id: "1", description: "Consulting SEO", quantity: 10, unitPrice: 12712, total: 127120 }
    ],
    subTotal: 127120,
    tax: 22880,
    total: 150000
  },
  { 
    id: "INV-2026-003", 
    clientId: "C-003",
    clientName: "Startup CI", 
    amount: 85000, 
    date: "2026-08-07",
    dueDate: "2026-08-22", 
    status: "draft",
    items: [
      { id: "1", description: "Design Logo", quantity: 1, unitPrice: 72034, total: 72034 }
    ],
    subTotal: 72034,
    tax: 12966,
    total: 85000
  },
  { 
    id: "INV-2026-004", 
    clientId: "C-004",
    clientName: "Menuiserie Koffi", 
    amount: 420000, 
    date: "2026-07-15", 
    dueDate: "2026-07-30",
    status: "overdue",
    items: [
      { id: "1", description: "Fourniture de chaises", quantity: 20, unitPrice: 17797, total: 355940 }
    ],
    subTotal: 355940,
    tax: 64060,
    total: 420000
  },
];

const generatedInvoices: Invoice[] = Array.from({ length: 46 }).map((_, i) => {
  const num = i + 5;
  const amount = (((i * 13) % 50) + 5) * 10000; // between 50k and 550k
  return {
    id: `INV-2026-${num < 10 ? '00'+num : num < 100 ? '0'+num : num}`,
    clientId: `C-00${(i % 5) + 1}`,
    clientName: ["Tech Africa", "Cansaas Agency", "Startup CI", "Menuiserie Koffi", "Boutique Chez Awa"][i % 5],
    amount: amount,
    date: `2026-08-${(i % 28) + 1 < 10 ? '0'+((i%28)+1) : (i%28)+1}`,
    dueDate: `2026-09-${(i % 28) + 1 < 10 ? '0'+((i%28)+1) : (i%28)+1}`,
    status: ["paid", "sent", "draft", "overdue"][i % 4] as "paid" | "sent" | "draft" | "overdue",
    items: [{ id: "1", description: "Service généré " + num, quantity: 1, unitPrice: amount, total: amount }],
    subTotal: amount,
    tax: 0,
    total: amount
  };
});

export const MOCK_INVOICES: Invoice[] = [...baseInvoices, ...generatedInvoices];
