import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Bot, History, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const allLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "doctor", "nurse", "service"] as UserRole[] },
  { to: "/robots", label: "Robots", icon: Bot, roles: ["admin", "doctor"] as UserRole[] },
  { to: "/history", label: "History", icon: History, roles: ["admin", "doctor", "service"] as UserRole[] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["admin", "doctor"] as UserRole[] },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { role } = useAuth();

  const links = allLinks.filter((l) => role && l.roles.includes(role));

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-4 top-3.5 z-50 rounded-md p-1 text-muted-foreground hover:bg-muted md:hidden"
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200 md:sticky",
          collapsed ? "-translate-x-full md:w-16 md:translate-x-0" : "w-60"
        )}
      >
        <div className="flex h-14 items-center justify-center border-b border-sidebar-border px-4">
          {!collapsed && (
            <span className="text-base font-bold tracking-tight text-sidebar-primary">
              SurgiNerve
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Role badge */}
        {!collapsed && role && (
          <div className="border-t border-sidebar-border px-4 py-2">
            <span className="text-xs capitalize text-sidebar-foreground/50">
              Role: {role}
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden border-t border-sidebar-border p-3 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground md:block"
        >
          {collapsed ? "→" : "← Collapse"}
        </button>
      </aside>
    </>
  );
};

export default AppSidebar;
