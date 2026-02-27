import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, FileText, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const articles = [
  {
    category: "Operations",
    title: "Why every founder needs an operations partner before they need a second hire",
    excerpt:
      "Most founders delay operational support until the business is in crisis. Here is why building structure early creates compounding returns.",
    date: "February 2026",
    type: "article" as const,
  },
  {
    category: "Systems",
    title: "The five systems every South African SME should have in place by year two",
    excerpt:
      "From CRM to SOPs — the foundational systems that separate businesses that scale from businesses that stall.",
    date: "January 2026",
    type: "article" as const,
  },
  {
    category: "Strategy",
    title: "Operational infrastructure: what it means and why it matters",
    excerpt:
      "Operational infrastructure is not about tools. It is about building repeatable processes that allow your team to execute without bottlenecks.",
    date: "January 2026",
    type: "article" as const,
  },
  {
    category: "South Africa",
    title: "Building a business support practice in the South African context",
    excerpt:
      "The realities of operating in South Africa require a different approach to business support. Here is what we have learned.",
    date: "December 2025",
    type: "article" as const,
  },
  {
    category: "Productivity",
    title: "From reactive to structured: a founder's guide to operational clarity",
    excerpt:
      "If your day is dictated by inbox fires and urgent requests, you do not have an operations problem — you have a systems problem.",
    date: "December 2025",
    type: "article" as const,
  },
  {
    category: "Growth",
    title: "When to outsource operations and when to hire in-house",
    excerpt:
      "The decision between external support and internal hires is not about cost. It is about stage, speed, and strategic priorities.",
    date: "November 2025",
    type: "article" as const,
  },
];

const mediaTypes = [
  { icon: FileText, label: "Blog", description: "Operational insights and practical guides for founders" },
  { icon: Mic, label: "Podcast", description: "Conversations with operators building in South Africa — coming soon" },
  { icon: Play, label: "Video", description: "Walkthroughs, tutorials, and behind-the-scenes — coming soon" },
];

const Media = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium"
          >
            MEDIA
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: easeOut }}
            className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight"
          >
            Insights, stories & resources.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto"
          >
            Practical thinking from the team at The Business Support Studio — grounded in real experience
            supporting South African businesses.
          </motion.p>
        </div>
      </section>

      {/* Media Types */}
      <section className="py-16 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaTypes.map((type, i) => (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-secondary border border-border p-8 text-center"
              >
                <type.icon size={24} className="mx-auto text-primary" />
                <h3 className="mt-4 font-display text-sm font-bold text-foreground uppercase tracking-[0.15em]">
                  {type.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {type.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              BLOG
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Latest articles
            </h2>
          </motion.div>

          <div className="mt-14 space-y-0 divide-y divide-divider">
            {articles.map((article, i) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 cursor-pointer group"
              >
                <div className="md:col-span-3 flex items-start gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                    {article.category}
                  </span>
                </div>
                <div className="md:col-span-7">
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground group-hover:text-muted-foreground transition-colors uppercase tracking-tight">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <span className="text-xs text-muted-foreground">
                    {article.date}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              STAY INFORMED
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Operational insights, delivered monthly.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              No spam. Just practical perspectives on building structured, scalable businesses in South Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2
            {...fadeUp}
            className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight"
          >
            Ready to build with structure?
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-sm text-primary-foreground/70"
          >
            Apply today and join the businesses already building with structure.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/apply">
              <Button size="lg" variant="secondary" className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2">
                Apply for Access <ArrowRight size={14} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-[11px] tracking-[0.15em] uppercase px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Media;
