import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Settings, Zap, Target, Globe, FileText, Users } from "lucide-react";

const services = [
  {
    icon: Settings,
    name: "Operations",
    pricing: "R8 500 – R15 000/mo",
    pain: "Drowning in admin while your business runs on memory and maybes.",
    outcome: "The backbone that lets you focus on growth — not fires.",
    idealFor: "Scaling founders, 5–30 person teams",
    href: "/services/operations",
    features: [
      "Calendar & inbox governance",
      "Meeting preparation & follow-ups",
      "Vendor & logistics coordination",
      "Travel management & bookings",
      "Monthly reporting & dashboards",
      "Process documentation",
    ],
  },
  {
    icon: Zap,
    name: "Automation & Systems",
    pricing: "R6 500 – R12 000/mo",
    pain: "Manual processes eating hours. No one knows the workflow except you.",
    outcome: "Systems that run while you sleep — documented, reliable, scalable.",
    idealFor: "Operators eliminating bottlenecks",
    href: "/services/automation",
    features: [
      "Workflow automation design",
      "CRM & tool integrations",
      "SOP documentation",
      "Process optimization",
      "Team onboarding systems",
    ],
  },
  {
    icon: Target,
    name: "Lead Engine",
    pricing: "R9 500 – R18 000/mo",
    pain: "Inconsistent pipeline. Feast-or-famine revenue cycles.",
    outcome: "Predictable demand, engineered — not hoped for.",
    idealFor: "Founders ready to scale revenue",
    href: "/services/lead-engine",
    features: [
      "Lead generation strategy",
      "Outbound campaign management",
      "CRM pipeline optimization",
      "Lead qualification systems",
      "Conversion tracking & reporting",
    ],
  },
  {
    icon: Globe,
    name: "Digital Presence",
    pricing: "R7 500 – R14 000/mo",
    pain: "Your brand looks amateur. Competitors are outpacing you online.",
    outcome: "A digital presence that commands respect and converts.",
    idealFor: "Professionals, consultants, creators",
    href: "/services/digital-presence",
    features: [
      "Social media management",
      "Content strategy & creation",
      "Brand consistency audits",
      "Online reputation management",
      "Engagement optimization",
    ],
  },
  {
    icon: FileText,
    name: "Company Registration & Setup",
    pricing: "From R950",
    pain: "Paralyzed by paperwork. Compliance feels like a maze.",
    outcome: "Your business registered, structured, and ready to trade.",
    idealFor: "New founders, expanding businesses",
    href: "/services/company-registration",
    features: [
      "CIPC company registration",
      "Tax registration (SARS)",
      "B-BBEE compliance setup",
      "Banking & merchant accounts",
      "Shareholder agreements",
    ],
  },
  {
    icon: Users,
    name: "Corporate Events & Retreats",
    pricing: "Custom quote",
    pain: "Events that fall flat. Team offsites that feel like admin burdens.",
    outcome: "Experiences that build culture, align teams, and create momentum.",
    idealFor: "Leadership teams, HR directors, founders",
    href: "/services/corporate-events",
    features: [
      "Strategic retreats & offsites",
      "Team building experiences",
      "Incentive trip planning",
      "Management conferences",
      "Full logistics coordination",
    ],
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
          <motion.span
            {...fadeUp}
            className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium"
          >
            SERVICES
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground"
          >
            Six engines. One private studio.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            Built for founders who are done with chaos. Each service is designed to solve a specific operational pain point — with clear pricing and measurable outcomes.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-[0.1em] uppercase gap-2">
                Start a Conversation
                <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={service.href}
                  className="group block bg-card rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-border/50 hover:border-primary/40 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors duration-300">
                      <service.icon size={24} className="text-primary shrink-0" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</h3>
                      <p className="mt-1 text-sm font-medium text-primary">{service.pricing}</p>
                    </div>
                    <ArrowRight size={18} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-1" />
                  </div>
                  <p className="mt-4 text-sm italic text-muted-foreground">{service.pain}</p>
                  <p className="mt-2 text-sm font-medium text-foreground/80">{service.outcome}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                    Ideal for: {service.idealFor}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {service.features.slice(0, 4).map((f) => (
                      <li key={f} className="text-sm text-foreground/70 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 bg-primary/60 group-hover:bg-primary shrink-0 transition-colors" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View full details</span>
                    <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signal */}
      <section className="py-12 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Proudly built in Johannesburg • Trusted by founders at Yoco, SweepSouth, Takealot-scale businesses.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2
            {...fadeUp}
            className="font-display text-2xl md:text-3xl font-bold leading-snug"
          >
            Ready to bring structure to your operations?
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 opacity-70"
          >
            Start a conversation. No pressure. No obligation. Just clarity on whether we're the right fit.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex gap-4 justify-center flex-wrap"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-[0.1em] uppercase px-8 gap-2 bg-background text-foreground hover:bg-background/90">
                Start a Conversation
                <ArrowRight size={16} />
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
