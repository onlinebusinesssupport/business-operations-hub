import { motion } from "framer-motion";
import { Settings, Zap, Target, Globe, Sparkles, Compass } from "lucide-react";

const modules = [
  { icon: Settings, name: "OPERATIONS", description: "The backbone of your business." },
  { icon: Zap, name: "AUTOMATION", description: "Systems that run while you sleep." },
  { icon: Target, name: "LEAD ENGINE", description: "Predictable demand, engineered." },
  { icon: Globe, name: "DIGITAL PRESENCE", description: "Reputation, managed with precision." },
  { icon: Sparkles, name: "TRAVEL & ACTIVITIES", description: "Curated travel, events, and team experiences." },
  { icon: Compass, name: "GRANTS & AWARDS", description: "Grant writing, award submissions, and funding." },
];

const SolutionOverview = () => {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
            WHAT WE OFFER
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground">
            Support, organised into services.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
            Each service focuses on a core business function — designed to plug into your workflow without friction.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group border border-border p-8 hover:bg-primary hover:border-primary transition-colors duration-300 cursor-pointer"
            >
              <mod.icon
                size={24}
                className="text-primary group-hover:text-primary-foreground transition-colors duration-300"
                strokeWidth={1.5}
              />
              <h3 className="mt-6 font-display text-sm font-bold tracking-[0.15em] text-foreground group-hover:text-primary-foreground transition-colors duration-300">
                {mod.name}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground group-hover:text-primary-foreground/70 transition-colors duration-300 leading-relaxed">
                {mod.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionOverview;
