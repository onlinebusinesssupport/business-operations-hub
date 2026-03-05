import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-medium mb-4">Legal</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last Updated: 2026</p>

          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-medium [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            <h2>1. Introduction</h2>
            <p>The Business Support Studio (Pty) Ltd ("the Studio", "we", "us", or "our") is committed to protecting your personal information and ensuring transparency in how data is collected, used, stored, and protected.</p>
            <p>This Privacy Policy explains how we process personal information in accordance with:</p>
            <ul>
              <li>The Protection of Personal Information Act (POPIA), South Africa</li>
              <li>The Promotion of Access to Information Act, 2 of 2000 ("PAIA")</li>
              <li>Applicable international data protection principles</li>
              <li>Best-practice information governance standards</li>
            </ul>
            <p>By using our website, services, or client platforms, you agree to the practices described in this Policy.</p>

            <h2>2. Who We Are</h2>
            <p><strong>The Business Support Studio (Pty) Ltd</strong><br />Johannesburg, South Africa<br />Operating remotely across South Africa and globally</p>
            <p>Contact:<br />📧 <a href="mailto:thequitehelpinghand@gmail.com" className="text-primary hover:underline">thequitehelpinghand@gmail.com</a></p>
            <p>For purposes of POPIA, we act as the Responsible Party when determining how personal data is processed.</p>

            <h2>3. Scope of this Policy</h2>
            <p>This Privacy Policy applies to:</p>
            <ul>
              <li>Visitors to our website</li>
              <li>Clients and prospective clients</li>
              <li>Service providers and business partners</li>
              <li>Individuals who engage with us via digital platforms, email, or other communications channels</li>
            </ul>
            <p>It governs all personal information processed by the Studio in both electronic and physical formats.</p>

            <h2>4. Definitions</h2>
            <ul>
              <li><strong>Personal Information</strong> — Information relating to an identifiable, living natural person and, where applicable, an identifiable juristic person, as defined under POPIA. This includes names and contact details, identification numbers, online identifiers, business information, and financial data.</li>
              <li><strong>Processing</strong> — Any operation concerning personal data, including collection, recording, organisation, storage, updating, retrieval, use, distribution, or destruction.</li>
              <li><strong>Data Subject</strong> — The person or entity to whom the information relates.</li>
              <li><strong>Operator</strong> — A third party who processes personal information on behalf of the Studio.</li>
            </ul>

            <h2>5. Information We Collect</h2>
            <h3>5.1 Personal Identification Data</h3>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Business name</li>
            </ul>
            <h3>5.2 Business Information</h3>
            <ul>
              <li>Company details</li>
              <li>Website URLs</li>
              <li>Service interests</li>
              <li>Operational needs</li>
            </ul>
            <h3>5.3 Client Portal Data</h3>
            <ul>
              <li>Login credentials</li>
              <li>Requests submitted</li>
              <li>Project files</li>
              <li>Communication logs</li>
              <li>Activity history</li>
            </ul>
            <h3>5.4 Financial Information</h3>
            <ul>
              <li>Billing details</li>
              <li>Invoices and payment records</li>
              <li>Transaction metadata (via payment providers)</li>
            </ul>
            <p>We do not store raw card data where payment processors are used.</p>
            <h3>5.5 Technical Information</h3>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device identifiers</li>
              <li>Website usage data</li>
              <li>Cookies and tracking technologies</li>
            </ul>
            <h3>5.6 Special Personal Information</h3>
            <p>We generally do not intentionally collect special personal information (e.g., health, religion, race) unless required by law, necessary for employment obligations, or provided voluntarily with explicit consent.</p>

            <h2>6. How We Collect Information</h2>
            <p>We collect information through:</p>
            <ul>
              <li>Website contact forms</li>
              <li>Service onboarding forms</li>
              <li>Email and WhatsApp communication</li>
              <li>Client portal interactions</li>
              <li>Proposals and contracts</li>
              <li>Surveys and feedback forms</li>
              <li>Third-party referrals (where lawfully permitted)</li>
            </ul>
            <p>Information may be provided directly by you or generated during service delivery.</p>

            <h2>7. Lawful Basis for Processing</h2>
            <p>Under POPIA, we process personal data based on:</p>
            <ul>
              <li><strong>Consent</strong> — Where explicit consent is provided (e.g., form submissions)</li>
              <li><strong>Contractual necessity</strong> — To perform contractual obligations</li>
              <li><strong>Legal obligations</strong> — To comply with applicable laws</li>
              <li><strong>Legitimate business interests</strong> — For business operations, provided such interest does not override the rights of data subjects</li>
            </ul>
            <p>Where consent is required, it may be withdrawn at any time.</p>

            <h2>8. Purpose of Processing</h2>
            <p>We process personal information for legitimate business purposes, including:</p>
            <ul>
              <li>Responding to enquiries and requests</li>
              <li>Delivering contracted services</li>
              <li>Managing client relationships</li>
              <li>Issuing proposals and invoices</li>
              <li>Operating the client portal</li>
              <li>Providing support and communication</li>
              <li>Improving service delivery</li>
              <li>Legal and regulatory compliance</li>
              <li>Conducting marketing communications (where consented)</li>
            </ul>
            <p>We do not sell personal data. We do not process personal information for purposes incompatible with the original collection purpose.</p>

            <h2>9. Client Portal and Platform Data</h2>
            <p>If you are a client using our digital platforms:</p>
            <ul>
              <li>Your activity may be logged for quality and security</li>
              <li>Files uploaded remain accessible only to authorised parties</li>
              <li>Usage data may inform service analytics and improvements</li>
            </ul>
            <p>We implement reasonable safeguards to protect portal integrity.</p>

            <h2>10. Sharing of Personal Information</h2>
            <h3>10.1 Service Providers (Operators)</h3>
            <p>We may share data with:</p>
            <ul>
              <li>IT service providers</li>
              <li>Cloud storage providers</li>
              <li>Payment processors</li>
              <li>Email and automation platforms</li>
              <li>Analytics providers</li>
              <li>Legal and professional advisors</li>
            </ul>
            <p>All operators are contractually bound to confidentiality and data protection obligations.</p>
            <h3>10.2 Legal Obligations</h3>
            <p>We may disclose data if required by court orders, regulatory authorities, or law enforcement.</p>
            <h3>10.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or restructuring, personal information may be transferred subject to appropriate confidentiality safeguards.</p>
            <p>We do not sell or trade personal information.</p>

            <h2>11. Cross-Border Transfers</h2>
            <p>As a digital business, we may store or process data outside South Africa using global cloud providers. Where cross-border transfers occur, we ensure adequate protection standards, reputable providers, and contractual safeguards.</p>

            <h2>12. Data Retention</h2>
            <p>We retain personal data only as long as necessary for:</p>
            <ul>
              <li>Service delivery</li>
              <li>Legal compliance</li>
              <li>Financial recordkeeping</li>
              <li>Dispute resolution</li>
            </ul>
            <p>Typical retention periods:</p>
            <ul>
              <li>Client records: Up to 5 years post-engagement</li>
              <li>Financial records: As required by law</li>
              <li>Marketing data: Until withdrawal of consent</li>
            </ul>
            <p>Data no longer required will be securely deleted or anonymised.</p>

            <h2>13. Data Security</h2>
            <p>We implement appropriate, reasonable technical and organisational safeguards, including:</p>
            <ul>
              <li>Secure cloud infrastructure</li>
              <li>Access controls and authentication</li>
              <li>Encryption where applicable</li>
              <li>Role-based data access</li>
              <li>Secure backups</li>
              <li>Confidentiality agreements</li>
              <li>Secure data disposal procedures</li>
            </ul>
            <p>In the event of a data breach, we will notify affected data subjects and the Information Regulator as required by law. While we take strong precautions, no digital system is entirely risk-free.</p>

            <h2>14. Your Rights Under POPIA</h2>
            <p>As a data subject, you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction or updates</li>
              <li>Request deletion (where lawful)</li>
              <li>Object to processing</li>
              <li>Withdraw consent</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>
            <p>Requests may be submitted via email (see Section 18).</p>

            <h2>15. Cookies and Tracking</h2>
            <p>Our website may use cookies and similar technologies for basic functionality, analytics, user experience optimisation, and measuring marketing effectiveness. You may disable cookies via browser settings, though some features may be affected.</p>

            <h2>16. Marketing Communications</h2>
            <p>We may send service updates, product announcements, and thought leadership content. You may opt out at any time via unsubscribe links or direct email requests. We do not send unsolicited spam.</p>

            <h2>17. Third-Party Links</h2>
            <p>Our website or platforms may contain links to external sites. We are not responsible for the privacy practices of third-party websites. Users are encouraged to review external privacy policies independently.</p>

            <h2>18. Children's Information</h2>
            <p>Our services are not directed at individuals under 18. We do not knowingly collect data from minors without parental consent. If such data is identified, it will be deleted promptly.</p>

            <h2>19. Information Officer</h2>
            <p>In compliance with POPIA and PAIA, the Studio has appointed an Information Officer.</p>
            <p><strong>Information Officer:</strong><br />Dylan Mgobhozi<br />📧 <a href="mailto:thequitehelpinghand@gmail.com" className="text-primary hover:underline">thequitehelpinghand@gmail.com</a><br />📍 Johannesburg, South Africa</p>
            <p>All data-related queries, objections, and access requests should be directed to the Information Officer.</p>

            <h2>20. Access and Correction Requests</h2>
            <p>To exercise your data rights, contact:</p>
            <p>📧 <a href="mailto:thequitehelpinghand@gmail.com" className="text-primary hover:underline">thequitehelpinghand@gmail.com</a><br />Subject: Privacy Request</p>
            <p>Please include your name, nature of request, and relevant details. We may verify identity before processing requests.</p>

            <h2>21. Complaints</h2>
            <p>If you believe your personal information has been mishandled, you may:</p>
            <ul>
              <li>Contact us directly for resolution</li>
              <li>Escalate to the Information Regulator (South Africa)</li>
            </ul>
            <p>Information Regulator Contact:<br /><a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.justice.gov.za/inforeg/</a><br />Email: <a href="mailto:inforeg@justice.gov.za" className="text-primary hover:underline">inforeg@justice.gov.za</a></p>

            <h2>22. Updates to This Policy</h2>
            <p>We may update this Privacy Policy periodically to reflect regulatory changes, operational updates, and best practice improvements. The latest version will always be available on our website with an updated effective date.</p>

            <h2>23. Acceptance of this Policy</h2>
            <p>By using our website or services, you acknowledge that you have read, understood, and agreed to this Privacy Policy.</p>

            <h2>24. Contact</h2>
            <p>For privacy-related queries:</p>
            <p>📧 <a href="mailto:thequitehelpinghand@gmail.com" className="text-primary hover:underline">thequitehelpinghand@gmail.com</a><br />Subject: Privacy / POPIA Query</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
