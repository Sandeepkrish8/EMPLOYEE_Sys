import { useState } from "react";
import {
  PieChart as PieChartIcon, Edit2, Save, X, TrendingUp,
  TrendingDown, AlertTriangle, CheckCircle2, Plus, RefreshCw,
  DollarSign, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { getCurrentUserRole, UserRole } from "../config/roles";

// ── Types ───────────────────────────────────────────────────────────────────
interface DeptBudget {
  id: string;
  department: string;
  allocated: number;
  spent:      number;
  color:      string;
  lead:       string;
}

type BudgetStatus = "On Track" | "Warning" | "Over Budget";

// ── Constants ────────────────────────────────────────────────────────────────
const SEED_BUDGETS: DeptBudget[] = [
  { id: "b1", department: "Engineering",   allocated: 7_200_000, spent: 5_100_000, color: "#6366F1", lead: "Alex Kim"       },
  { id: "b2", department: "HR",            allocated: 2_400_000, spent: 1_920_000, color: "#10B981", lead: "Emily Rodriguez" },
  { id: "b3", department: "Finance",       allocated: 1_800_000, spent: 1_440_000, color: "#F59E0B", lead: "Marcus Williams" },
  { id: "b4", department: "Marketing",     allocated: 3_600_000, spent: 3_800_000, color: "#EF4444", lead: "Priya Patel"     },
  { id: "b5", department: "Sales",         allocated: 4_200_000, spent: 3_150_000, color: "#0EA5E9", lead: "James Carter"    },
  { id: "b6", department: "Operations",    allocated: 2_800_000, spent: 2_240_000, color: "#7C3AED", lead: "David Chen"      },
  { id: "b7", department: "Design",        allocated: 1_400_000, spent:   980_000, color: "#EC4899", lead: "Yuki Tanaka"     },
];

const MONTHLY_TREND = [
  { month: "Nov", Engineering: 410000, HR: 165000, Finance: 115000, Marketing: 290000, Sales: 255000, Operations: 185000 },
  { month: "Dec", Engineering: 440000, HR: 172000, Finance: 122000, Marketing: 310000, Sales: 268000, Operations: 195000 },
  { month: "Jan", Engineering: 395000, HR: 158000, Finance: 118000, Marketing: 280000, Sales: 242000, Operations: 175000 },
  { month: "Feb", Engineering: 450000, HR: 180000, Finance: 130000, Marketing: 340000, Sales: 285000, Operations: 210000 },
  { month: "Mar", Engineering: 420000, HR: 170000, Finance: 125000, Marketing: 320000, Sales: 270000, Operations: 200000 },
  { month: "Apr", Engineering: 485000, HR: 175000, Finance: 130000, Marketing: 360000, Sales: 300000, Operations: 215000 },
];

function useBudgetStore(): [DeptBudget[], (b: DeptBudget[]) => void] {
  const key = "nexus_dept_budgets";
  const [items, setItems] = useState<DeptBudget[]>(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : SEED_BUDGETS;
  });
  const save = (b: DeptBudget[]) => { setItems(b); localStorage.setItem(key, JSON.stringify(b)); };
  return [items, save];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function pct(spent: number, allocated: number) {
  if (!allocated) return 0;
  return Math.round((spent / allocated) * 100);
}

function getBudgetStatus(spent: number, allocated: number): BudgetStatus {
  const p = pct(spent, allocated);
  if (p >= 100) return "Over Budget";
  if (p >= 85)  return "Warning";
  return "On Track";
}

function StatusBadge({ status }: { status: BudgetStatus }) {
  const map: Record<BudgetStatus, [string, string, React.ElementType]> = {
    "On Track":    ["rgba(16,185,129,0.12)",  "#10B981", CheckCircle2],
    "Warning":     ["rgba(245,158,11,0.12)",  "#F59E0B", AlertTriangle],
    "Over Budget": ["rgba(239,68,68,0.12)",   "#EF4444", TrendingDown],
  };
  const [bg, color, Icon] = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color }}>
      <Icon size={11} />
      {status}
    </span>
  );
}

const fmt = (n: number) => `₹${(n / 1_000_000).toFixed(2)}M`;
const fmtFull = (n: number) => `₹${n.toLocaleString()}`;

// ── Edit Budget Modal ────────────────────────────────────────────────────────
function EditBudgetModal({ dept, onSave, onClose }: {
  dept: DeptBudget;
  onSave: (updated: DeptBudget) => void;
  onClose: () => void;
}) {
  const [allocated, setAllocated] = useState(dept.allocated);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              <Edit2 size={15} color="#fff" />
            </div>
            <div>
              <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Edit Budget</h2>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{dept.department}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          <div className="p-3 rounded-xl flex justify-between" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Current Spent</span>
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{fmtFull(dept.spent)}</span>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>
              New Allocation (₹) *
            </label>
            <input type="number" required min="0" value={allocated}
              onChange={e => setAllocated(Number(e.target.value))}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "4px" }}>
              Current: {fmtFull(dept.allocated)}
            </p>
          </div>
          {allocated < dept.spent && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertTriangle size={13} color="#EF4444" />
              <p style={{ color: "#EF4444", fontSize: "12px" }}>New allocation is less than current spend — this department will be over budget.</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
            Cancel
          </button>
          <button onClick={() => onSave({ ...dept, allocated })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", border: "none" }}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function BudgetOverview() {
  const currentRole = getCurrentUserRole();
  const canEdit = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FINANCE].includes(currentRole as UserRole);

  const [budgets, saveBudgets] = useBudgetStore();
  const [editing, setEditing]  = useState<DeptBudget | null>(null);
  const [toast, setToast]      = useState("");

  const totalAlloc   = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent   = budgets.reduce((s, b) => s + b.spent,     0);
  const totalRemain  = totalAlloc - totalSpent;
  const overCount    = budgets.filter(b => b.spent >= b.allocated).length;
  const warnCount    = budgets.filter(b => getBudgetStatus(b.spent, b.allocated) === "Warning").length;
  const utilPct      = pct(totalSpent, totalAlloc);

  const handleSave = (updated: DeptBudget) => {
    saveBudgets(budgets.map(b => b.id === updated.id ? updated : b));
    setEditing(null);
    notify("Budget updated successfully!");
  };

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // Bar chart data — allocated vs spent
  const barData = budgets.map(b => ({
    name: b.department.substring(0, 4),
    Allocated: b.allocated / 1_000_000,
    Spent: b.spent / 1_000_000,
  }));

  // Monthly total spend line
  const lineData = MONTHLY_TREND.map(m => ({
    month: m.month,
    "Total Spend": (m.Engineering + m.HR + m.Finance + m.Marketing + m.Sales + m.Operations) / 1_000_000,
  }));

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl"
            style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", boxShadow: "0 4px 14px rgba(245,158,11,0.35)" }}>
            <PieChartIcon size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.3px" }}>Budget Overview</h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Annual department budget allocation &amp; utilization — FY 2026</p>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>
              Finance View
            </span>
            <button
              onClick={() => { saveBudgets(SEED_BUDGETS); notify("Budgets reset to defaults"); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition-all"
              style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              <RefreshCw size={13} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* ── KPI Strip ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Budget",      value: fmt(totalAlloc),  icon: DollarSign,   color: "#6366F1", bg: "rgba(99,102,241,0.08)",  sub: `${budgets.length} departments`       },
          { label: "Utilized",          value: fmt(totalSpent),  icon: BarChart2,    color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  sub: `${utilPct}% of total`                 },
          { label: "Remaining",         value: fmt(totalRemain > 0 ? totalRemain : 0), icon: TrendingUp, color: "#10B981", bg: "rgba(16,185,129,0.08)", sub: `${100 - utilPct}% headroom` },
          { label: "Over Budget",       value: String(overCount), icon: AlertTriangle, color: "#EF4444", bg: "rgba(239,68,68,0.08)", sub: `${warnCount} at warning level`         },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 500, marginBottom: "6px" }}>{s.label}</p>
                <p style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>{s.value}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "3px" }}>{s.sub}</p>
              </div>
              <div className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0" style={{ backgroundColor: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Total Utilization Bar ───────────────────────────────────────── */}
      <div className="rounded-2xl p-5 shadow-sm mb-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Overall Budget Utilization</h3>
          <span style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 800 }}>{utilPct}%</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: "12px", backgroundColor: "var(--border)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(utilPct, 100)}%`,
              background: utilPct >= 100 ? "linear-gradient(90deg,#EF4444,#DC2626)"
                        : utilPct >= 85  ? "linear-gradient(90deg,#F59E0B,#D97706)"
                        :                  "linear-gradient(90deg,#10B981,#059669)",
            }} />
        </div>
        <div className="flex justify-between mt-2">
          <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{fmt(totalSpent)} spent</span>
          <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{fmt(totalAlloc)} total</span>
        </div>
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Bar chart — allocated vs spent */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Allocated vs Spent (₹M)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
              <Tooltip formatter={(v: number) => [`₹${v.toFixed(2)}M`]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "var(--muted-foreground)" }} />
              <Bar dataKey="Allocated" fill="#6366F1" radius={[6,6,0,0]} fillOpacity={0.8} />
              <Bar dataKey="Spent"     fill="#F59E0B" radius={[6,6,0,0]} fillOpacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart — monthly trend */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Monthly Spend Trend (₹M)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => [`₹${v.toFixed(2)}M`]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="Total Spend" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Department Cards Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
        {budgets.map(b => {
          const p        = pct(b.spent, b.allocated);
          const remain   = b.allocated - b.spent;
          const status   = getBudgetStatus(b.spent, b.allocated);
          const barColor = status === "Over Budget" ? "#EF4444" : status === "Warning" ? "#F59E0B" : b.color;

          return (
            <div key={b.id} className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${b.color}20`, color: b.color }}>
                    {b.department.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>{b.department}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{b.lead}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={status} />
                  {canEdit && (
                    <button onClick={() => setEditing(b)}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                      title="Edit budget allocation">
                      <Edit2 size={13} style={{ color: "var(--muted-foreground)" }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="rounded-full overflow-hidden mb-2" style={{ height: "8px", backgroundColor: "var(--border)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(p, 100)}%`, backgroundColor: barColor }} />
              </div>

              {/* Figures */}
              <div className="flex justify-between mb-3">
                <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{p}% used</span>
                <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{fmt(b.allocated)} total</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Allocated", value: fmt(b.allocated), color: "#6366F1" },
                  { label: "Spent",     value: fmt(b.spent),     color: barColor  },
                  { label: remain >= 0 ? "Remaining" : "Over", value: fmt(Math.abs(remain)), color: remain >= 0 ? "#10B981" : "#EF4444" },
                ].map(c => (
                  <div key={c.label} className="text-center p-2 rounded-xl" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                    <p style={{ color: c.color, fontSize: "12px", fontWeight: 800 }}>{c.value}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "10px", marginTop: "1px" }}>{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Add dept placeholder — admin/finance only */}
        {canEdit && (
          <div className="rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 transition-all"
            style={{ backgroundColor: "var(--card)", border: "2px dashed var(--border)", minHeight: "190px" }}
            onClick={() => notify("Department management is available in the HR Panel.")}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(245,158,11,0.1)" }}>
              <Plus size={18} color="#F59E0B" />
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", fontWeight: 600 }}>Add Department</p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px", textAlign: "center" }}>Manage via HR Panel</p>
          </div>
        )}
      </div>

      {/* ── Department Table ────────────────────────────────────────────── */}
      <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Department Breakdown</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Full allocation details for all departments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Department budget table">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Department", "Lead", "Allocated", "Spent", "Remaining", "Utilization", "Status", canEdit ? "Actions" : ""].filter(Boolean).map(h => (
                  <th key={h} className="text-left px-5 py-3"
                    style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budgets.map(b => {
                const p       = pct(b.spent, b.allocated);
                const remain  = b.allocated - b.spent;
                const status  = getBudgetStatus(b.spent, b.allocated);
                const barCol  = status === "Over Budget" ? "#EF4444" : status === "Warning" ? "#F59E0B" : b.color;

                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                        <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{b.department}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{b.lead}</td>
                    <td className="px-5 py-3.5">
                      <span style={{ color: "#6366F1", fontSize: "13px", fontWeight: 700 }}>{fmt(b.allocated)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ color: barCol, fontSize: "13px", fontWeight: 700 }}>{fmt(b.spent)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ color: remain >= 0 ? "#10B981" : "#EF4444", fontSize: "13px", fontWeight: 700 }}>
                        {remain >= 0 ? fmt(remain) : `-${fmt(Math.abs(remain))}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full overflow-hidden" style={{ width: "80px", height: "6px", backgroundColor: "var(--border)" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(p, 100)}%`, backgroundColor: barCol }} />
                        </div>
                        <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700, minWidth: "36px" }}>{p}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={status} /></td>
                    {canEdit && (
                      <td className="px-5 py-3.5">
                        <button onClick={() => setEditing(b)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-all"
                          style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "none" }}>
                          <Edit2 size={11} /> Edit
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Modal ─────────────────────────────────────────────────── */}
      {editing && (
        <EditBudgetModal dept={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
          style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff" }}>
          <CheckCircle2 size={16} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{toast}</span>
          <button onClick={() => setToast("")}><X size={14} /></button>
        </div>
      )}
    </div>
  );
}
