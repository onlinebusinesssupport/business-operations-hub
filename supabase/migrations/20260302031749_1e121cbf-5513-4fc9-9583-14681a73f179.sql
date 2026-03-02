
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS admin_reply text,
ADD COLUMN IF NOT EXISTS admin_reply_at timestamp with time zone;
