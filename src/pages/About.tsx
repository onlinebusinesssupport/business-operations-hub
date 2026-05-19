import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Award, ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const values = [
  {
    title: "Structure over noise",
    description:
      "Sustainable businesses are built on repeatable systems — not burnout cycles. Every engagement creates operational infrastructure that compounds over time.",
  },
  {
    title: "Clarity in execution",
    description:
      "Our clients always know what's happening. Clear workflows, visible progress, and structured delivery are non-negotiable.",
  },
  {
    title: "Built for real markets",
    description:
      "We understand the realities of operating in emerging economies — speed, ambiguity, and constant evolution. Our systems are designed for environments without perfect playbooks.",
  },
  {
    title: "Partnership over dependency",
    description:
      "Our role is to strengthen your operational capacity. Whether we support you for months or years, the systems we build are designed to outlast us.",
  },
];

const sectors = [
  {
    name: "Hospitality & Service Operations",
    capability:
      "Service standards, guest-grade communication, and calm under pressure — the kind of operating discipline built inside hotels and high-touch service environments.",
    tags: ["SOPs", "Service design", "Crisis handling"],
  },
  {
    name: "Corporate & Executive Support",
    capability:
      "Inbox, calendar, and decision-flow management at executive tempo. Quiet, structured support for people whose time can't be wasted.",
    tags: ["Exec ops", "Stakeholder mgmt", "Confidentiality"],
  },
  {
    name: "Corporate Travel & Logistics",
    capability:
      "Coordinating people, suppliers, and timelines across borders without things slipping. Built for moving parts and tight margins.",
    tags: ["Vendor coordination", "Itineraries", "Budget control"],
  },
  {
    name: "Nonprofit & Impact Operations",
    capability:
      "Running lean teams that have to deliver public outcomes with limited resources — and prove it on paper afterwards.",
    tags: ["Grants ops", "Reporting", "Award submissions"],
    highlight: "7+ awards delivered across client and partner organisations",
  },
];


const whoWeServe = [
  {
    label: "Founders & Scaling Startups",
    desc: "Operators building real businesses who need infrastructure without the overhead of internal hires.",
  },
  {
    label: "Creators & Personal Brands",
    desc: "Modern entrepreneurs turning attention into enterprises — requiring systems for partnerships, leads, and structured growth.",
  },
  {
    label: "SMEs in Emerging Markets",
    desc: "Businesses operating across Southern Africa and other high-growth regions where adaptability and execution matter more than theory.",
  },
  {
    label: "Impact-Driven Organisations",
    desc: "Social enterprises and foundations that require commercial-grade operations to sustain meaningful work.",
  },
];

const About = () => {
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
            ABOUT
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground"
          >
            The studio behind elite remote operators.
          </motion.h1>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 space-y-4"
          >
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              THE BUSINESS SUPPORT STUDIO™ is South Africa's home for elite Virtual Assistants, Appointment Setters, and remote operators — matched, managed, and embedded into the businesses that hire us.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              We exist for founders, creators, and lean teams who need real execution capacity without the cost and complexity of building it in-house.
            </p>
            <div className="pt-4 space-y-1">
              <p className="text-base font-medium text-foreground">This is not a freelancer marketplace.</p>
              <p className="text-base font-medium text-foreground">This is managed remote talent.</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pt-2">
              We vet, train, and supervise every operator on our roster — so the work lands clean, on time, and inside the systems your business already runs on.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp} className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              OUR STORY
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Built from the inside of operations.
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              THE BUSINESS SUPPORT STUDIO™ was built by operators who spent years inside hospitality, corporate services, and executive operations — the kind of environments where things either run, or they don't.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              That experience exposed a consistent pattern: <span className="text-foreground font-medium">Most growing businesses don't fail from lack of ideas — they stall from lack of operational capacity.</span>
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Founders were moving fast. The work was piling up. Hiring full-time was too slow and too expensive. Freelancer marketplaces were noisy and unmanaged.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              The studio was built to close that gap — a curated bench of Virtual Assistants, Setters, and remote operators, vetted and supervised by our team, ready to plug into your business without the overhead of an internal hire.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Today, we support founders, creators, and lean teams across Southern Africa and globally — the operational backbone behind businesses scaling in real time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Map */}
      <section className="py-20 border-t border-divider bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              OPERATIONAL EXPERIENCE
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground">
              Environments we've operated in.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl">
              Over a decade of hands-on leadership across industries that demand precision, adaptability, and real-time execution.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-divider">
            {experienceMap.map((exp, i) => (
              <motion.div
                key={exp.org}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-secondary p-6 md:p-8 space-y-3 group hover:bg-card transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {exp.org}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{exp.role}</p>
                  </div>
                  <Briefcase size={14} className="text-muted-foreground/40 shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {exp.location}</span>
                  <span>{exp.period}</span>
                </div>
                <span className="inline-block text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-medium">
                  {exp.domain}
                </span>
                {exp.highlight && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <Award size={11} className="text-primary shrink-0" />
                    <span className="text-[10px] text-primary font-medium">{exp.highlight}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Location summary */}
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap items-center gap-6">
            {["Durban", "Cape Town", "Mpumalanga", "Johannesburg"].map((city) => (
              <div key={city} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">{city}</span>
              </div>
            ))}
          </motion.div>
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

      {/* What Makes Us Different */}
      <section className="py-20 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              WHAT MAKES US DIFFERENT
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground">
              Execution, not outsourcing.
            </h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-8 space-y-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              We are not task-takers. <span className="text-foreground font-medium">We are systems builders.</span>
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Our work blends operational design, digital execution, and structured delivery — shaped by real experience across:
            </p>
            <ul className="space-y-2 pt-2">
              {[
                "Corporate operations and executive support",
                "Hospitality leadership and service excellence",
                "Corporate travel and logistics management",
                "Nonprofit strategy and impact infrastructure",
                "Personal brands and digital businesses",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ArrowRight size={12} className="text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground pt-4">
              This cross-industry depth allows us to design systems that work in the real world — not just on paper.
            </p>
            <p className="text-sm font-medium text-foreground pt-2">
              Every engagement is built around one goal: Reduce friction. Increase clarity. Sustain growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              WHO WE SERVE
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground">
              Built for the builders.
            </h2>
          </motion.div>
          <motion.ul
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 space-y-6"
          >
            {whoWeServe.map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <h3 className="font-display text-lg font-bold text-foreground">
                  {item.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              VALUES
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground">
              The principles behind the studio.
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-divider">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-secondary p-8 md:p-10"
              >
                <h3 className="font-display text-lg font-bold text-foreground">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8 max-w-2xl text-center">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              PHILOSOPHY
            </span>
            <h2 className="mt-6 font-display text-2xl md:text-3xl font-bold text-foreground">
              Calm systems win.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              In an era that celebrates speed, we believe in structure.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Growth without systems is fragile. Systems without clarity create noise. We build operational infrastructure that supports sustainable momentum — not chaos disguised as progress.
            </p>
            <p className="mt-6 text-lg font-medium text-foreground">
              Clarity builds momentum. Systems build freedom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug">
              Ready to bring structure to your operations?
            </h2>
            <p className="mt-4 opacity-70">
              Start a conversation. No pressure. No obligation. Just clarity on whether we're the right fit.
            </p>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link to="/contact">
                <Button size="lg" className="text-sm tracking-[0.1em] uppercase gap-2 bg-background text-foreground hover:bg-background/90">
                  Start a Conversation
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="ghost" size="lg" className="text-sm tracking-[0.1em] uppercase text-background/70 border border-background/30 hover:bg-background/10 hover:text-background">
                  View Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
