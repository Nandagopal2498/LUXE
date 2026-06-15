// Supabase client utilities
// Supabase is only imported dynamically when credentials are configured

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && key && url.startsWith('https://'));
}

export async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Browser-side Supabase client (lazy)
let browserClient: ReturnType<typeof import('@supabase/supabase-js').createClient> | null = null;

export async function getBrowserSupabase() {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !url.startsWith('https://')) return null;
  const { createClient } = await import('@supabase/supabase-js');
  browserClient = createClient(url, key);
  return browserClient;
}
