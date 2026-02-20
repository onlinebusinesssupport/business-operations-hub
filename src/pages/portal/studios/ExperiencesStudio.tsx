import { motion } from "framer-motion";
import { Sparkles, CalendarDays, CheckSquare, DollarSign, BarChart3, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const upcomingEvents = [
  { name: "Q1 Client Mixer", date: "15 Mar 2026", status: "Planning" },
  { name: "Product Launch Event", date: "28 Mar 2026", status: "Draft" },
  { name: "Team Offsite", date: "10 Apr 2026", status: "Confirmed" },
];

const planningChecklist = [
  { item: "Venue confirmed", done: false },
  { item: "Guest list finalised", done: false },
  { item: "Catering arranged", done: false },
  { item: "AV setup confirmed", done: false },
  { item: "Invitations sent", done: false },
  { item: "Budget approved", done: false },
];

const ExperiencesStudio = () => {
  return (
    <div className="space-y-10">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <Link to="/portal/active-work" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground uppercase tracking-[0.1em] mb-4 transition-colors">
          <ArrowLeft size={12} /> Studios
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
              Experiences Studio
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 bg-secondary text-muted-foreground">
            Inactive
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg">
          Event planning, budgets, checklists, and post-event performance reporting.
        </p>
      </motion.div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="events" className="text-xs tracking-wide">Events</TabsTrigger>
          <TabsTrigger value="checklist" className="text-xs tracking-wide">Planning Checklist</TabsTrigger>
          <TabsTrigger value="budget" className="text-xs tracking-wide">Budget</TabsTrigger>
          <TabsTrigger value="reporting" className="text-xs tracking-wide">Post-Event</TabsTrigger>
        </TabsList>

        {/* Upcoming Events */}
        <TabsContent value="events" className="mt-6 space-y-3">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="border border-border p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-foreground">{event.name}</p>
                  <p className="text-[11px] text-muted-foreground">{event.date}</p>
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                event.status === "Confirmed" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {event.status}
              </span>
            </motion.div>
          ))}
        </TabsContent>

        {/* Planning Checklist */}
        <TabsContent value="checklist" className="mt-6">
          <div className="border border-border divide-y divide-border">
            {planningChecklist.map((item) => (
              <div key={item.item} className="p-4 flex items-center gap-3">
                <CheckSquare
                  size={16}
                  className={item.done ? "text-primary" : "text-muted-foreground/40"}
                  strokeWidth={1.5}
                />
                <p className={`text-sm ${item.done ? "text-foreground line-through" : "text-foreground"}`}>
                  {item.item}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Budget */}
        <TabsContent value="budget" className="mt-6">
          <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
            <DollarSign size={32} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Budget tracker coming soon.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Track event budgets, expenses, and allocations.</p>
          </div>
        </TabsContent>

        {/* Post-Event Reporting */}
        <TabsContent value="reporting" className="mt-6">
          <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
            <BarChart3 size={32} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Post-event reporting section.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Event performance data and attendee feedback will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExperiencesStudio;
