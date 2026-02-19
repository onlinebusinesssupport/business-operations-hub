import { motion } from "framer-motion";
import { Clock, DollarSign, Users } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: "Drowning in operational details",
    stat: "40% of founder time",
    description: "Spent on tasks that don't generate revenue — admin, scheduling, follow-ups, and internal coordination.",
  },
  {
    icon: DollarSign,
    title: "Cash flow chaos",
    stat: "Unpredictable finances",
    description: "Invoices go out late, expenses aren't tracked, and financial visibility is always a month behind.",
  },
  {
    icon: Users,
    title: "Team lacks accountability",
    stat: "No clear systems",
    description: "Without documented processes and tracking, work falls through the cracks and nothing scales.",
  },
];

const ProblemStatement = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-serif text-2xl md:text-3xl font-bold text-foreground"
        >
          Does this sound familiar?
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-l-2 border-primary pl-6"
            >
              <point.icon size={24} className="text-primary mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-bold text-foreground">
                {point.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">{point.stat}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;
