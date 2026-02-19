import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — form submission logic can be wired to an edge function
    setSubmitted(true);
    toast({ title: "Message received", description: "We will be in touch within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            {/* Left — Info */}
            <div className="md:col-span-5">
              <motion.span
                {...fadeUp}
                className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium"
              >
                CONTACT
              </motion.span>
              <motion.h1
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 font-serif text-3xl md:text-4xl font-medium leading-tight text-foreground"
              >
                Let us start a conversation.
              </motion.h1>
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-base text-muted-foreground leading-relaxed"
              >
                Whether you are looking for ongoing operational support, a one-off systems
                project, or simply want to explore what structured support could look like
                for your business — we are here.
              </motion.p>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 space-y-6"
              >
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
              </motion.div>
            </div>

            {/* Right — Form */}
            <div className="md:col-span-7">
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-secondary p-8 md:p-12 border border-divider rounded-sm"
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <h2 className="font-serif text-2xl font-medium text-foreground">
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
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 text-sm bg-background border border-divider rounded-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 text-sm bg-background border border-divider rounded-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        Company / Organisation
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-background border border-divider rounded-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block mb-2">
                        How can we help?
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-3 text-sm bg-background border border-divider rounded-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full text-sm tracking-wide">
                      Send Message
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
