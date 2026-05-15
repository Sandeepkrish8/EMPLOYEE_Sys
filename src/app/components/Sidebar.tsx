import { NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  IndianRupee,
  Briefcase,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  CalendarDays,
  Store,
  Sparkles,
  CalendarClock,
  BookOpen,
  FolderOpen,
  HelpCircle,
  ShieldCheck,
  Wallet,
  UserCog,
  User,
  LogOut,
  Bell,
  Award,
  HeartPulse,
  PanelLeft,
  Receipt,
  PieChart,
} from "lucide-react";
import { Permission, getCurrentUserRole, getRoleLabel, hasAnyPermission, UserRole } from "../config/roles";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  mobileOpen?: boolean;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  permissions?: Permission[];
  roles?: UserRole[];
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ── Role styling ───────────────────────────────────────────────────────────
const ROLE_META: Record<string, { color: string; bg: string; gradient: string }> = {
  super_admin: { color: "#DC2626", bg: "rgba(220,38,38,0.12)",  gradient: "linear-gradient(135deg,#DC2626,#B91C1C)" },
  admin:       { color: "#7C3AED", bg: "rgba(124,58,237,0.12)", gradient: "linear-gradient(135deg,#7C3AED,#6D28D9)" },
  hr:          { color: "#0EA5E9", bg: "rgba(14,165,233,0.12)", gradient: "linear-gradient(135deg,#0EA5E9,#0284C7)" },
  finance:     { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", gradient: "linear-gradient(135deg,#F59E0B,#D97706)" },
  manager:     { color: "#059669", bg: "rgba(5,150,105,0.12)",  gradient: "linear-gradient(135deg,#059669,#047857)" },
  employee:    { color: "#2563EB", bg: "rgba(37,99,235,0.12)",  gradient: "linear-gradient(135deg,#2563EB,#1D4ED8)" },
};

// ── Grouped navigation ─────────────────────────────────────────────────────
const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",    path: "/" },
      { icon: User,            label: "My Portal",    path: "/employee" },
      { icon: Sparkles,        label: "Smart Search", path: "/smart-search" },
      { icon: Bell,            label: "Notifications",path: "/notifications" },
    ],
  },
  {
    title: "People",
    items: [
      { icon: Users,    label: "Employees",   path: "/employees",   permissions: [Permission.VIEW_EMPLOYEES],    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR] },
      { icon: Store,    label: "Departments", path: "/departments", permissions: [Permission.VIEW_DEPARTMENTS],  roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.FINANCE] },
      { icon: Briefcase,label: "Recruitment", path: "/recruitment", permissions: [Permission.VIEW_RECRUITMENT],  roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR] },
    ],
  },
  {
    title: "Workspace",
    items: [
      { icon: CalendarCheck, label: "Attendance",       path: "/attendance", permissions: [Permission.VIEW_ATTENDANCE, Permission.VIEW_OWN_ATTENDANCE] },
      { icon: CalendarClock, label: "Schedule",         path: "/schedule",   permissions: [Permission.VIEW_SCHEDULE,    Permission.VIEW_OWN_SCHEDULE]   },
      { icon: CalendarDays,  label: "Leave Management", path: "/leave",      permissions: [Permission.VIEW_LEAVES,      Permission.CREATE_OWN_LEAVE]    },
      { icon: BookOpen,      label: "Training",         path: "/training",   permissions: [Permission.VIEW_TRAINING]   },
      { icon: FolderOpen,    label: "Documents",        path: "/documents",  permissions: [Permission.VIEW_DOCUMENTS]  },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: IndianRupee, label: "Payroll",            path: "/payroll",             permissions: [Permission.VIEW_PAYROLL, Permission.VIEW_OWN_PAYROLL] },
      { icon: Briefcase,   label: "Increment Appraisal",path: "/increment-appraisal", permissions: [Permission.VIEW_INCREMENT] },
      { icon: Receipt,     label: "Expenses",            path: "/expenses",            permissions: [Permission.VIEW_EXPENSE_REPORTS, Permission.MANAGE_EXPENSE_REPORTS, Permission.SUBMIT_EXPENSES, Permission.VIEW_OWN_EXPENSES] },
      { icon: PieChart,    label: "Budget Overview",     path: "/budget",              roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FINANCE] },
      { icon: BarChart3,   label: "Reports",             path: "/reports",            permissions: [Permission.VIEW_REPORTS], roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.FINANCE] },
    ],
  },
  {
    title: "Growth",
    items: [
      { icon: TrendingUp, label: "Performance",             path: "/performance",             permissions: [Permission.VIEW_PERFORMANCE, Permission.VIEW_OWN_PERFORMANCE] },
      { icon: Award,      label: "Leaderboard",             path: "/performance-leaderboard", permissions: [Permission.VIEW_PERFORMANCE, Permission.VIEW_OWN_PERFORMANCE] },
      { icon: Sparkles,   label: "Gamification",            path: "/gamification",            permissions: [Permission.VIEW_GAMIFICATION] },
      { icon: HeartPulse, label: "Wellness Report",         path: "/wellness-report",         permissions: [Permission.VIEW_WELLNESS] },
    ],
  },
  {
    title: "Administration",
    items: [
      { icon: ShieldCheck, label: "Admin Panel",   path: "/admin",   roles: [UserRole.SUPER_ADMIN] },
      { icon: Wallet,      label: "Finance Panel", path: "/finance", roles: [UserRole.SUPER_ADMIN, UserRole.FINANCE] },
      { icon: UserCog,     label: "HR Panel",      path: "/hr",      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR] },
      { icon: Settings,    label: "Settings",      path: "/settings",permissions: [Permission.MANAGE_SETTINGS, Permission.VIEW_SETTINGS] },
      { icon: HelpCircle,  label: "Help & Support",path: "/help" },
    ],
  },
];

// ── Tooltip (collapsed mode) ───────────────────────────────────────────────
function Tooltip({ label }: { label: string }) {
  return (
    <div
      role="tooltip"
      style={{
        position: "absolute",
        left: "calc(100% + 10px)",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "#1F2937",
        color: "#F9FAFB",
        fontSize: "12px",
        fontWeight: 600,
        padding: "5px 10px",
        borderRadius: "8px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {label}
      <div style={{ position: "absolute", left: "-5px", top: "50%", transform: "translateY(-50%)", width: "8px", height: "8px", backgroundColor: "#1F2937", borderRadius: "2px", rotate: "45deg" }} />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function Sidebar({ collapsed, onToggle, isMobile = false, mobileOpen = false }: SidebarProps) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const currentRole = getCurrentUserRole();

  // Live user data
  const userName  = sessionStorage.getItem("userFullName") || "User";
  const userEmail = sessionStorage.getItem("userEmail")    || "";
  const roleKey   = sessionStorage.getItem("userRole")     || "employee";
  const roleLabel = getRoleLabel(currentRole || UserRole.EMPLOYEE);
  const initials  = userName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
  const roleMeta  = ROLE_META[roleKey] || ROLE_META.employee;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isVisible = (item: NavItem): boolean => {
    if (!item.permissions && !item.roles) return true;
    if (!currentRole) return false;
    if (item.roles && item.roles.length > 0 && !item.roles.includes(currentRole)) return false;
    if (item.permissions && item.permissions.length > 0) return hasAnyPermission(currentRole, item.permissions);
    return true;
  };

  // Only show sections that have at least one visible item
  const visibleSections = NAV_SECTIONS.map(sec => ({
    ...sec,
    items: sec.items.filter(isVisible),
  })).filter(sec => sec.items.length > 0);

  const isCollapsed = collapsed && !isMobile;

  return (
    <aside
      aria-label="Main navigation"
      className="fixed top-0 left-0 h-screen flex flex-col z-50 transition-all duration-300 ease-in-out"
      style={{
        width: isMobile ? "260px" : (isCollapsed ? "72px" : "260px"),
        backgroundColor: "var(--sidebar-background)",
        borderRight: "1px solid var(--sidebar-border)",
        boxShadow: isMobile ? "4px 0 24px rgba(0,0,0,0.12)" : "none",
        transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
      }}
    >
      {/* ── Brand ────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: "64px",
          padding: isCollapsed ? "0 16px" : "0 16px",
          borderBottom: "1px solid var(--sidebar-border)",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "12px",
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}
        >
          <Zap size={18} color="white" fill="white" aria-hidden="true" />
        </div>
        {!isCollapsed && (
          <div>
            <span style={{ display: "block", color: "var(--foreground)", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1 }}>
              NexusHR
            </span>
            <span style={{ display: "block", color: "#10B981", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "1px" }}>
              EMS Platform
            </span>
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="ml-auto flex items-center justify-center rounded-lg transition-all"
            style={{
              width: "28px", height: "28px",
              backgroundColor: "var(--sidebar-accent)",
              border: "1px solid var(--sidebar-border)",
              cursor: "pointer",
              color: "var(--sidebar-foreground)",
              flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sidebar-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--sidebar-primary-foreground)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sidebar-accent)"; (e.currentTarget as HTMLElement).style.color = "var(--sidebar-foreground)"; }}
          >
            <PanelLeft size={14} />
          </button>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav
        aria-label="Sidebar navigation"
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ padding: "10px 8px 8px" }}
      >
        {visibleSections.map((section) => (
          <div key={section.title} style={{ marginBottom: "6px" }}>
            {/* Section label */}
            {!isCollapsed && (
              <p
                style={{
                  padding: "6px 10px 4px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "var(--sidebar-foreground)",
                  opacity: 0.45,
                }}
              >
                {section.title}
              </p>
            )}
            {isCollapsed && (
              <div style={{ height: "1px", backgroundColor: "var(--sidebar-border)", margin: "8px 10px 8px" }} />
            )}

            <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path} style={{ position: "relative" }}>
                    <NavLink
                      to={item.path}
                      aria-current={active ? "page" : undefined}
                      aria-label={item.label}
                      title={isCollapsed ? item.label : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: isCollapsed ? "10px 0" : "9px 10px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "all 0.15s ease",
                        position: "relative",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        // Active state
                        backgroundColor: active ? "var(--sidebar-primary)" : "transparent",
                        color: active ? "var(--sidebar-primary-foreground)" : "var(--sidebar-foreground)",
                        fontWeight: active ? 600 : 500,
                        // Left accent bar for active
                        boxShadow: active && !isCollapsed ? "inset 3px 0 0 var(--sidebar-primary-foreground)" : "none",
                        marginLeft: active && !isCollapsed ? "0" : "0",
                      }}
                      className="sidebar-navlink"
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sidebar-accent)";
                          (e.currentTarget as HTMLElement).style.color = "var(--sidebar-accent-foreground)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "var(--sidebar-foreground)";
                        }
                      }}
                    >
                      {/* Icon */}
                      <item.icon
                        size={17}
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          opacity: active ? 1 : 0.75,
                          color: active ? "var(--sidebar-primary-foreground)" : "inherit",
                        }}
                      />

                      {/* Label */}
                      {!isCollapsed && (
                        <span style={{ fontSize: "13.5px", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                          {item.label}
                        </span>
                      )}

                      {/* Active dot (expanded mode) */}
                      {active && !isCollapsed && (
                        <span
                          aria-hidden="true"
                          style={{
                            width: "6px", height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "var(--sidebar-primary-foreground)",
                            flexShrink: 0,
                            opacity: 0.8,
                          }}
                        />
                      )}

                      {/* Tooltip in collapsed mode */}
                      {isCollapsed && <Tooltip label={item.label} />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User profile + actions ────────────────────────────────────────── */}
      <div
        className="shrink-0"
        style={{ borderTop: "1px solid var(--sidebar-border)", padding: "10px 8px 10px" }}
      >
        {/* Expand button in collapsed mode */}
        {isCollapsed && (
          <button
            onClick={onToggle}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="flex items-center justify-center w-full rounded-xl transition-all mb-2"
            style={{ height: "36px", backgroundColor: "var(--sidebar-accent)", border: "1px solid var(--sidebar-border)", cursor: "pointer", color: "var(--sidebar-foreground)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sidebar-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--sidebar-primary-foreground)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sidebar-accent)"; (e.currentTarget as HTMLElement).style.color = "var(--sidebar-foreground)"; }}
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* User card */}
        <div
          className="flex items-center rounded-xl"
          style={{
            gap: isCollapsed ? 0 : "10px",
            padding: isCollapsed ? "8px 0" : "8px 10px",
            justifyContent: isCollapsed ? "center" : "flex-start",
            backgroundColor: "var(--sidebar-accent)",
            border: "1px solid var(--sidebar-border)",
          }}
        >
          {/* Avatar */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center shrink-0 rounded-full"
            style={{
              width: "34px", height: "34px",
              background: roleMeta.gradient,
              fontSize: "12px", fontWeight: 700, color: "#fff",
              boxShadow: `0 2px 8px ${roleMeta.color}44`,
            }}
          >
            {initials}
          </div>

          {/* Name + role */}
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "2px",
                  padding: "1px 7px",
                  borderRadius: "20px",
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: roleMeta.bg,
                  color: roleMeta.color,
                  letterSpacing: "0.3px",
                }}
              >
                {roleLabel}
              </span>
            </div>
          )}

          {/* Logout button */}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="flex items-center justify-center rounded-lg transition-all shrink-0"
              style={{ width: "28px", height: "28px", backgroundColor: "transparent", border: "none", cursor: "pointer", color: "var(--sidebar-foreground)", opacity: 0.6 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#EF4444"; (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--sidebar-foreground)"; (e.currentTarget as HTMLElement).style.opacity = "0.6"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              <LogOut size={15} />
            </button>
          )}
        </div>

        {/* Collapsed logout */}
        {isCollapsed && (
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="flex items-center justify-center w-full rounded-xl mt-2 transition-all"
            style={{ height: "36px", backgroundColor: "transparent", border: "1px solid var(--sidebar-border)", cursor: "pointer", color: "var(--sidebar-foreground)", opacity: 0.6 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.color = "#EF4444"; (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.borderColor = "#EF4444"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--sidebar-foreground)"; (e.currentTarget as HTMLElement).style.opacity = "0.6"; (e.currentTarget as HTMLElement).style.borderColor = "var(--sidebar-border)"; }}
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </aside>
  );
}

