import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Support Studio brought structure to our internal operations faster than any agency we've worked with. Practical, responsive, and deeply reliable.",
    role: "Operations Manager",
    company: "Fintech Startup",
  },
  {
    quote:
      "They helped us move from reactive to structured within weeks. The difference in our day-to-day operations was immediate.",
    role: "Founder",
    company: "E-commerce Brand",
  },
  {
    quote:
      "A dependable operational partner for fast-moving teams. Their understanding of the South African business landscape is a real advantage.",
    role: "Programme Lead",
    company: "SME Development Organisation",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
            CLIENTS
          </span>
          <h2 className="mt-4 font-serif text-2xl md:text-3xl font-medium text-foreground">
            What our clients say
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-divider">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-secondary p-8 md:p-10 flex flex-col"
            >
              <p className="text-sm leading-relaxed text-foreground flex-1">
                "{t.quote}"
              </p>
              <footer className="mt-6 border-t border-divider pt-4">
                <p className="text-xs font-medium text-foreground">{t.role}</p>
                <p className="text-xs text-muted-foreground">{t.company}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
