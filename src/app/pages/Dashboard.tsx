import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  UserCheck,
  UserMinus,
  UserPlus,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  BookOpen,
  ArrowUpRight,
  MoreHorizontal,
  FileText,
  TrendingUp,
  Clock,
  Target,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  departmentHeadcount,
  attendanceOverview,
  recentActivities,
} from "../data/mockData";
import { getCurrentUserRole, UserRole } from "../config/roles";

// ── Finance chart data ──────────────────────────────────────────────────────
const payrollByDept = [
  { department: "Engineering", amount: 3.8 },
  { department: "Operations", amount: 2.6 },
  { department: "Finance", amount: 2.1 },
  { department: "Marketing", amount: 1.4 },
  { department: "HR", amount: 1.2 },
  { department: "Design", amount: 1.3 },
];
const budgetUtilization = [
  { name: "Utilized", value: 78, color: "#10B981" },
  { name: "Remaining", value: 22, color: "var(--border)" },
];

// ── Manager chart data ──────────────────────────────────────────────────────
const teamWeeklyAttendance = [
  { day: "Mon", present: 11 },
  { day: "Tue", present: 12 },
  { day: "Wed", present: 10 },
  { day: "Thu", present: 11 },
  { day: "Fri", present: 9 },
];
const teamPerfData = [
  { name: "Excellent", value: 4, color: "#10B981" },
  { name: "Good", value: 6, color: "#22C55E" },
  { name: "Average", value: 2, color: "#F59E0B" },
];

// ── Employee chart data ─────────────────────────────────────────────────────
const myAttendanceWeeks = [
  { week: "W1", days: 5 },
  { week: "W2", days: 4 },
  { week: "W3", days: 5 },
  { week: "W4", days: 4 },
];
const myLeaveSummary = [
  { name: "Annual Left", value: 12, color: "#10B981" },
  { name: "Sick Left", value: 5, color: "#F59E0B" },
  { name: "Used", value: 8, color: "#E5E7EB" },
];

// ── KPI Cards per role ──────────────────────────────────────────────────────
const adminKpiCards = [
  {
    title: "Total Employees",
    value: "248",
    change: "+12 this month",
    changePositive: true,
    icon: Users,
    iconBg: "linear-gradient(135deg, #059669, #047857)",
    accent: "#059669",
    lightBg: "#ECFDF5",
    route: "/employees",
    menuItems: [
      { label: "View All Employees", route: "/employees" },
      { label: "Add Employee",        route: "/employees" },
      { label: "Export Report",       route: "/reports"   },
    ],
  },
  {
    title: "Present Today",
    value: "219",
    change: "88.3% attendance",
    changePositive: true,
    icon: UserCheck,
    iconBg: "linear-gradient(135deg, #22C55E, #16A34A)",
    accent: "#22C55E",
    lightBg: "#F0FDF4",
    route: "/attendance",
    menuItems: [
      { label: "View Attendance",     route: "/attendance" },
      { label: "Mark Attendance",     route: "/attendance" },
      { label: "Attendance Reports",  route: "/reports"    },
    ],
  },
  {
    title: "On Leave",
    value: "17",
    change: "6.9% of workforce",
    changePositive: false,
    icon: UserMinus,
    iconBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    accent: "#F59E0B",
    lightBg: "#FFFBEB",
    route: "/leave",
    menuItems: [
      { label: "View Leave Requests", route: "/leave" },
      { label: "Approve Leaves",      route: "/leave" },
      { label: "Leave Reports",       route: "/reports" },
    ],
  },
  {
    title: "New This Month",
    value: "12",
    change: "+3 vs last month",
    changePositive: true,
    icon: UserPlus,
    iconBg: "linear-gradient(135deg, #14B8A6, #0D9488)",
    accent: "#14B8A6",
    lightBg: "#F0FDFA",
    route: "/employees",
    menuItems: [
      { label: "View New Hires",      route: "/employees"  },
      { label: "Open Positions",      route: "/recruitment" },
      { label: "Recruitment Report",  route: "/reports"    },
    ],
  },
];

const hrKpiCards = [
  {
    title: "Total Employees",
    value: "248",
    change: "+12 this month",
    changePositive: true,
    icon: Users,
    iconBg: "linear-gradient(135deg, #059669, #047857)",
    accent: "#059669",
    lightBg: "#ECFDF5",
    route: "/employees",
    menuItems: [
      { label: "View All Employees", route: "/employees" },
      { label: "Add Employee",       route: "/employees" },
    ],
  },
  {
    title: "Leave Requests",
    value: "17",
    change: "8 pending approval",
    changePositive: false,
    icon: Calendar,
    iconBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    accent: "#F59E0B",
    lightBg: "#FFFBEB",
    route: "/leave",
    menuItems: [
      { label: "View Requests",  route: "/leave" },
      { label: "Approve Leaves", route: "/leave" },
    ],
  },
  {
    title: "New Hires",
    value: "12",
    change: "+3 vs last month",
    changePositive: true,
    icon: UserPlus,
    iconBg: "linear-gradient(135deg, #14B8A6, #0D9488)",
    accent: "#14B8A6",
    lightBg: "#F0FDFA",
    route: "/employees",
    menuItems: [
      { label: "View New Hires", route: "/employees"  },
      { label: "Onboarding",     route: "/employees"  },
    ],
  },
  {
    title: "Open Positions",
    value: "7",
    change: "43 applicants",
    changePositive: true,
    icon: Briefcase,
    iconBg: "linear-gradient(135deg, #6366F1, #4F46E5)",
    accent: "#6366F1",
    lightBg: "#EEF2FF",
    route: "/recruitment",
    menuItems: [
      { label: "View Pipeline",   route: "/recruitment" },
      { label: "Add Position",    route: "/recruitment" },
    ],
  },
];

const financeKpiCards = [
  {
    title: "Monthly Payroll",
    value: "₹12.4M",
    change: "Apr 2026",
    changePositive: true,
    icon: DollarSign,
    iconBg: "linear-gradient(135deg, #10B981, #047857)",
    accent: "#10B981",
    lightBg: "#ECFDF5",
    route: "/payroll",
    menuItems: [
      { label: "View Payroll",    route: "/payroll" },
      { label: "Run Payroll",     route: "/payroll" },
      { label: "Payroll Reports", route: "/reports" },
    ],
  },
  {
    title: "Budget Utilized",
    value: "78%",
    change: "₹9.7M of ₹12.4M",
    changePositive: true,
    icon: Wallet,
    iconBg: "linear-gradient(135deg, #6366F1, #4F46E5)",
    accent: "#6366F1",
    lightBg: "#EEF2FF",
    route: "/reports",
    menuItems: [
      { label: "Budget Report",    route: "/reports" },
      { label: "Dept Budgets",     route: "/departments" },
    ],
  },
  {
    title: "Pending Invoices",
    value: "8",
    change: "3 overdue",
    changePositive: false,
    icon: FileText,
    iconBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    accent: "#F59E0B",
    lightBg: "#FFFBEB",
    route: "/reports",
    menuItems: [
      { label: "View Invoices",   route: "/reports" },
      { label: "Overdue",         route: "/reports" },
    ],
  },
  {
    title: "Expense Reports",
    value: "24",
    change: "12 pending review",
    changePositive: false,
    icon: TrendingUp,
    iconBg: "linear-gradient(135deg, #EF4444, #DC2626)",
    accent: "#EF4444",
    lightBg: "#FEF2F2",
    route: "/reports",
    menuItems: [
      { label: "View Expenses",   route: "/reports" },
      { label: "Expense Report",  route: "/reports" },
    ],
  },
];

const managerKpiCards = [
  {
    title: "My Team",
    value: "12",
    change: "2 on leave today",
    changePositive: true,
    icon: Users,
    iconBg: "linear-gradient(135deg, #059669, #047857)",
    accent: "#059669",
    lightBg: "#ECFDF5",
    route: "/employees",
    menuItems: [
      { label: "View Team",     route: "/employees"  },
      { label: "Team Report",   route: "/reports"    },
    ],
  },
  {
    title: "Team Present",
    value: "10",
    change: "83.3% attendance",
    changePositive: true,
    icon: UserCheck,
    iconBg: "linear-gradient(135deg, #22C55E, #16A34A)",
    accent: "#22C55E",
    lightBg: "#F0FDF4",
    route: "/attendance",
    menuItems: [
      { label: "Team Attendance", route: "/attendance" },
      { label: "Attendance Log",  route: "/attendance" },
    ],
  },
  {
    title: "Pending Approvals",
    value: "3",
    change: "Leave requests",
    changePositive: false,
    icon: Clock,
    iconBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    accent: "#F59E0B",
    lightBg: "#FFFBEB",
    route: "/leave",
    menuItems: [
      { label: "Approve Leave",   route: "/leave" },
      { label: "View Requests",   route: "/leave" },
    ],
  },
  {
    title: "Avg Performance",
    value: "4.2 / 5",
    change: "+0.2 vs last quarter",
    changePositive: true,
    icon: Star,
    iconBg: "linear-gradient(135deg, #6366F1, #4F46E5)",
    accent: "#6366F1",
    lightBg: "#EEF2FF",
    route: "/performance",
    menuItems: [
      { label: "Team Performance", route: "/performance" },
      { label: "Reviews",          route: "/performance" },
    ],
  },
];

const employeeKpiCards = [
  {
    title: "My Attendance",
    value: "22 / 24",
    change: "91.7% this month",
    changePositive: true,
    icon: UserCheck,
    iconBg: "linear-gradient(135deg, #22C55E, #16A34A)",
    accent: "#22C55E",
    lightBg: "#F0FDF4",
    route: "/attendance",
    menuItems: [
      { label: "View Attendance", route: "/attendance" },
      { label: "My Schedule",     route: "/schedule"   },
    ],
  },
  {
    title: "Leave Balance",
    value: "12 days",
    change: "Annual leave",
    changePositive: true,
    icon: Calendar,
    iconBg: "linear-gradient(135deg, #14B8A6, #0D9488)",
    accent: "#14B8A6",
    lightBg: "#F0FDFA",
    route: "/leave",
    menuItems: [
      { label: "Apply Leave",    route: "/leave" },
      { label: "Leave History",  route: "/leave" },
    ],
  },
  {
    title: "My Performance",
    value: "4.1 / 5",
    change: "+0.3 vs last quarter",
    changePositive: true,
    icon: Target,
    iconBg: "linear-gradient(135deg, #6366F1, #4F46E5)",
    accent: "#6366F1",
    lightBg: "#EEF2FF",
    route: "/performance",
    menuItems: [
      { label: "View Performance", route: "/performance"           },
      { label: "Leaderboard",      route: "/performance-leaderboard" },
    ],
  },
  {
    title: "Pending Tasks",
    value: "5",
    change: "2 due today",
    changePositive: false,
    icon: CheckCircle2,
    iconBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    accent: "#F59E0B",
    lightBg: "#FFFBEB",
    route: "/profile",
    menuItems: [
      { label: "My Tasks",    route: "/profile" },
      { label: "My Profile",  route: "/profile" },
    ],
  },
];

const activityIcons: Record<string, any> = {
  UserPlus,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  BookOpen,
};

// ── Role label & accent ─────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  super_admin: { label: "Super Admin",   color: "#DC2626", bg: "#FEE2E2", desc: "Full system access" },
  admin:       { label: "Administrator", color: "#7C3AED", bg: "#F5F3FF", desc: "Manage all modules"  },
  hr:          { label: "HR Manager",    color: "#0EA5E9", bg: "#E0F2FE", desc: "Personnel & hiring"  },
  finance:     { label: "Finance",       color: "#F59E0B", bg: "#FEF3C7", desc: "Financial data only" },
  manager:     { label: "Manager",       color: "#059669", bg: "#ECFDF5", desc: "Manage your team"    },
  employee:    { label: "Employee",      color: "#2563EB", bg: "#EFF6FF", desc: "Self-service access" },
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2 shadow-lg"
        style={{ 
          backgroundColor: "var(--popover)", 
          border: "1px solid var(--border)",
          color: "var(--popover-foreground)" 
        }}
      >
        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginBottom: "2px" }}>{label}</p>
        <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>
          {payload[0].value} employees
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2 shadow-lg"
        style={{ 
          backgroundColor: "var(--popover)", 
          border: "1px solid var(--border)",
          color: "var(--popover-foreground)" 
        }}
      >
        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginBottom: "2px" }}>{payload[0].name}</p>
        <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>
          {payload[0].value} employees
        </p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentRole = getCurrentUserRole();
  const roleKey = sessionStorage.getItem("userRole") || "employee";
  const roleMeta = ROLE_META[roleKey] ?? ROLE_META.employee;

  // Pick KPI cards based on role
  const kpiCards =
    currentRole === UserRole.FINANCE  ? financeKpiCards  :
    currentRole === UserRole.HR       ? hrKpiCards       :
    currentRole === UserRole.MANAGER  ? managerKpiCards  :
    currentRole === UserRole.EMPLOYEE ? employeeKpiCards :
    adminKpiCards;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* ── Role Banner ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: roleMeta.bg, border: `1px solid ${roleMeta.color}22` }}
      >
        <span
          className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
          style={{ backgroundColor: roleMeta.color, color: "#fff" }}
        >
          {roleMeta.label}
        </span>
        <span style={{ color: roleMeta.color, fontSize: "13px", fontWeight: 600 }}>
          {roleMeta.desc}
        </span>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div ref={menuRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {kpiCards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
            onClick={() => navigate(card.route)}
          >
            {/* Background accent */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.03] dark:opacity-[0.07]"
              style={{ background: card.accent, transform: "translate(30%, -30%)" }}
            />
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: "44px",
                  height: "44px",
                  background: card.iconBg,
                  boxShadow: `0 4px 12px ${card.accent}40`,
                }}
              >
                <card.icon size={20} color="white" />
              </div>

              {/* ··· Menu button */}
              <div style={{ position: "relative" }}>
                <button
                  className="rounded-lg p-1.5 transition-colors"
                  style={{
                    color: openMenu === i ? "var(--primary)" : "var(--muted-foreground)",
                    backgroundColor: openMenu === i ? "var(--secondary)" : "transparent",
                  }}
                  onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === i ? null : i); }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; }}
                  onMouseLeave={(e) => { if (openMenu !== i) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                >
                  <MoreHorizontal size={16} />
                </button>

                {/* Dropdown */}
                {openMenu === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
                      minWidth: "180px",
                      zIndex: 50,
                      overflow: "hidden",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header chip */}
                    <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--border)" }}>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                        {card.title}
                      </p>
                    </div>
                    {card.menuItems.map((item, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-4 py-2.5 transition-colors"
                        style={{
                          color: "var(--foreground)",
                          fontSize: "13px",
                          fontWeight: 500,
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          borderBottom: idx < card.menuItems.length - 1 ? "1px solid var(--border)" : "none",
                        }}
                        onClick={() => { setOpenMenu(null); navigate(item.route); }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500, marginBottom: "4px" }}>
              {card.title}
            </p>
            <p style={{ color: "var(--foreground)", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>
              {card.value}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: card.changePositive ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                  color: card.changePositive ? "#10B981" : "#F59E0B",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row (role-specific) ──────────────────────────────────── */}

      {/* Admin / HR / SuperAdmin: company-wide charts */}
      {(currentRole === UserRole.SUPER_ADMIN ||
        currentRole === UserRole.ADMIN ||
        currentRole === UserRole.HR) && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          {/* Department Headcount */}
          <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Department Headcount</h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>Employee distribution by department</p>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)", fontSize: "12px", fontWeight: 600 }} onClick={() => navigate("/employees")}>
                View All <ArrowUpRight size={13} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={departmentHeadcount} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="department" type="category" tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Attendance Overview */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="mb-4">
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Attendance Overview</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>Today, May 15, 2026</p>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={attendanceOverview} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value"
                    onMouseEnter={(_: any, index: number) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
                    {attendanceOverview.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.5} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {attendanceOverview.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{item.value}</span>
                    <span className="px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${item.color}18`, color: item.color, fontSize: "10px", fontWeight: 600 }}>
                      {Math.round((item.value / 248) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl p-3 text-center" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Total Workforce</p>
              <p style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>248</p>
            </div>
          </div>
        </div>
      )}

      {/* Finance: payroll by dept + budget utilization */}
      {currentRole === UserRole.FINANCE && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Payroll by Department</h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>Monthly spend in millions (₹)</p>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)", fontSize: "12px", fontWeight: 600 }} onClick={() => navigate("/payroll")}>
                View Payroll <ArrowUpRight size={13} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={payrollByDept} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="department" type="category" tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip formatter={(v: any) => [`₹${v}M`, "Payroll"]} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="mb-4">
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Budget Utilization</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>April 2026</p>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={budgetUtilization} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value"
                    onMouseEnter={(_: any, index: number) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
                    {budgetUtilization.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.5} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {budgetUtilization.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{item.name}</span>
                  </div>
                  <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{item.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl p-3 text-center" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Total Budget</p>
              <p style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>₹12.4M</p>
            </div>
          </div>
        </div>
      )}

      {/* Manager: team weekly attendance + team performance */}
      {currentRole === UserRole.MANAGER && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Team Attendance This Week</h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>Daily present count (team size: 12)</p>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)", fontSize: "12px", fontWeight: 600 }} onClick={() => navigate("/attendance")}>
                View All <ArrowUpRight size={13} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={teamWeeklyAttendance} margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "var(--foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 12]} />
                <Tooltip formatter={(v: any) => [`${v} present`, ""]} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                <Bar dataKey="present" radius={[6, 6, 0, 0]} fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="mb-4">
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Team Performance</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>Distribution (12 members)</p>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={teamPerfData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value"
                    onMouseEnter={(_: any, index: number) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
                    {teamPerfData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.5} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {teamPerfData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{item.name}</span>
                  </div>
                  <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Employee: personal weekly attendance + leave summary */}
      {currentRole === UserRole.EMPLOYEE && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>My Attendance — April 2026</h3>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>Days present per week</p>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)", fontSize: "12px", fontWeight: 600 }} onClick={() => navigate("/attendance")}>
                Full Log <ArrowUpRight size={13} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={myAttendanceWeeks} margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "var(--foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 5]} />
                <Tooltip formatter={(v: any) => [`${v} days`, ""]} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                <Bar dataKey="days" radius={[6, 6, 0, 0]} fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="mb-4">
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Leave Summary</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>FY 2026 balance</p>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={myLeaveSummary} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value"
                    onMouseEnter={(_: any, index: number) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
                    {myLeaveSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.5} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {myLeaveSummary.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{item.name}</span>
                  </div>
                  <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{item.value}d</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 rounded-xl py-2 text-sm font-semibold transition-all hover:opacity-80" style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff" }} onClick={() => navigate("/leave")}>
              Apply for Leave
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Row: Quick Stats + Recent Activity ────────────────────── */}
      <div className="grid grid-cols-3 gap-5">
        {/* Quick Stats (role-specific) */}
        <div className="col-span-1 grid grid-cols-1 gap-4">
          {(
            currentRole === UserRole.FINANCE ? [
              { title: "Next Payroll Run", value: "May 30, 2026", sub: "15 days away",       icon: DollarSign,   color: "#10B981", bg: "rgba(16,185,129,0.1)" },
              { title: "Overdue Invoices",  value: "3 invoices",  sub: "Action required",     icon: AlertCircle,  color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
              { title: "Budget Review",     value: "Q2 2026",     sub: "Due Jun 30",          icon: FileText,     color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
            ] :
            currentRole === UserRole.HR ? [
              { title: "Next Interview",    value: "Today 2:30 PM", sub: "Software Engineer", icon: Briefcase,    color: "#0EA5E9", bg: "rgba(14,165,233,0.1)"  },
              { title: "Leave Pending",     value: "8 requests",    sub: "Needs approval",    icon: Clock,        color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
              { title: "Onboarding",        value: "3 this week",   sub: "New employees",     icon: UserPlus,     color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
            ] :
            currentRole === UserRole.MANAGER ? [
              { title: "Leave Today",       value: "2 out",         sub: "Team absences",     icon: UserMinus,    color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
              { title: "Pending Reviews",   value: "1 due",         sub: "Q1 performance",    icon: Star,         color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
              { title: "Sprint Goals",      value: "73% complete",  sub: "6 of 8 done",       icon: Target,       color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
            ] :
            currentRole === UserRole.EMPLOYEE ? [
              { title: "Next Payday",       value: "May 30, 2026",  sub: "15 days away",      icon: DollarSign,   color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
              { title: "Leave Balance",     value: "12 days",       sub: "Annual leave left", icon: Calendar,     color: "#14B8A6", bg: "rgba(20,184,166,0.1)"  },
              { title: "My Goals",          value: "4 / 6",         sub: "On track",          icon: CheckCircle2, color: "#22C55E", bg: "rgba(34,197,94,0.1)"   },
            ] : [
              { title: "Next Payroll",      value: "May 30, 2026",  sub: "15 days away",      icon: DollarSign,   color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
              { title: "Open Positions",    value: "7 Roles",       sub: "43 applications",   icon: Briefcase,    color: "#14B8A6", bg: "rgba(20,184,166,0.1)"  },
              { title: "Reviews",           value: "Q1 2026",       sub: "248 / 248 done",    icon: Star,         color: "#22C55E", bg: "rgba(34,197,94,0.1)"   },
            ]
          ).map((item, i) => (
            <div key={i} className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01] shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: "42px", height: "42px", backgroundColor: item.bg }}>
                <item.icon size={18} color={item.color} />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 500 }}>{item.title}</p>
                <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>{item.value}</p>
                <p style={{ color: item.color, fontSize: "11px", opacity: 0.8 }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>
                {currentRole === UserRole.EMPLOYEE ? "My Recent Activity" :
                 currentRole === UserRole.MANAGER  ? "Team Activity"      :
                 currentRole === UserRole.FINANCE  ? "Financial Activity" :
                 "Recent Activity"}
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
                {currentRole === UserRole.EMPLOYEE ? "Your latest updates" :
                 currentRole === UserRole.MANAGER  ? "Latest team updates" :
                 currentRole === UserRole.FINANCE  ? "Latest financial updates" :
                 "Latest updates across the system"}
              </p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors" style={{ color: "var(--primary)", backgroundColor: "var(--secondary)", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}
              onClick={() => navigate(currentRole === UserRole.EMPLOYEE ? "/profile" : currentRole === UserRole.FINANCE ? "/payroll" : "/employees")}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
              View All <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activityIcons[activity.icon];
              return (
                <div key={activity.id} className="flex items-start gap-4 p-2 rounded-xl transition-colors">
                  <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: "36px", height: "36px", backgroundColor: `${activity.color}15` }}>
                    {Icon && <Icon size={16} style={{ color: activity.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 500, lineHeight: 1.4 }}>{activity.text}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "1px" }}>{activity.subtext}</p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)", fontSize: "11px", border: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
