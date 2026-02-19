import { motion } from "framer-motion";
import { Lightbulb, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import portraitImg from "@/assets/portrait.png";

const pillars = [
  {
    icon: Lightbulb,
    title: "Strategic Thinking",
    description: "We approach every engagement with a systems mindset — building infrastructure, not just completing tasks.",
  },
  {
    icon: BarChart3,
    title: "Proven Results",
    description: "From hospitality operations to startup scaling, our track record spans industries and continents.",
  },
  {
    icon: Shield,
    title: "Affordable Leadership",
    description: "Access executive-level operational support at a fraction of the cost of a full-time hire.",
  },
];

const SolutionOverview = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Photo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={portraitImg}
              alt="Nkululeko — Founder of Support Studio"
              className="w-full max-w-md object-cover"
            />
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              YOUR OPERATIONAL PARTNER
            </span>
            <h2 className="mt-4 font-serif text-2xl md:text-3xl font-bold text-foreground leading-snug">
              Meet your operational partner
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              With 10+ years of operations leadership — from four-star graded hotels to KPMG audit environments — Support Studio brings executive-level structure to founders and growing teams.
            </p>

            <div className="mt-10 space-y-6">
              {pillars.map((pillar, i) => (
                <div key={pillar.title} className="flex gap-4 items-start">
                  <div className="mt-1 p-2 bg-primary/10 shrink-0">
                    <pillar.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/about">
                <Button variant="outline" className="text-sm tracking-wide">
                  Learn more about my background
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionOverview;
