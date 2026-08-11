export const en = {
  sidebar: {
    dashboard: "Dashboard",
    invoices: "Invoices",
    clients: "Clients",
    help: "Help & Support",
    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Language"
  },
  dashboard: {
    title: "Activity Overview",
    subtitle: "Track your revenue and invoice status.",
    totalInvoices: "Total Invoices",
    totalRevenue: "Total Revenue",
    vsLastMonth: "vs last month",
    paidInvoices: "Paid Invoices",
    pendingInvoices: "Pending Invoices",
    overdueInvoices: "Overdue Invoices",
    recentInvoices: "Recent Invoices",
    viewAll: "View all",
    table: {
      client: "Client",
      date: "Date",
      amount: "Amount",
      status: "Status"
    },
    status: {
      paid: "Paid",
      pending: "Pending",
      overdue: "Overdue",
      draft: "Draft"
    }
  },
  invoices: {
    title: "Invoices",
    subtitle: "Manage and track all your invoices.",
    create: "Create Invoice",
    search: "Search for an invoice...",
    all: "All",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    draft: "Draft",
    table: {
      client: "Client",
      number: "Number",
      date: "Date Issue",
      dueDate: "Due Date",
      amount: "Amount",
      status: "Status",
      options: "Options"
    },
    pagination: {
      showing: "Showing",
      to: "to",
      of: "of",
      results: "results"
    },
    actions: {
      view: "View Invoice",
      download: "Download PDF",
      send: "Send by Email",
      edit: "Edit",
      delete: "Delete"
    }
  },
  createInvoice: {
    title: "Create Invoice",
    subtitle: "Create a new invoice and deliver it instantly.",
    showPreview: "Show Preview",
    tabs: {
      standard: "Standard",
      split: "Split",
      recurring: "Recurring"
    },
    info: {
      title: "Invoice Information",
      fullName: "Full Name",
      billedTo: "Billed To",
      dateIssue: "Date Issue",
      dueDate: "Due Date",
      invoiceNumber: "Invoice Number"
    },
    items: {
      title: "Invoice Items/Service",
      currency: "Currency",
      itemName: "Item Name",
      qty: "QTY",
      tax: "Tax",
      amount: "Amount",
      addBtn: "Add Items"
    },
    discount: {
      add: "Add Discount",
      amount: "Discount Amount"
    },
    preview: {
      title: "Preview",
      emailBtn: "Email",
      pdfBtn: "PDF",
      saveDraft: "Draft",
      send: "Send",
      invoice: "INVOICE",
      invoiceNumber: "Invoice Number",
      billedBy: "Billed by:",
      billedTo: "Billed to:",
      dateIssue: "Date Issue:",
      dueDate: "Due Date:",
      subtotal: "Subtotal",
      taxes: "Taxes",
      discount: "Discount",
      grandTotal: "Grand Total",
      note: "Note:",
      noteText: "Late payments will incur a 10% annual fee, calculated daily.",
      paymentMethod: "Payment Method",
      bankTransfer: "EFT Bank Transfer",
      accountNumber: "Account Number:",
      signature: "Signature",
      yourName: "Your Name",
      clientName: "Client Name",
      clientAddress: "Client Address"
    }
  },
  clients: {
    title: "Clients",
    subtitle: "Manage your client directory.",
    add: "Add Client",
    printList: "Print List",
    search: "Search for a client...",
    table: {
      client: "Client",
      email: "Email",
      phone: "Phone",
      address: "Address",
      options: "Options"
    },
    actions: {
      view: "View Profile",
      export: "Export PDF",
      edit: "Edit",
      delete: "Delete"
    },
    empty: "No clients found.",
    form: {
      addTitle: "Add a new client",
      name: "Client Name / Company",
      email: "Email Address",
      phone: "Phone Number",
      address: "Postal Address",
      cancel: "Cancel",
      save: "Save Client"
    }
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account preferences and company information.",
    save: "Save Changes",
    tabs: {
      profile: "User Profile",
      company: "Company Information",
      notifications: "Notifications"
    },
    profile: {
      title: "User Profile",
      changeAvatar: "Change Avatar",
      deleteAvatar: "Delete",
      fullName: "Full Name",
      email: "Email Address",
      password: "New Password",
      regional: "Regional Preferences",
      currency: "Default Currency",
      language: "Language"
    },
    company: {
      title: "Company Information",
      logo: "Company Logo",
      uploadLogo: "Upload Logo",
      deleteLogo: "Delete",
      name: "Company Name",
      siret: "Company Registration Number",
      email: "Contact Email",
      phone: "Contact Phone",
      address: "Address"
    },
    notifications: {
      title: "Notifications",
      payments: {
        title: "Payments Received",
        desc: "Be notified when a client pays an invoice."
      },
      reminders: {
        title: "Overdue Reminders",
        desc: "Alert me of overdue invoices."
      }
    }
  },
  help: {
    title: "Help & Support",
    subtitle: "Find answers to your questions or contact our team.",
    contact: {
      title: "Contact Us",
      email: "Email Support",
      emailDesc: "Reply within 24h",
      phone: "Phone Assistance",
      phoneDesc: "Mon-Fri, 9am - 6pm GMT",
      chat: "Live Chat",
      chatDesc: "Available on website"
    },
    faq: {
      title: "Frequently Asked Questions (FAQ)",
      q1: "How do I create my first invoice?",
      a1: "To create your first invoice, click on the 'New Invoice' button from the dashboard or the Invoices page. Then fill in the client information, add your invoice lines, and click 'Save'.",
      q2: "How do I add a new client?",
      a2: "Go to the 'Clients' section from the sidebar, then click on the 'New Client' button. A form will appear for you to enter the client's information.",
      q3: "Can I change the currency of my invoices?",
      a3: "Yes, you can change your default currency in the 'Settings' section of your account."
    },
    form: {
      title: "Send a message",
      subject: "Subject",
      subjects: {
        tech: "Technical issue",
        billing: "Billing question",
        suggestion: "Improvement suggestion",
        other: "Other"
      },
      message: "Your message",
      placeholder: "How can we help you?",
      send: "Send message",
      success: "Message sent!"
    }
  }
};
