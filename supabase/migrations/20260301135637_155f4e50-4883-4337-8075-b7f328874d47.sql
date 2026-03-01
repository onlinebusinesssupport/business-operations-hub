
-- Add subscription and retainer fields to clients
ALTER TABLE public.clients 
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS retainer_limit integer NOT NULL DEFAULT 40,
  ADD COLUMN IF NOT EXISTS retainer_used integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_rate numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tier text DEFAULT 'standard';
