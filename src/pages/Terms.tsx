import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-medium mb-4">Legal</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-muted-foreground mb-12">Last Updated: 2026</p>

          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-medium [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1">
            <h2>1. Introduction</h2>
            <p>These Terms and Conditions ("Terms") govern your access to and use of the website, services, client portal, and digital platforms operated by The Business Support Studio (Pty) Ltd ("the Studio", "we", "us", or "our").</p>
            <p>By accessing this website, engaging our services, or using any associated platform, you agree to be bound by these Terms. If you do not agree, you must discontinue use immediately.</p>
            <p>These Terms constitute a binding agreement between you ("Client", "User", or "you") and The Business Support Studio.</p>

            <h2>2. Company Information</h2>
            <p><strong>The Business Support Studio (Pty) Ltd</strong><br />Registered in the Republic of South Africa<br />Operating remotely across South Africa and international markets</p>
            <p>Contact:<br />📧 <a href="mailto:thebusinesssupportstudio@gmail.com" className="text-primary hover:underline">thebusinesssupportstudio@gmail.com</a><br />📍 Johannesburg, South Africa</p>

            <h2>3. Scope of Services</h2>
            <p>The Studio provides business enablement services, including but not limited to:</p>
            <ul>
              <li>Digital brand and marketing support</li>
              <li>Operational and executive support services</li>
              <li>Business automation and systems implementation</li>
              <li>Lead generation and growth enablement</li>
              <li>Advisory, grant support, and strategic assistance</li>
              <li>Premium add-on services (travel, events, experiences)</li>
            </ul>
            <p>All services are delivered under defined scopes, proposals, or subscription agreements. Nothing on this website constitutes a binding offer unless confirmed in writing.</p>

            <h2>4. Eligibility</h2>
            <p>By using our services, you confirm that:</p>
            <ul>
              <li>You are at least 18 years old</li>
              <li>You have the legal capacity to contract</li>
              <li>You are authorised to act on behalf of any organisation you represent</li>
            </ul>
            <p>We reserve the right to refuse service at our discretion.</p>

            <h2>5. Engagement Process</h2>
            <p>Engagement with the Studio typically follows:</p>
            <ol>
              <li>Enquiry or application</li>
              <li>Discovery or qualification</li>
              <li>Proposal issuance</li>
              <li>Acceptance and agreement execution</li>
              <li>Onboarding and delivery</li>
            </ol>
            <p>No work will commence without formal acceptance of a proposal or agreement.</p>

            <h2>6. Client Responsibilities</h2>
            <p>Clients agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Respond in a timely manner to requests</li>
              <li>Provide approvals required for execution</li>
              <li>Ensure lawful use of delivered work</li>
            </ul>
            <p>The Studio shall not be liable for delays caused by client inaction.</p>

            <h2>7. Fees and Payment</h2>
            <h3>7.1 Pricing</h3>
            <p>Pricing may be subscription-based, project-based, retainer-based, or usage-based. All pricing will be defined in proposals or pricing pages.</p>
            <h3>7.2 Invoicing</h3>
            <p>Invoices may be issued upfront (subscriptions), milestone-based, or monthly (retainers).</p>
            <h3>7.3 Late Payments</h3>
            <p>The Studio reserves the right to:</p>
            <ul>
              <li>Suspend services</li>
              <li>Restrict portal access</li>
              <li>Apply late fees where permitted by law</li>
            </ul>

            <h2>8. Refund Policy</h2>
            <p>Due to the nature of digital and service-based work:</p>
            <ul>
              <li>Fees are generally non-refundable</li>
              <li>Partial refunds may be considered at our discretion</li>
              <li>Subscription cancellations apply prospectively, not retrospectively</li>
              <li>Custom work already delivered is non-refundable</li>
            </ul>

            <h2>9. Intellectual Property</h2>
            <h3>9.1 Studio IP</h3>
            <p>All methodologies, systems, templates, frameworks, and internal tools remain the intellectual property of the Studio.</p>
            <h3>9.2 Client Deliverables</h3>
            <p>Upon full payment, clients receive a usage licence for deliverables. Ownership terms may vary by project and will be defined in proposals. The Studio retains the right to showcase non-confidential work in portfolios.</p>

            <h2>10. Confidentiality</h2>
            <p>We treat all client information as confidential and will not disclose it except:</p>
            <ul>
              <li>Where required by law</li>
              <li>With client consent</li>
              <li>Where necessary for service delivery (e.g., subcontractors)</li>
            </ul>
            <p>Clients must also maintain confidentiality of Studio systems and materials.</p>

            <h2>11. Data and Platform Usage</h2>
            <p>Where clients access a client portal or dashboard:</p>
            <ul>
              <li>Login credentials must be kept secure</li>
              <li>Users may not share accounts without permission</li>
              <li>Abuse of platform access may result in termination</li>
            </ul>
            <p>We reserve the right to monitor platform usage for security and quality purposes.</p>

            <h2>12. Third-Party Tools</h2>
            <p>We may integrate or rely on third-party services, including payment gateways, automation platforms, analytics tools, and cloud storage providers. We are not liable for downtime or failures caused by third-party systems.</p>

            <h2>13. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law:</p>
            <ul>
              <li>The Studio shall not be liable for indirect or consequential damages</li>
              <li>We do not guarantee specific financial or business outcomes</li>
              <li>Our total liability shall not exceed fees paid in the preceding 3 months</li>
              <li>All services are provided on a best-effort basis</li>
            </ul>

            <h2>14. Indemnity</h2>
            <p>You agree to indemnify the Studio against claims arising from:</p>
            <ul>
              <li>Misuse of deliverables</li>
              <li>Unlawful business activities</li>
              <li>Third-party disputes arising from client content</li>
            </ul>

            <h2>15. Termination</h2>
            <h3>15.1 By the Client</h3>
            <p>Clients may terminate engagements subject to notice periods defined in agreements and settlement of outstanding fees.</p>
            <h3>15.2 By the Studio</h3>
            <p>We may terminate services if payments are overdue, Terms are breached, or misconduct or abuse occurs.</p>

            <h2>16. Suspension of Services</h2>
            <p>We reserve the right to suspend services immediately where fraud is suspected, legal risks arise, or platform abuse is detected.</p>

            <h2>17. Force Majeure</h2>
            <p>We shall not be liable for delays caused by events beyond our control, including natural disasters, power or infrastructure failures, internet outages, or government actions.</p>

            <h2>18. Non-Solicitation</h2>
            <p>Clients agree not to directly solicit or hire Studio contractors or employees during engagement and for 12 months thereafter without written consent.</p>

            <h2>19. Non-Disparagement</h2>
            <p>Both parties agree to avoid public statements that may harm the reputation of the other party.</p>

            <h2>20. Amendments</h2>
            <p>We reserve the right to update these Terms at any time. Updates will be reflected on the website with a revised effective date. Continued use constitutes acceptance of revised Terms.</p>

            <h2>21. Governing Law</h2>
            <p>These Terms shall be governed by the laws of the Republic of South Africa. Any disputes shall be resolved in South African courts unless otherwise agreed.</p>

            <h2>22. Dispute Resolution</h2>
            <p>Where possible, disputes shall be resolved through good faith negotiation, mediation, or arbitration (if agreed). Litigation shall be a last resort.</p>

            <h2>23. Entire Agreement</h2>
            <p>These Terms, together with proposals and agreements, constitute the full understanding between the parties. No verbal agreements shall be binding unless reduced to writing.</p>

            <h2>24. Contact</h2>
            <p>For legal or contractual queries:</p>
            <p>📧 <a href="mailto:thebusinesssupportstudio@gmail.com" className="text-primary hover:underline">thebusinesssupportstudio@gmail.com</a><br />Subject: Legal / Terms Query</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
