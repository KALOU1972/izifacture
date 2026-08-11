import type { Database } from './src/types/supabase'
type ClientsTable = Database['public']['Tables']['clients']
export const test: ClientsTable = undefined as any;
