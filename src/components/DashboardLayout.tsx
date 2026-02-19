import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquarePlus,
  FileText,
  Bell,
  User,
  Users,
  ListChecks,
  Inbox,
  LayoutTemplate,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Moon,
  Sun,
  MessagesSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageTransition from "./PageTransition";

/* ─── Nav configs ─── */
const clientNav = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "Projects", href: "/portal/active-work", icon: Briefcase },
  { label: "Requests", href: "/portal/requests", icon: MessageSquarePlus },
  { label: "Documents", href: "/portal/documents", icon: FileText },
  { label: "Updates", href: "/portal/updates", icon: Bell },
  { label: "Messages", href: "/portal/messages", icon: MessagesSquare },
  { label: "Settings", href: "/portal/account", icon: Settings },
];

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Work Manager", href: "/admin/work", icon: ListChecks },
  { label: "Requests", href: "/admin/requests", icon: Inbox },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

type Portal = "client" | "admin";

interface DashboardLayoutProps {
  children: React.ReactNode;
  portal: Portal;
}

const DashboardLayout = ({ children, portal }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAuth();

  const isAdminPortal = portal === "admin";
  const navItems = isAdminPortal ? adminNav : clientNav;

  // Apply dark class to html when in admin portal
  useEffect(() => {
    const root = document.documentElement;
    if (isAdminPortal) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    return () => root.classList.remove("dark");
  }, [isAdminPortal]);

  const handleTogglePortal = () => {
    if (isAdminPortal) {
      navigate("/portal");
    } else if (isAdmin) {
      navigate("/admin");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarWidth = collapsed ? "w-[60px]" : "w-[240px]";

  const isActive = (href: string) => {
    if (href === "/portal" || href === "/admin") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${sidebarWidth} bg-background border-r border-divider flex flex-col transition-all duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-divider shrink-0">
          {!collapsed && (
            <span className="font-sans text-[11px] font-semibold tracking-[0.15em] text-foreground uppercase truncate">
              Support Studio
            </span>
          )}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {mobileOpen ? (
              <X size={16} />
            ) : (
              <ChevronLeft
                size={16}
                className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
              />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase truncate">
            {collapsed ? "" : isAdminPortal ? "Operations" : "Portal"}
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${
                  active
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <item.icon size={16} strokeWidth={1.5} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-divider px-2 py-3 space-y-2 shrink-0">
          {/* Portal toggle */}
          {isAdmin && (
            <button
              onClick={handleTogglePortal}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-150"
            >
              {isAdminPortal ? (
                <Sun size={16} strokeWidth={1.5} className="shrink-0" />
              ) : (
                <Moon size={16} strokeWidth={1.5} className="shrink-0" />
              )}
              {!collapsed && (
                <span className="truncate">
                  {isAdminPortal ? "Client View" : "Admin View"}
                </span>
              )}
            </button>
          )}

          {/* Theme indicator */}
          {!collapsed && (
            <div className="px-3 py-1">
              <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">
                {isAdminPortal ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-150"
          >
            <LogOut size={16} strokeWidth={1.5} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-background border-b border-divider flex items-center px-6 sticky top-0 z-30 shrink-0">
          <button
            className="lg:hidden mr-4 text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              {isAdminPortal ? "Admin" : "Client Portal"}
            </span>
            {isAdminPortal && (
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
