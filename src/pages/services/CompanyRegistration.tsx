import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ArrowRight, FileText, Building2, CreditCard, Shield, Users, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const whatWeDo = [
  { icon: Building2, text: "CIPC company registration (Pty Ltd, NPC)" },
  { icon: FileText, text: "Tax registration with SARS" },
  { icon: Shield, text: "B-BBEE certificate & compliance setup" },
  { icon: CreditCard, text: "Business bank account facilitation" },
  { icon: Users, text: "Shareholder & partnership agreements" },
];

const outcomes = [
  "Fully registered and compliant entity",
  "Ready to invoice, hire, and operate",
  "Clear corporate structure from day one",
  "Positioned for funding and partnerships",
];

const idealFor = [
  "First-time founders registering a new business",
  "Existing businesses formalizing structure",
  "Foreign companies entering South Africa",
  "Entrepreneurs preparing for investment",
];

const registrationPackageIncludes = [
  "Reserved company name",
  "Company registration certificate (COR14.3)",
  "Income tax registration number",
  "CIPC filing fees included",
  "B-BBEE affidavit",
  "Share certificates for all shareholders",
  "Delivered in 5-7 business days",
];

const essentialsFeatures = [
  "Compliance monitoring across departments",
  "Filing reminders & notifications",
  "Pay-per-filing for annual returns",
  "Basic invoicing tools",
];

const growthFeatures = [
  "Everything in Essentials, plus:",
  "Monthly bookkeeping support",
  "SARS tax return submissions",
  "All standard compliance filings",
  "Dedicated account manager",
];

const addOns = [
  { name: "Outstanding Annual Returns", desc: "Clear your CIPC backlog", price: "From R200", unit: "per return" },
  { name: "Historical Tax Returns", desc: "File overdue SARS returns", price: "From R300", unit: "per return" },
  { name: "VAT Registration", desc: "Register your business for VAT", price: "R1,800", unit: "once-off" },
  { name: "VAT Returns", desc: "Monthly VAT filing handled", price: "From R1,000", unit: "per month" },
  { name: "PAYE Registration", desc: "Register as an employer", price: "R950", unit: "once-off" },
  { name: "UIF Registration", desc: "Unemployment insurance setup", price: "R1,500", unit: "once-off" },
];

const faqs = [
  {
    q: "How long does company registration take?",
    a: "Standard registration is completed within 5-7 business days once all documents are submitted. We handle the entire process with CIPC and SARS on your behalf.",
  },
  {
    q: "Do I need to be in South Africa to register?",
    a: "No. We work with founders globally. All documentation can be handled digitally, and we guide you through the process remotely.",
  },
  {
    q: "What's included in ongoing support plans?",
    a: "Our plans ensure you stay compliant with CIPC annual returns, SARS filings, and regulatory updates. Higher tiers include bookkeeping and tax submissions.",
  },
  {
    q: "Can I start with registration and add support later?",
    a: "Absolutely. Many clients begin with the registration package and add ongoing support as their business grows and compliance needs increase.",
  },
  {
    q: "Do you handle amendments and changes?",
    a: "Yes. Director changes, address updates, share transfers, and other CIPC amendments are available as standalone services or included in higher plans.",
  },
];

const CompanyRegistration = () => {
  const [tab, setTab] = useState<"new" | "existing">("new");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut }} className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <FileText size={22} className="text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">BUSINESS FORMATION</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05, ease: easeOut }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight">
            Company Registration & Setup
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOut }} className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
            Straightforward pricing for small businesses. Start compliant, stay compliant, and focus on growth.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: easeOut }} className="mt-8">
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-[0.1em] uppercase gap-2">
                Start a Conversation <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tab Selector */}
      <section className="pb-8">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex justify-center">
            <div className="inline-flex bg-secondary rounded-lg p-1 gap-1">
              <button
                onClick={() => setTab("new")}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${tab === "new" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Starting a new company
              </button>
              <button
                onClick={() => setTab("existing")}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${tab === "existing" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                I have an existing company
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Package (New Company) */}
      {tab === "new" && (
        <section className="py-12">
          <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="shadow-xl border-primary/20 hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Complete Registration Package</CardDescription>
                  <CardTitle className="text-2xl font-display mt-2">New Company Setup</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    Everything you need to launch an official South African company — handled end-to-end.
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-foreground">R950</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Once-off fee • Completed in 1 week</p>
                  
                  <Link to="/contact">
                    <Button size="lg" className="mt-6 w-full sm:w-auto text-sm tracking-[0.1em] uppercase gap-2">
                      Register Your Company <ArrowRight size={16} />
                    </Button>
                  </Link>

                  <div className="mt-10 text-left border-t border-border/50 pt-8">
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">What's included</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {registrationPackageIncludes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                          <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Ongoing Support Plans */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              {tab === "new" ? "Add Ongoing Support" : "Choose Your Support Plan"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
              Our plans scale with your business, keeping you compliant and focused on what matters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Essentials Plan */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Essentials</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-foreground">R0</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <CardDescription className="mt-2">For businesses not yet generating revenue.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {essentialsFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="mt-0.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full mt-6 text-xs uppercase tracking-[0.1em]">
                      Get Started Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Growth Plan */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-primary/30 bg-card relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg font-medium">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-display">Growth</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-foreground">R995</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <CardDescription className="mt-2">For businesses generating revenue and scaling.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {growthFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="mt-0.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button className="w-full mt-6 text-xs uppercase tracking-[0.1em]">
                      Choose Growth
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">Compliance Add-Ons</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
              Expand your coverage with services tailored to your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon, i) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground text-sm">{addon.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{addon.desc}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">{addon.price}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">({addon.unit})</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">Who This Is For</motion.h2>
          <ul className="mt-6 space-y-3">
            {idealFor.map((item, i) => (
              <motion.li key={item} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />{item}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">What We Handle</motion.h2>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            End-to-end company formation services. We navigate CIPC, SARS, and compliance requirements so you're ready to operate from day one.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatWeDo.map((item, i) => (
              <motion.div 
                key={item.text} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="p-2 rounded-md bg-primary/10">
                  <item.icon size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-sm text-foreground/80">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-xl font-bold text-foreground uppercase tracking-tight">Measurable Outcomes</motion.h2>
          <ul className="mt-6 space-y-3">
            {outcomes.map((d, i) => (
              <motion.li key={d} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />{d}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight text-center">
            Frequently Asked Questions
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-10">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-lg px-5 data-[state=open]:border-primary/30 transition-colors">
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">Ready to Register?</motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 text-sm text-primary-foreground/70">
            From CIPC to SARS to B-BBEE — we build your corporate foundation so you can focus on what matters.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-8">
            <Link to="/contact"><Button size="lg" variant="secondary" className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2">Start a Conversation <ArrowRight size={14} /></Button></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            Clarity builds momentum. Systems build freedom. THE BUSINESS SUPPORT STUDIO™ builds both.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyRegistration;
