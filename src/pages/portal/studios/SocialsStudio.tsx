import { motion } from "framer-motion";
import { Globe, Star, TrendingUp, Calendar, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const engagementMetrics = [
  { label: "Followers", value: "—" },
  { label: "Engagement Rate", value: "—" },
  { label: "Impressions", value: "—" },
  { label: "Profile Views", value: "—" },
];

const SocialsStudio = () => {
  return (
    <div className="space-y-10">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <Link to="/portal/active-work" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground uppercase tracking-[0.1em] mb-4 transition-colors">
          <ArrowLeft size={12} /> Studios
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
              Socials Studio
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 bg-secondary text-muted-foreground">
            Inactive
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg">
          Reviews, engagement tracking, content calendar, and brand voice documentation.
        </p>
      </motion.div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="reviews" className="text-xs tracking-wide">Reviews</TabsTrigger>
          <TabsTrigger value="engagement" className="text-xs tracking-wide">Engagement</TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs tracking-wide">Content Calendar</TabsTrigger>
          <TabsTrigger value="brand" className="text-xs tracking-wide">Brand Voice</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6">
          <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
            <Star size={32} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Reviews dashboard coming soon.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Aggregate reviews from Google, Trustpilot, and other platforms.</p>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {engagementMetrics.map((m) => (
              <div key={m.label} className="border border-border p-5">
                <TrendingUp size={14} className="text-muted-foreground mb-3" strokeWidth={1.5} />
                <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
            <Calendar size={32} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Content calendar coming soon.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Schedule and manage content across all channels.</p>
          </div>
        </TabsContent>

        <TabsContent value="brand" className="mt-6">
          <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
            <FileText size={32} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Brand voice documentation area.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Tone, messaging guidelines, and brand assets will live here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialsStudio;
