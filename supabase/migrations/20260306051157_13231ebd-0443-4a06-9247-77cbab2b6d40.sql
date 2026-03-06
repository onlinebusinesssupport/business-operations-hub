
-- Update DB default for work_items status from 'to_do' to 'queued'
ALTER TABLE public.work_items ALTER COLUMN status SET DEFAULT 'queued';

-- Migrate existing data: to_do → queued, done → complete
UPDATE public.work_items SET status = 'queued' WHERE status = 'to_do';
UPDATE public.work_items SET status = 'complete' WHERE status = 'done';
