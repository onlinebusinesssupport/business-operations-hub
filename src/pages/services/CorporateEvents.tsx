import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ArrowRight, Users, MapPin, Trophy, Calendar, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const whatWeDo = [
  { icon: Calendar, text: "Strategic retreat planning & facilitation" },
  { icon: Users, text: "Team building experience design" },
  { icon: Trophy, text: "Incentive trip coordination" },
  { icon: Sparkles, text: "Management conference logistics" },
  { icon: MapPin, text: "Venue sourcing & full event production" },
];

const outcomes = [
  "Aligned leadership teams",
  "Strengthened company culture",
  "Higher employee engagement",
  "Seamless event execution",
];

const idealFor = [
  "Leadership teams planning strategy offsites",
  "HR directors building culture programs",
  "Founders rewarding high-performing teams",
  "Companies hosting management conferences",
];

const CorporateEvents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut }} className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Users size={22} className="text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">EXPERIENCE DESIGN</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05, ease: easeOut }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight">
            Corporate Events & Retreats
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOut }} className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
            Experiences that build culture, align teams, and create momentum.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: easeOut }} className="mt-8">
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-[0.1em] uppercase gap-2">
                Start a Conversation <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="w-full">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: easeOut }} className="aspect-[16/9] overflow-hidden rounded-xl shadow-2xl">
            <img src="/images/service-travel.png" alt="Corporate team retreat with Cape Town mountains in background" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">Who This Is For</motion.h2>
          <ul className="mt-6 space-y-3">
            {idealFor.map((item, i) => (
              <motion.li key={item} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />{item}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">What We Do</motion.h2>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            End-to-end event planning and execution. From concept to cleanup, we handle every detail so you can focus on your team.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatWeDo.map((item, i) => (
              <motion.div 
                key={item.text} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="p-2 rounded-md bg-primary/10">
                  <item.icon size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-sm text-foreground/80">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-xl font-bold text-foreground uppercase tracking-tight">Measurable Outcomes</motion.h2>
          <ul className="mt-6 space-y-3">
            {outcomes.map((d, i) => (
              <motion.li key={d} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />{d}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">Pricing</motion.h2>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-8 p-8 bg-card rounded-xl border border-border/50 shadow-lg">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Every event is unique. We scope and quote based on group size, destination, and complexity.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Projects from</p>
                <p className="mt-1 text-2xl font-bold text-foreground">R15,000</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Full retreats from</p>
                <p className="mt-1 text-2xl font-bold text-foreground">R45,000</p>
              </div>
            </div>
          </motion.div>
          <div className="mt-8">
            <Link to="/contact">
              <Button size="lg" className="text-[11px] tracking-[0.15em] uppercase gap-2">
                Get a Custom Quote <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">Plan Your Next Event</motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 text-sm text-primary-foreground/70">From strategy retreats to incentive trips — we handle every detail so you can focus on your team.</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-8">
            <Link to="/contact"><Button size="lg" variant="secondary" className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2">Start a Conversation <ArrowRight size={14} /></Button></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            Clarity builds momentum. Systems build freedom. THE BUSINESS SUPPORT STUDIO™ builds both.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorporateEvents;
