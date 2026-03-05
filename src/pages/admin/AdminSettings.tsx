import { motion } from "framer-motion";
import { User, Bell, Shield, Globe } from "lucide-react";
import portraitImg from "@/assets/portrait.png";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Admin configuration and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }} className="bg-card border border-divider rounded-xl p-6">
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
          <User size={14} strokeWidth={1.5} /> Profile
        </p>
        <div className="flex items-center gap-4">
          <img src={portraitImg} alt="Manager" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-foreground">Dylan</p>
            <p className="text-xs text-muted-foreground">thequitehelpinghand@gmail.com</p>
            <p className="text-xs text-muted-foreground">Operations Manager</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }} className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
            <Bell size={14} strokeWidth={1.5} /> Notifications
          </p>
          <div className="space-y-4">
            {[
              { label: "New client requests", enabled: true },
              { label: "Work item deadlines", enabled: true },
              { label: "Weekly summary", enabled: false },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{n.label}</span>
                <div className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${n.enabled ? "bg-foreground" : "bg-accent"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${n.enabled ? "translate-x-4 bg-background" : "translate-x-0.5 bg-muted-foreground"}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }} className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
            <Shield size={14} strokeWidth={1.5} /> Security
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
              <button className="text-xs text-foreground underline mt-1">Change password</button>
            </div>
            <div>
              <p className="text-sm text-foreground">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Not enabled</p>
              <button className="text-xs text-foreground underline mt-1">Enable 2FA</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Platform */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }} className="bg-card border border-divider rounded-xl p-6">
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
          <Globe size={14} strokeWidth={1.5} /> Platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-foreground">Platform</p>
            <p className="text-xs text-muted-foreground">The Business Support Studio</p>
          </div>
          <div>
            <p className="text-sm text-foreground">Version</p>
            <p className="text-xs text-muted-foreground">2.0.0</p>
          </div>
          <div>
            <p className="text-sm text-foreground">Environment</p>
            <p className="text-xs text-muted-foreground">Production</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
