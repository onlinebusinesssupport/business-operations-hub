import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Layers,
  MessageSquare,
  ListChecks,
  Zap,
  GitBranch,
  BarChart3,
  DollarSign,
  FolderOpen,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Moon,
  Sun,
  Users,
  Inbox,
  FileText,
  LayoutTemplate,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageTransition from "./PageTransition";

/* ─── Nav configs ─── */
const clientNav = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "Studios", href: "/portal/active-work", icon: Layers },
  { label: "Conversations", href: "/portal/updates", icon: MessageSquare },
  { label: "In Motion", href: "/portal/requests", icon: ListChecks },
  { label: "Automation", href: "/portal/automation", icon: Zap },
  { label: "Pipeline", href: "/portal/pipeline", icon: GitBranch },
  { label: "Insights", href: "/portal/reports", icon: BarChart3 },
  { label: "Billing", href: "/portal/finance", icon: DollarSign },
  { label: "Files", href: "/portal/documents", icon: FolderOpen },
  { label: "Settings", href: "/portal/account", icon: Settings },
];

const adminNav = [
  { label: "Studio Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: Inbox },
  { label: "Partner Workspaces", href: "/admin/clients", icon: Users },
  { label: "Work Manager", href: "/admin/work", icon: ListChecks },
  { label: "Requests", href: "/admin/requests", icon: MessageSquare },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { label: "System Health", href: "/admin/settings", icon: Settings },
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
    <div className="min-h-screen flex w-full">
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

      {/* Sidebar — off-black */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${sidebarWidth} flex flex-col transition-all duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: "#111111" }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          {!collapsed && (
            <span className="font-display text-[11px] font-bold tracking-[0.2em] text-white/90 uppercase truncate">
              SUPPORT STUDIO™
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
            className="text-white/40 hover:text-white/70 transition-colors shrink-0"
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
          <p className="px-3 pb-2 text-[10px] font-medium tracking-[0.12em] text-white/30 uppercase truncate">
            {collapsed ? "" : isAdminPortal ? "Operations" : "Platform"}
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-[13px] transition-all duration-150 ${
                  active
                    ? "text-white font-medium"
                    : "text-white/40 hover:text-white/70"
                }`}
                style={active ? { backgroundColor: "#1E3D2F" } : undefined}
              >
                <item.icon size={16} strokeWidth={1.5} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 px-2 py-3 space-y-1 shrink-0">
          {isAdmin && (
            <button
              onClick={handleTogglePortal}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/40 hover:text-white/70 transition-all duration-150"
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

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/40 hover:text-white/70 transition-all duration-150"
          >
            <LogOut size={16} strokeWidth={1.5} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content — off-white */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-background">
        {/* Top bar */}
        <header className="h-14 bg-background border-b border-divider flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <span className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
              {isAdminPortal ? "Studio Control" : "Partner Workspace"}
            </span>
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
