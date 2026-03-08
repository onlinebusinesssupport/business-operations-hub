ALTER TABLE public.newsletter_subscribers ADD COLUMN full_name text;
ALTER TABLE public.newsletter_subscribers ADD COLUMN popi_consent boolean NOT NULL DEFAULT false;