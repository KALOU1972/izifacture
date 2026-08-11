-- ===========================================================================
-- IZIFACTURE - SCHÉMA DE BASE DE DONNÉES (SUPABASE)
-- AVEC AUTHENTIFICATION (user_id) ET ROW LEVEL SECURITY (RLS)
-- ===========================================================================

-- 1. Activer l'extension pgcrypto pour les UUID (généralement activée par défaut)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 2. SUPPRESSION DES TABLES EXISTANTES (Pour un environnement vierge)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS public.invoice_items CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.company_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- ---------------------------------------------------------------------------
-- 3. CRÉATION DES TABLES
-- ---------------------------------------------------------------------------

-- Table: profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'admin', -- 'admin' or 'agent'
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- ID of the admin if this user is an agent
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: company_settings
CREATE TABLE public.company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    siret TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: clients
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: invoices
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Brouillon', -- 'Brouillon', 'Envoyée', 'Payée', 'En retard'
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: invoice_items
CREATE TABLE public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0
);


-- ---------------------------------------------------------------------------
-- 4. ACTIVATION DU ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- 5. POLITIQUES DE SÉCURITÉ (POLICIES)
-- L'utilisateur ne peut voir/modifier QUE ses propres données.
-- ---------------------------------------------------------------------------

-- Profiles
CREATE POLICY "Users can manage their own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Company Settings
CREATE POLICY "Admins can manage their own company settings" 
ON public.company_settings FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents can view their admin's company settings" 
ON public.company_settings FOR SELECT 
USING (
    user_id = (SELECT admin_id FROM public.profiles WHERE profiles.user_id = auth.uid())
);

-- Clients
CREATE POLICY "Users can manage their own clients" 
ON public.clients FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Invoices
CREATE POLICY "Users can manage their own invoices" 
ON public.invoices FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Invoice Items
-- Pour invoice_items, on autorise si l'utilisateur est le propriétaire de la facture (invoice_id)
CREATE POLICY "Users can manage items of their own invoices" 
ON public.invoice_items FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.invoices 
        WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.invoices 
        WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
    )
);


-- ---------------------------------------------------------------------------
-- 6. TRIGGERS (Optionnel mais recommandé)
-- Création automatique du profil lors de l'inscription via Supabase Auth
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role, admin_id)
  VALUES (new.id, new.email, 'admin', NULL);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- FIN DU SCRIPT ============================================================
