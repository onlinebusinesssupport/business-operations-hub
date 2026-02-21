import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import portrait from "@/assets/portrait.png";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const serviceOptions = [
  "Social Media Management",
  "Lead Generation",
  "Business Automation",
  "Executive Virtual Support",
  "Experience",
  "Strategy & Advisory",
  "Not sure yet",
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Message received", description: "We will be in touch within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium"
          >
            CONTACT
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight"
          >
            Let's build momentum together.
          </motion.h1>
        </div>
      </section>

      {/* Founder Section + Form */}
      <section className="pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            {/* Left — Founder */}
            <div className="md:col-span-5">
              <motion.div {...fadeUp} className="space-y-8">
                {/* Founder Photo */}
                <div className="w-32 h-32 bg-secondary border border-border overflow-hidden">
                  <img
                    src={portrait}
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
                    Founder & Principal
                  </h3>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Built by operators, for operators. If you're looking for structured support that actually moves the needle, you're in the right place.
                  </p>
                </div>

                <div className="space-y-6 pt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                      RESPONSE TIME
                    </span>
                    <p className="mt-2 text-sm text-foreground">
                      Within 24 business hours
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                      LOCATION
                    </span>
                    <p className="mt-2 text-sm text-foreground">
                      South Africa — operating remotely nationwide
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                      BEST FOR
                    </span>
                    <p className="mt-2 text-sm text-foreground">
                      Founders, growing teams, and established businesses
                    </p>
                  </div>
                </div>

                {/* Optional: WhatsApp */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/27000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-primary font-medium hover:underline"
                  >
                    Chat on WhatsApp <ArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right — Form */}
            <div className="md:col-span-7">
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-secondary p-8 md:p-12 border border-border"
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
                      Thank you.
                    </h2>
                    <p className="mt-4 text-sm text-muted-foreground">
                      We have received your message and will respond within 24 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        Service Interest
                      </label>
                      <select
                        value={serviceInterest}
                        onChange={(e) => setServiceInterest(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none"
                      >
                        <option value="">Select a service...</option>
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full text-[11px] tracking-[0.15em] uppercase gap-2">
                      Send Message <ArrowRight size={14} />
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Placeholder */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              PREFER TO TALK?
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Book a call directly
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Schedule a 30-minute discovery call to discuss your needs.
            </p>
            <div className="mt-8 p-12 border border-border bg-background">
              <p className="text-xs text-muted-foreground/60">Calendly embed placeholder</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
