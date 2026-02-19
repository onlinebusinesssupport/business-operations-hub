import { motion } from "framer-motion";
import portraitImg from "@/assets/portrait.png";
import { Mail, Calendar, Building } from "lucide-react";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const Account = () => {
  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Settings</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Your profile and engagement details.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.06 }} className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5">
            Client Profile
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building size={16} className="text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="text-sm text-foreground">Your Company Name</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">client@company.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-muted-foreground">Engagement Started</p>
                <p className="text-sm text-foreground">January 2026</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }} className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5">
            Your Manager
          </p>
          <div className="flex items-center gap-4">
            <img src={portraitImg} alt="Manager" className="w-14 h-14 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium text-foreground">Nkululeko</p>
              <p className="text-xs text-muted-foreground">Operations Manager</p>
              <p className="text-xs text-muted-foreground mt-1">
                Dedicated to keeping your operations structured and running smoothly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }} className="bg-card border border-divider rounded-xl p-6">
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5">
          Engagement Summary
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Active Projects", value: "3" },
            { label: "Completed", value: "4" },
            { label: "Requests Handled", value: "12" },
            { label: "Documents Shared", value: "18" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
