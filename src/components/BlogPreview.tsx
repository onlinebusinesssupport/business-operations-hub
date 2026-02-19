import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const articles = [
  {
    category: "Operations",
    title: "Why Your Startup Needs Operations Leadership",
    excerpt: "Most founders wait too long to invest in operational infrastructure. Here's why starting early gives you a compounding advantage.",
    readTime: "5 min read",
  },
  {
    category: "Finance",
    title: "How to Optimize Cash Flow Without a CFO",
    excerpt: "Practical systems and frameworks for managing cash flow when you can't yet justify a full-time financial leader.",
    readTime: "7 min read",
  },
  {
    category: "Growth",
    title: "From Chaos to Structure: A Founder's Guide",
    excerpt: "The transition from reactive to proactive operations is the single biggest unlock for scaling founders.",
    readTime: "6 min read",
  },
];

const BlogPreview = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              INSIGHTS
            </span>
            <h2 className="mt-4 font-serif text-2xl md:text-3xl font-bold text-foreground">
              Operational insights for founders
            </h2>
          </div>
          <Link to="/insights" className="hidden md:block">
            <Button variant="outline" className="text-sm tracking-wide">
              Read more articles
            </Button>
          </Link>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background border-l-2 border-primary p-8 flex flex-col"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium">
                {article.category}
              </span>
              <h3 className="mt-3 font-serif text-lg font-bold text-foreground leading-snug">
                {article.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                {article.excerpt}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">{article.readTime}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link to="/insights">
            <Button variant="outline" className="text-sm tracking-wide">
              Read more articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
