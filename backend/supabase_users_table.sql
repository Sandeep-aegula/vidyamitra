-- Run this in Supabase SQL Editor to create the users table for auth (register/login).
-- Required for registration when SUPABASE_URL and SUPABASE_KEY are set in .env.

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: enable RLS and allow anonymous insert for signup (or use a service role key that bypasses RLS)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow insert for signup" ON public.users FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow select for login" ON public.users FOR SELECT USING (true);

-- If you use the anon key, uncomment the policies above. If you use the service_role key, RLS can stay off.
