import { motion } from "framer-motion";

const logos = [
  { name: "Yoco" },
  { name: "SweepSouth" },
  { name: "Takealot" },
  { name: "Shoprite" },
  { name: "Discovery" },
];

const ClientLogos = () => {
  return (
    <section className="py-16 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium text-center mb-10">
            TRUSTED BY FOUNDERS AT YOCO, SWEEPSOUTH, TAKEALOT-SCALE BUSINESSES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo, i) => (
              <motion.span
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-sm font-sans font-semibold tracking-wide text-muted-foreground/40 uppercase select-none"
              >
                {logo.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientLogos;
