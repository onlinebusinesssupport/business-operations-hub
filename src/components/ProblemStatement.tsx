import { motion } from "framer-motion";

const problems = [
  "Leads fall through the cracks",
  "Inbox overload",
  "Manual workflows",
  "Disconnected tools",
  "No visibility into performance",
];

const ProblemStatement = () => {
  return (
    <section className="py-28 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-primary-foreground/50 font-medium">
            THE REALITY
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[1.1]">
            Growth without structure creates friction.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border border-primary-foreground/15 p-6"
            >
              <span className="text-[11px] tracking-[0.2em] text-primary-foreground/40 font-medium">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-sm font-medium text-primary-foreground/90 leading-relaxed">
                {problem}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;
