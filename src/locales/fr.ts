export const fr = {
  sidebar: {
    dashboard: "Tableau de Bord",
    invoices: "Factures",
    clients: "Clients",
    help: "Aide & Support",
    settings: "Paramètres",
    darkMode: "Dark Mode",
    language: "Langue"
  },
  dashboard: {
    title: "Aperçu de l'activité",
    subtitle: "Suivez vos revenus et l'état de vos factures.",
    totalInvoices: "Total Factures",
    totalRevenue: "Revenu Total",
    vsLastMonth: "vs mois dernier",
    paidInvoices: "Factures Payées",
    pendingInvoices: "Factures en Attente",
    overdueInvoices: "Factures en Retard",
    recentInvoices: "Factures Récentes",
    viewAll: "Voir tout",
    table: {
      client: "Client",
      date: "Date",
      amount: "Montant",
      status: "Statut"
    },
    status: {
      paid: "Payé",
      pending: "En attente",
      overdue: "En retard",
      draft: "Brouillon"
    }
  },
  invoices: {
    title: "Factures",
    subtitle: "Gérez et suivez toutes vos factures.",
    create: "Créer une facture",
    search: "Rechercher une facture...",
    all: "Toutes",
    paid: "Payées",
    pending: "En attente",
    overdue: "En retard",
    draft: "Brouillon",
    table: {
      client: "Client",
      number: "Numéro",
      date: "Date d'émission",
      dueDate: "Échéance",
      amount: "Montant",
      status: "Statut",
      options: "Options"
    },
    pagination: {
      showing: "Affichage de",
      to: "à",
      of: "sur",
      results: "résultats"
    },
    actions: {
      view: "Voir la facture",
      download: "Télécharger PDF",
      send: "Envoyer par email",
      edit: "Modifier",
      delete: "Supprimer"
    }
  },
  createInvoice: {
    title: "Créer une facture",
    subtitle: "Créez une nouvelle facture et envoyez-la instantanément.",
    showPreview: "Prévisualiser",
    tabs: {
      standard: "Standard",
      split: "Fractionnée",
      recurring: "Récurrente"
    },
    info: {
      title: "Informations de la facture",
      fullName: "Nom complet",
      billedTo: "Facturé à",
      dateIssue: "Date d'émission",
      dueDate: "Date d'échéance",
      invoiceNumber: "Numéro de facture"
    },
    items: {
      title: "Articles / Services",
      currency: "Devise",
      itemName: "Description de l'article",
      qty: "Qté",
      tax: "Taxe",
      amount: "Montant",
      addBtn: "Ajouter un article"
    },
    discount: {
      add: "Ajouter une remise",
      amount: "Montant de la remise"
    },
    preview: {
      title: "Aperçu",
      emailBtn: "Email",
      pdfBtn: "PDF",
      saveDraft: "Brouillon",
      send: "Envoyer",
      invoice: "FACTURE",
      invoiceNumber: "Numéro de facture",
      billedBy: "Émis par :",
      billedTo: "Facturé à :",
      dateIssue: "Date d'émission :",
      dueDate: "Date d'échéance :",
      subtotal: "Sous-total",
      taxes: "Taxes",
      discount: "Remise",
      grandTotal: "Total Général",
      note: "Note :",
      noteText: "Les retards de paiement entraîneront des pénalités annuelles de 10%.",
      paymentMethod: "Méthode de paiement",
      bankTransfer: "Virement Bancaire",
      accountNumber: "Numéro de compte :",
      signature: "Signature",
      yourName: "Votre Nom",
      clientName: "Nom du Client",
      clientAddress: "Adresse du client"
    }
  },
  clients: {
    title: "Clients",
    subtitle: "Gérez votre répertoire de clients.",
    add: "Ajouter un client",
    printList: "Imprimer la liste",
    search: "Rechercher un client...",
    table: {
      client: "Client",
      email: "Email",
      phone: "Téléphone",
      address: "Adresse",
      options: "Options"
    },
    actions: {
      view: "Voir le profil",
      export: "Exporter PDF",
      edit: "Modifier",
      delete: "Supprimer"
    },
    empty: "Aucun client trouvé.",
    form: {
      addTitle: "Ajouter un nouveau client",
      name: "Nom du client / Entreprise",
      email: "Adresse email",
      phone: "Numéro de téléphone",
      address: "Adresse postale",
      cancel: "Annuler",
      save: "Enregistrer le client"
    }
  },
  settings: {
    title: "Paramètres",
    subtitle: "Gérez les préférences de votre compte et les informations de votre entreprise.",
    save: "Enregistrer les modifications",
    tabs: {
      profile: "Profil Utilisateur",
      company: "Informations Entreprise",
      notifications: "Notifications"
    },
    profile: {
      title: "Profil Utilisateur",
      changeAvatar: "Changer l'avatar",
      deleteAvatar: "Supprimer",
      fullName: "Nom complet",
      email: "Adresse e-mail",
      phone: "Numéro de téléphone",
      password: "Nouveau mot de passe",
      regional: "Préférences régionales",
      currency: "Devise par défaut",
      language: "Langue"
    },
    company: {
      title: "Informations de l'entreprise",
      logo: "Logo de l'entreprise",
      uploadLogo: "Importer un logo",
      deleteLogo: "Supprimer",
      name: "Nom de l'entreprise",
      siret: "Numéro de Compte Contribuable",
      email: "Email de contact",
      phone: "Téléphone de contact",
      address: "Adresse"
    },
    notifications: {
      title: "Notifications",
      payments: {
        title: "Paiements reçus",
        desc: "Être notifié quand un client paie une facture."
      },
      reminders: {
        title: "Rappels de retard",
        desc: "M'alerter des factures en retard."
      }
    }
  },
  help: {
    title: "Aide & Support",
    subtitle: "Trouvez des réponses à vos questions ou contactez notre équipe.",
    contact: {
      title: "Nous Contacter",
      email: "Support par email",
      emailDesc: "Réponse sous 24h",
      phone: "Assistance téléphonique",
      phoneDesc: "Lun-Ven, 9h - 18h GMT",
      chat: "Chat en direct",
      chatDesc: "Disponible sur le site"
    },
    faq: {
      title: "Questions Fréquentes (FAQ)",
      q1: "Comment créer ma première facture ?",
      a1: "Pour créer votre première facture, cliquez sur le bouton 'Nouvelle Facture' depuis le tableau de bord ou la page Factures. Remplissez ensuite les informations du client, ajoutez vos lignes de facturation et cliquez sur 'Sauvegarder'.",
      q2: "Comment ajouter un nouveau client ?",
      a2: "Allez dans la section 'Clients' depuis le menu latéral, puis cliquez sur le bouton 'Nouveau Client'. Un formulaire apparaîtra pour vous permettre de saisir les informations du client.",
      q3: "Puis-je changer la devise de mes factures ?",
      a3: "Oui, vous pouvez modifier votre devise par défaut dans la section 'Paramètres' de votre compte."
    },
    form: {
      title: "Envoyer un message",
      subject: "Sujet",
      subjects: {
        tech: "Problème technique",
        billing: "Question sur la facturation",
        suggestion: "Suggestion d'amélioration",
        other: "Autre"
      },
      message: "Votre message",
      placeholder: "Comment pouvons-nous vous aider ?",
      send: "Envoyer le message",
      success: "Message envoyé !"
    }
  }
};
