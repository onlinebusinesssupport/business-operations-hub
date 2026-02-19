import { motion } from "framer-motion";
import {
  Mail,
  TrendingUp,
  Settings,
  Receipt,
  PenTool,
  Search,
  PackageOpen,
  Heart,
  Store,
  Briefcase,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/* ───── Core Services ───── */
const coreServices = [
  {
    icon: Mail,
    title: "Executive Admin Support",
    pricing: "From R4k/month",
    items: [
      "Inbox management (sorting, replies, labels)",
      "Calendar + meeting scheduling",
      "Travel bookings + itineraries",
      "Document formatting (proposals, decks, PDFs)",
      "Data entry & file organisation",
    ],
    clients: "Coaches, consultants, startup founders, agencies",
  },
  {
    icon: TrendingUp,
    title: "Sales Support",
    pricing: "From R8k/month",
    items: [
      "CRM setup (HubSpot, Zoho, Airtable)",
      "Lead list building (Apollo, LinkedIn)",
      "Outreach scheduling (email or LinkedIn)",
      "Pipeline tracking",
      "Proposal sending + follow-ups",
    ],
    clients: "Agencies, startups, B2B service providers",
  },
  {
    icon: Settings,
    title: "Operations Support",
    pricing: "From R8k/month",
    items: [
      "SOP creation (documenting processes)",
      "Workflow automation (Zapier, Make)",
      "Notion workspace builds",
      "Airtable dashboards",
      "Task system setup (ClickUp, Asana)",
    ],
    clients: "Growing businesses, agencies, founders scaling",
  },
  {
    icon: Receipt,
    title: "Finance Admin",
    pricing: "From R5k/month",
    items: [
      "Invoice creation",
      "Expense tracking",
      "Payment reminders",
      "Basic bookkeeping prep (for accountant)",
      "Monthly reporting summaries",
    ],
    clients: "Small businesses, solopreneurs, freelancers",
  },
  {
    icon: PenTool,
    title: "Content + Online Presence",
    pricing: "From R4k/month",
    items: [
      "Social media scheduling",
      "Repurposing content across platforms",
      "Blog uploads (WordPress)",
      "Newsletter formatting",
      "Canva graphics",
    ],
    clients: "Personal brands, founders, creators",
  },
  {
    icon: Search,
    title: "Research Services",
    pricing: "From R5k/month",
    items: [
      "Market research",
      "Competitor analysis",
      "Lead research",
      "Grant or funding research",
      "Supplier sourcing",
    ],
    clients: "Impact organisations, startups, strategic founders",
  },
  {
    icon: PackageOpen,
    title: "Systems Setup for Small Businesses",
    pricing: "From R5k/project",
    items: [
      "Email setup",
      "Google Workspace configuration",
      "File structure design",
      "Task system implementation",
      "CRM setup",
    ],
    clients: "Township businesses, new founders, NGOs, creators",
  },
];

/* ───── Niche Services ───── */
const nicheServices = [
  {
    icon: Heart,
    title: "Social Impact VA",
    items: [
      "Grant readiness packs",
      "B-BBEE documentation prep",
      "Proposal formatting",
      "Donor reporting",
    ],
  },
  {
    icon: Briefcase,
    title: "Founder-in-the-Trenches VA",
    items: [
      "WhatsApp business ops",
      "Vendor coordination",
      "Event logistics",
      "Pop-up activations",
    ],
  },
  {
    icon: Store,
    title: "Township Business Enablement",
    items: [
      "Formalisation support (CIPC docs prep)",
      "Basic business systems",
      "Menu costing spreadsheets",
      "Supplier sourcing",
    ],
  },
];

/* ───── Bundles ───── */
const bundles = [
  {
    name: "Starter Founder Support",
    pricing: "From R4k/month",
    includes: ["Inbox + calendar management", "Basic admin support", "Monthly reporting"],
    target: "Coaches, solopreneurs",
  },
  {
    name: "Growth Operator",
    pricing: "From R12k/month",
    includes: ["CRM + lead tracking", "Systems + SOPs", "Sales admin support"],
    target: "Agencies, startups",
  },
  {
    name: "Business Setup Package",
    pricing: "From R10k (once-off)",
    includes: ["Full systems setup", "Tool stack configuration", "Templates + SOPs"],
    target: "New businesses, township enterprises",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.h1
            {...fadeUp}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-foreground"
          >
            Practical support, structured for real businesses.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            I work with founders and growing teams who need dependable operational support
            — not another tool, but a capable person who keeps things running properly.
          </motion.p>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-medium text-foreground"
          >
            Core Services
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-muted-foreground max-w-lg"
          >
            Reliable, retainer-friendly support across the functions that keep your business moving.
          </motion.p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-divider">
            {coreServices.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-secondary p-8 md:p-10"
              >
                <div className="flex items-start justify-between gap-4">
                  <service.icon size={22} className="text-foreground mt-1 shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-medium tracking-wide text-foreground/60">
                    {service.pricing}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mt-4">
                  {service.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-foreground/50">
                  Best for: {service.clients}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Niche Services */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-medium text-foreground"
          >
            Specialist Services
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-muted-foreground max-w-lg"
          >
            Differentiated support rooted in real-world experience — social impact, township
            enterprise, and founder-level operations.
          </motion.p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-divider">
            {nicheServices.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background p-8 md:p-10"
              >
                <service.icon size={22} className="text-foreground mb-5" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {service.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-medium text-foreground"
          >
            Service Bundles
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-muted-foreground max-w-lg"
          >
            Outcome-focused packages designed for where you are right now.
          </motion.p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle, i) => (
              <motion.div
                key={bundle.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background border border-border p-8 md:p-10 flex flex-col"
              >
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {bundle.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-foreground/60">
                  {bundle.pricing}
                </p>
                <ul className="mt-6 space-y-2 flex-1">
                  {bundle.includes.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-foreground/50">
                  Best for: {bundle.target}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-medium text-foreground"
          >
            Ready to bring structure to your operations?
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            Book a consultation and we will work out the right support for where you are now.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex gap-4 justify-center"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-wide">
                Book a Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
