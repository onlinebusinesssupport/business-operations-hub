import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight, MessageSquare, Wrench } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const updates = [
  {
    date: "14 Feb 2026",
    items: [
      { icon: CheckCircle2, type: "Completed", text: "Weekly report delivered covering operations progress and vendor updates." },
      { icon: ArrowUpRight, type: "Decision", text: "Agreed to shift vendor onboarding timeline by one week to align with contract review." },
    ],
  },
  {
    date: "12 Feb 2026",
    items: [
      { icon: Wrench, type: "Improvement", text: "Refined task tracking structure to improve visibility on deliverable timelines." },
      { icon: MessageSquare, type: "Note", text: "Reviewed draft SOPs with your team lead — minor adjustments noted." },
    ],
  },
  {
    date: "10 Feb 2026",
    items: [
      { icon: CheckCircle2, type: "Completed", text: "SOP v2 documentation finalised and uploaded to shared documents." },
      { icon: CheckCircle2, type: "Completed", text: "Contact list updated with new vendor details." },
    ],
  },
  {
    date: "7 Feb 2026",
    items: [
      { icon: ArrowUpRight, type: "Decision", text: "Confirmed recurring report schedule — weekly on Fridays, monthly on the 1st." },
      { icon: Wrench, type: "Improvement", text: "Set up automated reminders for upcoming deliverable deadlines." },
    ],
  },
];

const Updates = () => {
  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Updates</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          A timeline of progress, decisions, and improvements. Full transparency
          on what's happening.
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-divider hidden md:block" />

        <div className="space-y-8">
          {updates.map((group, gi) => (
            <motion.div
              key={group.date}
              {...fade}
              transition={{ ...fade.transition, delay: gi * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4 md:pl-6">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-foreground bg-background hidden md:block absolute left-0" />
                <span className="text-xs font-sans uppercase tracking-widest text-muted-foreground">
                  {group.date}
                </span>
              </div>
              <div className="md:pl-6 space-y-2">
                {group.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="bg-background border border-divider rounded-md p-4 flex items-start gap-3"
                  >
                    <item.icon
                      size={16}
                      className="text-muted-foreground mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <div>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                      <p className="text-sm text-foreground mt-0.5">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Updates;
