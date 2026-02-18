import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Understand your needs",
    description: "A focused conversation to understand your business, challenges, and what support looks like for you.",
  },
  {
    number: "02",
    title: "Set up your workspace",
    description: "Your dedicated client portal is configured with the tools and structure tailored to your operations.",
  },
  {
    number: "03",
    title: "Deliver ongoing support",
    description: "Consistent, reliable execution across your operational priorities — week after week.",
  },
  {
    number: "04",
    title: "Maintain structure as you grow",
    description: "As your business evolves, the support adapts. Systems and processes scale alongside you.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-lg">
            A straightforward process designed to get you structured support quickly.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                {step.number}
              </span>
              <h3 className="font-serif text-lg font-medium text-foreground mt-3">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
