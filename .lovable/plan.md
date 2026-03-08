

## Finance Dashboard — KPMG-Style Reports

### What We're Building

A dedicated finance reporting hub at `/admin/finance` with professional, audit-firm-quality presentation. Four report views powered by existing data (invoices, transactions, chart of accounts, clients).

### Data Sources (already available)
- **invoices** — revenue, billing, client payments
- **transactions** — bank statement line items categorised against chart_of_accounts
- **chart_of_accounts** — GL structure with types (income/expense/asset/liability/equity)
- **clients** — client metadata, lifetime revenue

### Report Tabs

**A. Revenue & Sales**
- Monthly revenue trend (bar chart via Recharts — already installed)
- Revenue by client (horizontal bars)
- Invoice aging analysis (current, 30 days, 60 days, 90+ days)
- Collection rate KPI (paid vs total)
- YTD vs prior period comparison

**B. Profit & Loss Statement**
- Standard P&L layout: Revenue → Cost of Sales → Gross Profit → Operating Expenses → Net Profit
- Aggregates confirmed transactions by chart_of_accounts type/category
- Includes VAT summary line
- Period selector (monthly/quarterly/YTD)
- Exportable to CSV

**C. Cash Flow Summary**
- Total inflows vs outflows from bank statements
- Monthly cash movement trend (line chart)
- Top 5 expense categories (from categorised transactions)
- Top 5 income sources
- Running bank balance if available

**D. Compliance & Tax**
- VAT summary: Output VAT (on income) vs Input VAT (on expenses) = VAT payable
- PAYE/UIF obligation tracking (from compliance_items)
- Upcoming filing deadlines with status indicators

### KPMG Styling
- Dark navy header bar with report title and period
- Formal serif headings, monospace numbers
- Clean bordered tables with alternating row shading
- Subtle grid lines, no rounded corners
- Professional color palette: navy, slate, muted green/red for positive/negative
- "Prepared by" footer with timestamp
- Print-friendly layout (CSS print styles)

### Implementation
1. Create `src/pages/admin/AdminFinance.tsx` — single page with 4 tab views
2. Add route `/admin/finance` and sidebar nav item (icon: DollarSign, label: "Finance")
3. All data from existing tables — no new DB tables needed
4. Recharts for bar/line charts (already installed)
5. CSV export on each report tab

### Navigation
- Add "Finance" between "Revenue" and "Accountant" in admin sidebar

