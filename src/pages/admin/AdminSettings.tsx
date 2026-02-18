import { motion } from "framer-motion";
import { User, Bell, Shield, Globe } from "lucide-react";
import portraitImg from "@/assets/portrait.png";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Admin configuration and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }} className="bg-background border border-divider rounded-md p-6">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
          <User size={14} strokeWidth={1.5} /> Profile
        </h3>
        <div className="flex items-center gap-4">
          <img src={portraitImg} alt="Nkululeko" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-foreground">Nkululeko</p>
            <p className="text-xs text-muted-foreground">admin@businesssupport.com</p>
            <p className="text-xs text-muted-foreground">Operations Manager</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="bg-background border border-divider rounded-md p-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
            <Bell size={14} strokeWidth={1.5} /> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { label: "New client requests", enabled: true },
              { label: "Work item deadlines", enabled: true },
              { label: "Weekly summary", enabled: false },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{n.label}</span>
                <div className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${n.enabled ? "bg-foreground" : "bg-secondary"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${n.enabled ? "translate-x-4 bg-background" : "translate-x-0.5 bg-muted-foreground"}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }} className="bg-background border border-divider rounded-md p-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
            <Shield size={14} strokeWidth={1.5} /> Security
          </h3>
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
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.2 }} className="bg-background border border-divider rounded-md p-6">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
          <Globe size={14} strokeWidth={1.5} /> Platform
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-foreground">Platform Name</p>
            <p className="text-xs text-muted-foreground">BUSINESS SUPPORT</p>
          </div>
          <div>
            <p className="text-sm text-foreground">Version</p>
            <p className="text-xs text-muted-foreground">1.0.0</p>
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
