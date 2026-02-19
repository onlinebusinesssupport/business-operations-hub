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
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-snug">
            Not virtual assistants. Operators, systems builders, and execution partners.
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            MOVE brings hands-on experience across operations, executive support,
            and business management. We give founders clarity, consistency, and
            dependable execution — so you can focus on building while the
            operational details are handled properly.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Credibility;
