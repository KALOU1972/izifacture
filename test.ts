import { createClient } from './src/lib/supabase/client'
import type { Database } from './src/types/supabase'
async function test() {
  const supabase = createClient()
  const { data } = await supabase.from('clients').select('*').returns<Database['public']['Tables']['clients']['Row'][]>()
  console.log(data?.[0]?.id)
}
