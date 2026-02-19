import { motion } from "framer-motion";

const Credibility = () => {
  return (
    <section className="py-24 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
            WHO WE ARE
          </span>
          <h2 className="mt-6 font-serif text-2xl md:text-3xl font-medium text-foreground leading-snug">
            Operators, systems builders, and execution partners — not virtual assistants.
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            Support Studio brings hands-on experience across operations, executive support,
            and business management. We deliver clarity, consistency, and dependable
            execution — so founders can focus on growth while operational infrastructure
            is handled properly.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Credibility;
