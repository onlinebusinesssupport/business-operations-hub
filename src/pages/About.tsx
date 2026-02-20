import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import portrait from "@/assets/portrait.png";

const values = [
  {
    title: "Structure over hustle",
    description:
      "We believe that sustainable businesses are built on repeatable systems, not heroic individual effort. Every engagement is designed to create lasting operational infrastructure.",
  },
  {
    title: "Clarity in delivery",
    description:
      "We are direct, transparent, and accountable. Our clients always know what has been done, what is in progress, and what is planned.",
  },
  {
    title: "Grounded in South Africa",
    description:
      "We understand the complexities of operating in the South African business environment — from regulatory requirements to the realities of building in emerging markets.",
  },
  {
    title: "Partnership, not dependency",
    description:
      "Our goal is to build operational capacity within your business, not to create reliance on external support. We build systems that outlast our engagement.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.span
            {...fadeUp}
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium"
          >
            ABOUT
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-foreground"
          >
            Built for founders who need execution, not advice.
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <motion.div {...fadeUp} className="space-y-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                  OUR STORY
                </span>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="mt-6"
                >
                  <img
                    src={portrait}
                    alt="Founder portrait"
                    className="w-full max-w-[320px] aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </motion.div>
              </motion.div>
            </div>
            <div className="md:col-span-7">
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  Support Studio was founded with a clear premise: South African founders
                  and growing businesses deserve operational support that is structured,
                  reliable, and built for the realities of this market.
                </p>
                <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
                  We are not a virtual assistant service. We are operators, systems builders,
                  and execution partners who bring hands-on experience in business management,
                  process design, and operational infrastructure.
                </p>
                <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
                  Our team has worked across fintech, e-commerce, professional services, social
                  impact, and township enterprise — giving us a broad and practical understanding
                  of what it takes to build sustainable operations in Southern Africa.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              VALUES
            </span>
            <h2 className="mt-4 font-serif text-2xl md:text-3xl font-medium text-foreground">
              What we stand for
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-divider">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-secondary p-8 md:p-10"
              >
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-medium text-foreground"
          >
            Let us talk about what you are building.
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            We work with founders and teams who are ready for structure. If that is you,
            we would like to hear from you.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex gap-4 justify-center"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-wide">
                Work With Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
