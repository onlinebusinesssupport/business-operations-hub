
-- Account type enum
CREATE TYPE public.account_type AS ENUM ('income', 'expense', 'asset', 'liability', 'equity');

-- Compliance body enum
CREATE TYPE public.compliance_body AS ENUM ('SARS', 'CIPC', 'UIF', 'COIDA', 'Other');

-- Chart of Accounts
CREATE TABLE public.chart_of_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  type account_type NOT NULL,
  category text NOT NULL DEFAULT '',
  tax_treatment text NOT NULL DEFAULT 'vat_exclusive',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access to chart_of_accounts" ON public.chart_of_accounts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Bank Statements
CREATE TABLE public.bank_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text,
  file_name text NOT NULL,
  upload_date timestamptz NOT NULL DEFAULT now(),
  period_start date,
  period_end date,
  bank_name text,
  account_number text,
  status text NOT NULL DEFAULT 'processing',
  total_in numeric DEFAULT 0,
  total_out numeric DEFAULT 0,
  transaction_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access to bank_statements" ON public.bank_statements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Transactions
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id uuid NOT NULL REFERENCES public.bank_statements(id) ON DELETE CASCADE,
  date date NOT NULL,
  description text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  balance numeric,
  account_id uuid REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL,
  ai_category text,
  ai_confidence numeric DEFAULT 0,
  confirmed boolean NOT NULL DEFAULT false,
  vat_amount numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access to transactions" ON public.transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Compliance Items
CREATE TABLE public.compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body compliance_body NOT NULL DEFAULT 'Other',
  due_date date NOT NULL,
  frequency text NOT NULL DEFAULT 'once',
  status text NOT NULL DEFAULT 'upcoming',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access to compliance_items" ON public.compliance_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for bank statements
INSERT INTO storage.buckets (id, name, public) VALUES ('bank-statements', 'bank-statements', false);

CREATE POLICY "Admins can manage bank statement files" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'bank-statements' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'bank-statements' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Seed Chart of Accounts with standard SA SME accounts
INSERT INTO public.chart_of_accounts (code, name, type, category, tax_treatment) VALUES
-- Income
('4000', 'Sales Revenue', 'income', 'Revenue', 'vat_inclusive'),
('4010', 'Service Revenue', 'income', 'Revenue', 'vat_inclusive'),
('4020', 'Interest Received', 'income', 'Other Income', 'exempt'),
('4030', 'Other Income', 'income', 'Other Income', 'vat_exclusive'),
-- Cost of Sales
('5000', 'Cost of Sales - Direct', 'expense', 'Cost of Sales', 'vat_inclusive'),
('5010', 'Subcontractor Costs', 'expense', 'Cost of Sales', 'vat_inclusive'),
('5020', 'Materials & Supplies', 'expense', 'Cost of Sales', 'vat_inclusive'),
-- Operating Expenses
('6000', 'Accounting & Audit Fees', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6010', 'Advertising & Marketing', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6020', 'Bank Charges', 'expense', 'Operating Expenses', 'exempt'),
('6030', 'Computer Expenses', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6040', 'Consulting Fees', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6050', 'Depreciation', 'expense', 'Operating Expenses', 'exempt'),
('6060', 'Entertainment', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6070', 'Insurance', 'expense', 'Operating Expenses', 'exempt'),
('6080', 'Internet & Telephone', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6090', 'Legal Fees', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6100', 'Motor Vehicle Expenses', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6110', 'Office Rent', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6120', 'Office Supplies', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6130', 'Postage & Courier', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6140', 'Printing & Stationery', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6150', 'Repairs & Maintenance', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6160', 'Salaries & Wages', 'expense', 'Operating Expenses', 'exempt'),
('6170', 'Staff Welfare', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6180', 'Subscriptions & Licences', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6190', 'Training & Development', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6200', 'Travel & Accommodation', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6210', 'Utilities (Water & Electricity)', 'expense', 'Operating Expenses', 'vat_inclusive'),
('6220', 'UIF Contributions', 'expense', 'Operating Expenses', 'exempt'),
('6230', 'PAYE', 'expense', 'Operating Expenses', 'exempt'),
-- Assets
('1000', 'Bank Account', 'asset', 'Current Assets', 'exempt'),
('1010', 'Petty Cash', 'asset', 'Current Assets', 'exempt'),
('1020', 'Accounts Receivable', 'asset', 'Current Assets', 'exempt'),
('1500', 'Equipment', 'asset', 'Fixed Assets', 'vat_inclusive'),
-- Liabilities
('2000', 'Accounts Payable', 'liability', 'Current Liabilities', 'exempt'),
('2010', 'VAT Payable', 'liability', 'Current Liabilities', 'exempt'),
('2020', 'SARS - Income Tax', 'liability', 'Current Liabilities', 'exempt'),
('2030', 'Credit Card', 'liability', 'Current Liabilities', 'exempt'),
-- Equity
('3000', 'Owner Equity / Capital', 'equity', 'Equity', 'exempt'),
('3010', 'Retained Earnings', 'equity', 'Equity', 'exempt'),
('3020', 'Drawings', 'equity', 'Equity', 'exempt');

-- Seed Compliance Items (standard SA SME obligations)
INSERT INTO public.compliance_items (title, body, due_date, frequency, status, notes) VALUES
('VAT201 Return', 'SARS', (date_trunc('month', now()) + interval '1 month' + interval '24 days')::date, 'bi-monthly', 'upcoming', 'VAT return due by 25th of the month following the tax period end. File via SARS eFiling.'),
('Provisional Tax - 1st Payment (IRP6)', 'SARS', (date_trunc('year', now()) + interval '7 months' - interval '1 day')::date, 'annual', 'upcoming', 'Due 6 months after start of year of assessment. Based on estimated taxable income.'),
('Provisional Tax - 2nd Payment (IRP6)', 'SARS', (date_trunc('year', now()) + interval '11 months' + interval '30 days')::date, 'annual', 'upcoming', 'Due at end of year of assessment.'),
('Income Tax Return (ITR14)', 'SARS', (date_trunc('year', now()) + interval '11 months' + interval '30 days')::date, 'annual', 'upcoming', 'Annual company income tax return. Check SARS eFiling for exact deadline.'),
('EMP201 Monthly Employer Declaration', 'SARS', (date_trunc('month', now()) + interval '1 month' + interval '6 days')::date, 'monthly', 'upcoming', 'PAYE, UIF, SDL monthly declaration due by 7th of following month.'),
('EMP501 Employer Reconciliation', 'SARS', '2026-10-31'::date, 'annual', 'upcoming', 'Annual employer reconciliation. Interim: end of Oct, Annual: end of May.'),
('CIPC Annual Return (CoR30.1)', 'CIPC', (date_trunc('year', now()) + interval '11 months' + interval '30 days')::date, 'annual', 'upcoming', 'Due within 30 business days of anniversary of registration. File on CIPC eServices.'),
('UIF Monthly Contribution', 'UIF', (date_trunc('month', now()) + interval '1 month' + interval '6 days')::date, 'monthly', 'upcoming', '1% employee + 1% employer contribution. Submitted with EMP201.'),
('COIDA Return of Earnings', 'COIDA', '2026-03-31'::date, 'annual', 'upcoming', 'Workmens Compensation return. Due by 31 March annually. File on CompEasy.'),
('B-BBEE Certificate Renewal', 'Other', '2026-12-31'::date, 'annual', 'upcoming', 'Renew B-BBEE certificate/affidavit before expiry for tender eligibility.');
