import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERREUR: Variables d'environnement manquantes dans .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Début de l'injection des données (Clients + Factures historiques)...");

  // 1. Récupérer le premier utilisateur
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('user_id')
    .limit(1);

  if (profileError || !profiles || profiles.length === 0) {
    console.error("❌ Aucun compte utilisateur trouvé ! Veuillez aller sur http://localhost:3000/signup et créer un compte en premier.");
    process.exit(1);
  }

  const userId = profiles[0].user_id;
  console.log(`👤 Utilisateur ciblé : ${userId}`);

  // 2. Insérer les clients
  const clientsData = [
    { user_id: userId, name: "Tech Africa", email: "contact@techafrica.ci", phone: "+225 0102030405", address: "Plateau, Abidjan" },
    { user_id: userId, name: "Cansaas Agency", email: "hello@cansaas.com", phone: "+225 0708091011", address: "Cocody, Abidjan" },
    { user_id: userId, name: "Startup CI", email: "info@startup.ci", phone: "+225 0506070809", address: "Marcory, Abidjan" },
    { user_id: userId, name: "Menuiserie Koffi", email: "koffi.menuiserie@gmail.com", phone: "+225 0123456789", address: "Yopougon, Abidjan" },
    { user_id: userId, name: "Boutique Chez Awa", email: "awa.boutique@yahoo.fr", phone: "+225 0789101112", address: "Treichville, Abidjan" }
  ];

  const { data: insertedClients, error: clientsError } = await supabase
    .from('clients')
    .insert(clientsData)
    .select('id');
  
  if (clientsError || !insertedClients) {
    console.error("❌ Erreur lors de l'insertion des clients:", clientsError?.message);
    process.exit(1);
  }
  console.log("✅ 5 Clients insérés avec succès !");

  // 3. Insérer les paramètres d'entreprise
  const company = {
    user_id: userId,
    name: "IziFacture Inc.",
    email: "contact@izifacture.com",
    phone: "+225 01 02 03 04 05",
    address: "Abidjan, Côte d'Ivoire",
    siret: "123456789"
  };

  await supabase.from('company_settings').insert(company);
  console.log("✅ Paramètres d'entreprise insérés avec succès !");

  // 4. Insérer des factures historiques (Mois dernier et ce mois-ci)
  console.log("⏳ Génération des factures historiques pour les statistiques...");
  
  const now = new Date();
  
  // Fonction pour obtenir une date du mois dernier
  const getLastMonthDate = (day) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, day);
    return d.toISOString().split('T')[0];
  };

  // Fonction pour obtenir une date de ce mois
  const getThisMonthDate = (day) => {
    const d = new Date(now.getFullYear(), now.getMonth(), day);
    return d.toISOString().split('T')[0];
  };

  const invoicesToCreate = [
    // --- MOIS DERNIER ---
    {
      user_id: userId,
      client_id: insertedClients[0].id,
      invoice_number: "INV-001",
      status: "Payée",
      issue_date: getLastMonthDate(5),
      due_date: getLastMonthDate(20),
      subtotal: 500000,
      tax_amount: 90000,
      total: 590000,
      notes: "Prestation de développement Web"
    },
    {
      user_id: userId,
      client_id: insertedClients[1].id,
      invoice_number: "INV-002",
      status: "Payée",
      issue_date: getLastMonthDate(12),
      due_date: getLastMonthDate(27),
      subtotal: 250000,
      tax_amount: 0,
      total: 250000,
      notes: "Design UI/UX"
    },
    // --- CE MOIS-CI (Plus d'activité pour avoir un trend positif) ---
    {
      user_id: userId,
      client_id: insertedClients[2].id,
      invoice_number: "INV-003",
      status: "Payée",
      issue_date: getThisMonthDate(2),
      due_date: getThisMonthDate(17),
      subtotal: 800000,
      tax_amount: 144000,
      total: 944000,
      notes: "Application mobile"
    },
    {
      user_id: userId,
      client_id: insertedClients[3].id,
      invoice_number: "INV-004",
      status: "Envoyée",
      issue_date: getThisMonthDate(10),
      due_date: getThisMonthDate(25),
      subtotal: 150000,
      tax_amount: 0,
      total: 150000,
      notes: "Maintenance serveur"
    },
    {
      user_id: userId,
      client_id: insertedClients[4].id,
      invoice_number: "INV-005",
      status: "Brouillon",
      issue_date: getThisMonthDate(15),
      due_date: getThisMonthDate(30),
      subtotal: 300000,
      tax_amount: 54000,
      total: 354000,
      notes: "Consulting SEO"
    }
  ];

  const { data: insertedInvoices, error: invoicesError } = await supabase
    .from('invoices')
    .insert(invoicesToCreate)
    .select('id, subtotal');

  if (invoicesError || !insertedInvoices) {
    console.error("❌ Erreur lors de l'insertion des factures:", invoicesError?.message);
    process.exit(1);
  }
  
  // Insérer des items pour chaque facture
  const itemsToCreate = insertedInvoices.map((inv, index) => ({
    invoice_id: inv.id,
    description: `Service professionnel facturé #${index + 1}`,
    quantity: 1,
    unit_price: inv.subtotal,
    amount: inv.subtotal
  }));

  await supabase.from('invoice_items').insert(itemsToCreate);
  
  console.log("✅ Factures historiques créées avec succès ! Les pourcentages du Dashboard seront calculés de façon réaliste.");
  console.log("🎉 Seed terminé ! Allez vérifier votre tableau de bord sur http://localhost:3000/");
}

seed();
