import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Executive Operations Support",
    price: "$3,500–$6,500",
    frequency: "/mo",
    hours: "20–30 hrs/week",
    bestFor: "Early-stage founders, 5–20 person teams",
    features: [
      "Calendar management & inbox governance",
      "Meeting preparation & follow-ups",
      "Logistics coordination",
      "Workflow optimization",
      "Monthly reporting summaries",
    ],
  },
  {
    name: "Fractional Operations Director",
    price: "$6,500–$12,000",
    frequency: "/mo",
    hours: "30–40 hrs/week",
    bestFor: "Growing businesses, Series A-B, 15–50 person teams",
    features: [
      "Everything in Executive Support",
      "Operations strategy & quarterly planning",
      "Systems design & efficiency roadmaps",
      "Financial operations & expense tracking",
      "HR coordination & vendor management",
    ],
  },
  {
    name: "Specialized Consulting",
    price: "$8,000–$30,000+",
    frequency: "",
    hours: "Project-based",
    bestFor: "Specific operational challenges or initiatives",
    features: [
      "Cash flow architecture",
      "Hiring systems & vendor optimization",
      "Process documentation",
      "Growth transition planning",
      "Custom systems implementation",
    ],
  },
  {
    name: "Hospitality Consulting",
    price: "$5,000–$15,000",
    frequency: "/mo",
    hours: "Project or retainer",
    bestFor: "Hotels, restaurants, travel, service businesses",
    features: [
      "Guest experience optimization",
      "Operations management & coordination",
      "Staff training & service standards",
      "Revenue management & compliance",
      "Quality assurance systems",
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
            className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground"
          >
            Structured support for founders building real businesses.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            Choose the level of operational support that fits your stage. Every engagement includes a dedicated client portal with transparent reporting.
          </motion.p>
        </div>
      </section>

      {/* Tier Comparison Table */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-bold text-foreground"
          >
            Service Tiers Overview
          </motion.h2>

          {/* Desktop Table */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10 hidden lg:block overflow-x-auto"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-4 text-sm font-medium">Service Tier</th>
                  <th className="p-4 text-sm font-medium">Monthly Investment</th>
                  <th className="p-4 text-sm font-medium">Hours/Week</th>
                  <th className="p-4 text-sm font-medium">Best For</th>
                  <th className="p-4 text-sm font-medium">Key Features</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, i) => (
                  <tr key={tier.name} className={i % 2 === 0 ? "bg-background" : "bg-secondary"}>
                    <td className="p-4 text-sm font-medium text-foreground">{tier.name}</td>
                    <td className="p-4 text-sm text-foreground">{tier.price}{tier.frequency}</td>
                    <td className="p-4 text-sm text-foreground">{tier.hours}</td>
                    <td className="p-4 text-sm text-muted-foreground">{tier.bestFor}</td>
                    <td className="p-4 text-sm text-muted-foreground">{tier.features.slice(0, 3).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Mobile Cards */}
          <div className="mt-10 lg:hidden grid grid-cols-1 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-background border-l-2 border-primary p-8"
              >
                <h3 className="font-serif text-xl font-bold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-lg font-medium text-primary">{tier.price}{tier.frequency}</p>
                <p className="text-xs text-muted-foreground">{tier.hours}</p>
                <p className="mt-3 text-sm italic text-muted-foreground">Best for: {tier.bestFor}</p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Clients Receive */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-bold text-foreground"
          >
            What Clients Receive
          </motion.h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Executive Operations Support Includes:",
                items: [
                  "Calendar & Time Management: Complete governance, scheduling, conflict resolution",
                  "Inbox Management: Email triage, priority flagging, response drafting",
                  "Meeting Preparation: Agenda setting, research, post-meeting follow-up",
                ],
              },
              {
                title: "Fractional Operations Director Includes:",
                items: [
                  "Everything above, plus:",
                  "Operations Strategy: Quarterly planning, systems design, efficiency roadmaps",
                  "Financial Operations: Cash flow forecasting, expense tracking, vendor management",
                ],
              },
              {
                title: "Specialized Consulting Includes:",
                items: [
                  "Cash Flow Architecture: Financial systems design and implementation",
                  "Hiring & Team Systems: Workflow design, onboarding, performance management",
                  "Vendor Optimization: Audit, renegotiation, performance management",
                ],
              },
              {
                title: "Hospitality Consulting Includes:",
                items: [
                  "Guest Experience: Satisfaction optimization, complaint reduction, review management",
                  "Operations Management: Front office, housekeeping, F&B coordination",
                  "Staff Training: Service standards, team building, culture development",
                ],
              },
            ].map((block, i) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-secondary border-l-2 border-primary p-8"
              >
                <h3 className="font-serif text-base font-bold text-foreground">{block.title}</h3>
                <ul className="mt-4 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-bold leading-snug"
          >
            Ready to bring structure to your operations?
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 opacity-70"
          >
            Book a consultation and we'll work out the right support for where you are now.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-wide px-8">
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
