
-- Add onboarding fields to profiles table
ALTER TABLE public.profiles
  ADD COLUMN phone text,
  ADD COLUMN company_name text,
  ADD COLUMN industry text,
  ADD COLUMN referral_source text,
  ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;
