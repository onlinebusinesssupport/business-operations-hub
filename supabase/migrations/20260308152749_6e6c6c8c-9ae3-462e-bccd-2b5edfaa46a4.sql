
-- Add onboarding/compliance columns to clients table
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS business_type text DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS company_reg_number text,
  ADD COLUMN IF NOT EXISTS tax_reference text,
  ADD COLUMN IF NOT EXISTS id_type text,
  ADD COLUMN IF NOT EXISTS id_number text,
  ADD COLUMN IF NOT EXISTS passport_number text,
  ADD COLUMN IF NOT EXISTS physical_address text,
  ADD COLUMN IF NOT EXISTS compliance_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS identity_doc_path text,
  ADD COLUMN IF NOT EXISTS onboarding_challenge text;
