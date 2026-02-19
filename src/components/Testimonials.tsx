import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Support Studio brought structure to our internal operations faster than any agency we've worked with. Practical, responsive, and deeply reliable.",
    name: "Sarah M.",
    role: "Operations Manager",
    company: "Fintech Startup",
    metric: "40% time saved on admin",
  },
  {
    quote: "They helped us move from reactive to structured within weeks. The difference in our day-to-day operations was immediate.",
    name: "James K.",
    role: "Founder & CEO",
    company: "E-commerce Brand",
    metric: "3x faster onboarding",
  },
  {
    quote: "A dependable operational partner for fast-moving teams. Their understanding of the South African business landscape is a real advantage.",
    name: "Thandi N.",
    role: "Programme Lead",
    company: "SME Development Organisation",
    metric: "18 SOPs documented",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
            TESTIMONIALS
          </span>
          <h2 className="mt-4 font-serif text-2xl md:text-3xl font-bold text-foreground">
            What our clients say
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-secondary border-l-2 border-primary p-8 flex flex-col"
            >
              <p className="text-sm leading-relaxed text-foreground flex-1">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-divider">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                <p className="mt-2 text-xs font-medium text-primary">{t.metric}</p>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
