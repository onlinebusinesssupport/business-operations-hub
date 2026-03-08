import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquarePlus,
  FileText,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Layers,
} from "lucide-react";
import portraitImg from "@/assets/portrait.png";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "My Studios", href: "/portal/studios", icon: Layers },
  { label: "Active Work", href: "/portal/active-work", icon: Briefcase },
  { label: "Requests", href: "/portal/requests", icon: MessageSquarePlus },
  { label: "Documents", href: "/portal/documents", icon: FileText },
  { label: "Updates", href: "/portal/updates", icon: Bell },
  { label: "Account", href: "/portal/account", icon: User },
];

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-background border-r border-divider flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-divider">
          <span className="font-sans text-xs font-semibold tracking-[0.15em] text-foreground uppercase">
            SUPPORT STUDIO
          </span>
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile summary */}
        <div className="px-6 py-5 border-b border-divider">
          <div className="flex items-center gap-3">
            <img
              src={portraitImg}
              alt="Account manager"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-medium text-foreground">Your Manager</p>
              <p className="text-xs text-muted-foreground">Dylan</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/portal"
                ? location.pathname === "/portal"
                : location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <item.icon size={18} strokeWidth={1.5} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-divider">
          <button className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full rounded-md hover:bg-secondary/60">
            <LogOut size={18} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-background border-b border-divider flex items-center px-6 sticky top-0 z-30">
          <button
            className="lg:hidden mr-4 text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-medium text-foreground">Client Portal</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
