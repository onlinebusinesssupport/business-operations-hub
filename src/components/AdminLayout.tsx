import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  Inbox,
  FileText,
  LayoutTemplate,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Work Manager", href: "/admin/work", icon: ListChecks },
  { label: "Requests Inbox", href: "/admin/requests", icon: Inbox },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-secondary">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-foreground flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-background/10">
          <span className="font-sans text-xs font-semibold tracking-[0.15em] text-background uppercase">
            TBSS
          </span>
          <button
            className="lg:hidden text-background/60"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-background/15 text-background font-medium"
                    : "text-background/50 hover:text-background hover:bg-background/10"
                }`}
              >
                <item.icon size={17} strokeWidth={1.5} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-background/10">
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-background/50 hover:text-background transition-colors w-full rounded-md hover:bg-background/10">
            <LogOut size={17} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 bg-background border-b border-divider flex items-center px-6 sticky top-0 z-30">
          <button
            className="lg:hidden mr-4 text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Admin
          </span>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
