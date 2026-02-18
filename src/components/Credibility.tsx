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
            Hands-on experience, applied directly to your business.
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            I bring practical experience across operations, executive support, and
            business management. This platform is designed to give you clarity,
            consistency, and dependable execution — so you can focus on running
            your business while the operational details are handled properly.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Credibility;
