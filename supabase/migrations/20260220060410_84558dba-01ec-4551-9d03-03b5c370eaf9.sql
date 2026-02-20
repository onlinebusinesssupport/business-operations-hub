-- Add length constraints to the applications table to prevent abuse
ALTER TABLE public.applications
ADD CONSTRAINT chk_full_name_length CHECK (length(full_name) <= 150),
ADD CONSTRAINT chk_business_name_length CHECK (length(business_name) <= 200),
ADD CONSTRAINT chk_email_length CHECK (length(email) <= 255),
ADD CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT chk_country_length CHECK (length(country) <= 100),
ADD CONSTRAINT chk_website_length CHECK (length(website) <= 500 OR website IS NULL),
ADD CONSTRAINT chk_pain_points_length CHECK (length(pain_points) <= 2000 OR pain_points IS NULL),
ADD CONSTRAINT chk_intent_length CHECK (length(intent) <= 2000 OR intent IS NULL),
ADD CONSTRAINT chk_industry_length CHECK (length(industry) <= 100 OR industry IS NULL),
ADD CONSTRAINT chk_team_size_length CHECK (length(team_size) <= 50 OR team_size IS NULL),
ADD CONSTRAINT chk_revenue_range_length CHECK (length(revenue_range) <= 50 OR revenue_range IS NULL),
ADD CONSTRAINT chk_primary_channel_length CHECK (length(primary_channel) <= 100 OR primary_channel IS NULL),
ADD CONSTRAINT chk_admin_notes_length CHECK (length(admin_notes) <= 5000 OR admin_notes IS NULL);