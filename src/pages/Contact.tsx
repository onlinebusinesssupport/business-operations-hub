import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Clock, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const serviceOptions = [
  "Digital Presence (Social Media)",
  "Lead Engine (Lead Generation)",
  "Automation",
  "Operations (Virtual Support)",
  "Travel & Activities",
  "Grants & Awards",
  "Not sure yet",
];

const connectOptions = [
  { value: "email", label: "Email — I prefer to communicate via email" },
  { value: "call", label: "Phone / Zoom — Take me to your calendar after submitting" },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [connectPreference, setConnectPreference] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Insert contact submission
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || null,
      website: website.trim() || null,
      service_interest: serviceInterest || null,
      connect_preference: connectPreference || null,
      message: message.trim(),
    });

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }

    // 2. Auto-create client record as "New Lead"
    const { data: newClient, error: clientError } = await supabase.from("clients").insert({
      name: company.trim() || name.trim(),
      email: email.trim(),
      website: website.trim() || null,
      status: "lead",
      lifecycle_stage: "new_inquiry",
      inquiry_type: serviceInterest || null,
      source_page: "/contact",
      notes: message.trim(),
    }).select().single();

    // 3. Notify admins via edge function
    if (newClient) {
      await supabase.functions.invoke("notify-new-lead", {
        body: {
          client_id: newClient.id,
          client_name: newClient.name,
          source: "Contact Form",
        },
      });
    }

    setSubmitted(true);
    toast({ title: "Message received", description: "We will be in touch within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-foreground"
          >
            Let's Partner.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl"
          >
            Please complete the contact form below to learn more about our services. We custom quote based on support needs. On the form below, you will indicate how you would like to connect. If you'd like to connect via phone or Zoom, you will be taken to our calendar after submitting. If you have questions, please drop us a line at{" "}
            <a href="mailto:thequitehelpinghand@gmail.com" className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors">
              thequitehelpinghand@gmail.com
            </a>.
          </motion.p>
        </div>
      </section>

      {/* Form + Office Info */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left — Form */}
            <div className="lg:col-span-8">
              <motion.div
                {...fadeUp}
                className="bg-secondary p-8 md:p-12 border border-border"
              >
                {submitted ? (
                  <div className="text-center py-16">
                    <h2 className="font-serif text-3xl font-medium text-foreground">
                      Thank you.
                    </h2>
                    <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
                      We have received your message and will respond within 24 business hours. If you selected a call, check your email for a calendar link.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Name <span className="text-primary">*</span>
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
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Email <span className="text-primary">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://"
                          className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
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
                      <label className="text-sm font-medium text-foreground block mb-2">
                        How would you like to connect? <span className="text-primary">*</span>
                      </label>
                      <div className="space-y-3">
                        {connectOptions.map((opt) => (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                              connectPreference === opt.value
                                ? "border-primary bg-primary/[0.03]"
                                : "border-border bg-background hover:border-foreground/20"
                            }`}
                          >
                            <input
                              type="radio"
                              name="connectPreference"
                              value={opt.value}
                              checked={connectPreference === opt.value}
                              onChange={(e) => setConnectPreference(e.target.value)}
                              className="sr-only"
                              required
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              connectPreference === opt.value ? "border-primary" : "border-muted-foreground/40"
                            }`}>
                              {connectPreference === opt.value && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <span className="text-sm text-foreground">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Tell us about your needs <span className="text-primary">*</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        placeholder="What's weighing on you right now? What goals are you working toward?"
                        className="w-full px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-[11px] tracking-[0.15em] uppercase gap-2">
                      Submit <ArrowRight size={14} />
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Right — Office Info */}
            <div className="lg:col-span-4">
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="border border-border p-8 md:p-10 space-y-8 sticky top-32"
              >
                <h3 className="font-serif text-xl font-medium text-foreground">
                  Office Info
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="mt-0.5 text-primary shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-foreground uppercase tracking-wide block mb-1">Email</span>
                      <a href="mailto:thequitehelpinghand@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        thequitehelpinghand@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={16} className="mt-0.5 text-primary shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-foreground uppercase tracking-wide block mb-1">Phone</span>
                      <a href="tel:+27749534914" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        +27 74 953 4914
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="mt-0.5 text-primary shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-foreground uppercase tracking-wide block mb-1">Office Hours</span>
                      <p className="text-sm text-muted-foreground">Monday – Friday</p>
                      <p className="text-sm text-muted-foreground">9 am – 5 pm SAST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 text-primary shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-foreground uppercase tracking-wide block mb-1">Location</span>
                      <p className="text-sm text-muted-foreground">South Africa — operating remotely nationwide</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div>
                  <span className="text-xs font-medium text-foreground uppercase tracking-wide block mb-1">Response Time</span>
                  <p className="text-sm text-muted-foreground">Within 24 business hours</p>
                </div>

                <div>
                  <a
                    href="https://wa.me/27749534914"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-primary font-medium hover:underline"
                  >
                    Chat on WhatsApp <ArrowRight size={12} />
                  </a>
                </div>
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
