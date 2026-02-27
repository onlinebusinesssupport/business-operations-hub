import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const articles = [
  {
    category: "Operations",
    title: "Why every founder needs an operations partner before they need a second hire",
    excerpt:
      "Most founders delay operational support until the business is in crisis. Here is why building structure early creates compounding returns.",
    date: "February 2026",
  },
  {
    category: "Systems",
    title: "The five systems every South African SME should have in place by year two",
    excerpt:
      "From CRM to SOPs — the foundational systems that separate businesses that scale from businesses that stall.",
    date: "January 2026",
  },
  {
    category: "Strategy",
    title: "Operational infrastructure: what it means and why it matters",
    excerpt:
      "Operational infrastructure is not about tools. It is about building repeatable processes that allow your team to execute without bottlenecks.",
    date: "January 2026",
  },
  {
    category: "South Africa",
    title: "Building a business support practice in the South African context",
    excerpt:
      "The realities of operating in South Africa require a different approach to business support. Here is what we have learned.",
    date: "December 2025",
  },
  {
    category: "Productivity",
    title: "From reactive to structured: a founder's guide to operational clarity",
    excerpt:
      "If your day is dictated by inbox fires and urgent requests, you do not have an operations problem — you have a systems problem.",
    date: "December 2025",
  },
  {
    category: "Growth",
    title: "When to outsource operations and when to hire in-house",
    excerpt:
      "The decision between external support and internal hires is not about cost. It is about stage, speed, and strategic priorities.",
    date: "November 2025",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Insights = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.span
            {...fadeUp}
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium"
          >
            INSIGHTS
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-foreground"
          >
            Perspectives on operations, systems, and growth.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            Practical thinking from the team at The Business Support Studio — grounded in real experience
            supporting South African businesses.
          </motion.p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="space-y-0 divide-y divide-divider">
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
                  <h3 className="font-serif text-lg md:text-xl font-medium text-foreground group-hover:text-muted-foreground transition-colors">
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
            <h2 className="mt-4 font-serif text-2xl md:text-3xl font-medium text-foreground">
              Operational insights, delivered monthly.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              No spam. Just practical perspectives on building structured, scalable businesses in South Africa.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Insights;
