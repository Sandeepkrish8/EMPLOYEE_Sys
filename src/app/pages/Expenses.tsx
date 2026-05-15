import { useState } from "react";
import {
  Receipt, Plus, X, Save, CheckCircle2, Clock, Filter,
  TrendingUp, Wallet, AlertCircle, BarChart2, ChevronDown,
} from "lucide-react";
import { getCurrentUserRole, UserRole } from "../config/roles";

// ── Types ──────────────────────────────────────────────────────────────────
type ExpenseStatus = "Pending" | "Approved" | "Rejected";

interface Expense {
  id: string;
  employee: string;
  employeeRole: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt: string;
  status: ExpenseStatus;
  submittedOn: string;
  reviewedBy?: string;
  reviewNote?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = ["Travel", "Equipment", "Software", "Training", "Meals", "Office Supplies", "Medical", "Marketing", "Other"];

const CATEGORY_COLORS: Record<string, [string, string]> = {
  Travel:           ["rgba(99,102,241,0.12)",  "#6366F1"],
  Equipment:        ["rgba(14,165,233,0.12)",  "#0EA5E9"],
  Software:         ["rgba(16,185,129,0.12)",  "#10B981"],
  Training:         ["rgba(245,158,11,0.12)",  "#F59E0B"],
  Meals:            ["rgba(239,68,68,0.12)",   "#EF4444"],
  "Office Supplies":["rgba(124,58,237,0.12)",  "#7C3AED"],
  Medical:          ["rgba(236,72,153,0.12)",  "#EC4899"],
  Marketing:        ["rgba(5,150,105,0.12)",   "#059669"],
  Other:            ["rgba(100,116,139,0.12)", "#64748B"],
};

const SEED_EXPENSES: Expense[] = [
  { id: "EXP-001", employee: "Sarah Johnson",   employeeRole: "employee",  amount: 12500, category: "Travel",           description: "NYC conference travel & hotel",      date: "2026-04-02", receipt: "NYC_trip.pdf",    status: "Approved",  submittedOn: "2026-04-03", reviewedBy: "Finance Team", reviewNote: "Approved — within limit" },
  { id: "EXP-002", employee: "Marcus Williams", employeeRole: "manager",   amount:  4200, category: "Equipment",        description: "Mechanical keyboard for dev work",   date: "2026-04-08", receipt: "KB_invoice.pdf",  status: "Pending",   submittedOn: "2026-04-08" },
  { id: "EXP-003", employee: "Yuki Tanaka",     employeeRole: "employee",  amount:  1800, category: "Software",         description: "Figma annual license",               date: "2026-04-10", receipt: "figma_receipt.pdf",status: "Approved", submittedOn: "2026-04-10", reviewedBy: "Finance Team" },
  { id: "EXP-004", employee: "James Carter",    employeeRole: "employee",  amount:  9600, category: "Travel",           description: "Boston client visit (cancelled)",    date: "2026-04-12", receipt: "boston_trip.pdf", status: "Rejected",  submittedOn: "2026-04-12", reviewedBy: "Finance Team", reviewNote: "Trip was cancelled — not reimbursable" },
  { id: "EXP-005", employee: "Emily Rodriguez", employeeRole: "hr",        amount:  3300, category: "Training",         description: "SHRM HR certification course",       date: "2026-04-15", receipt: "shrm_cert.pdf",   status: "Pending",   submittedOn: "2026-04-15" },
  { id: "EXP-006", employee: "Alex Kim",        employeeRole: "manager",   amount:  2100, category: "Meals",            description: "Team lunch — quarterly review",      date: "2026-04-18", receipt: "lunch_bill.pdf",  status: "Approved",  submittedOn: "2026-04-18", reviewedBy: "Finance Team" },
  { id: "EXP-007", employee: "Priya Patel",     employeeRole: "employee",  amount:   850, category: "Office Supplies",  description: "Ergonomic mouse + desk mat",         date: "2026-04-20", receipt: "amazon_order.pdf",status: "Pending",   submittedOn: "2026-04-20" },
  { id: "EXP-008", employee: "David Chen",      employeeRole: "employee",  amount:  5500, category: "Marketing",        description: "LinkedIn ad campaign boost",         date: "2026-04-22", receipt: "li_campaign.pdf", status: "Approved",  submittedOn: "2026-04-22", reviewedBy: "Finance Team" },
];

function useExpenseStore(): [Expense[], (exps: Expense[]) => void] {
  const key = "nexus_expenses";
  const [items, setItems] = useState<Expense[]>(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : SEED_EXPENSES;
  });
  const save = (exps: Expense[]) => {
    setItems(exps);
    localStorage.setItem(key, JSON.stringify(exps));
  };
  return [items, save];
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ExpenseStatus }) {
  const map: Record<ExpenseStatus, [string, string, React.ElementType]> = {
    Approved: ["rgba(16,185,129,0.12)",  "#10B981", CheckCircle2],
    Pending:  ["rgba(245,158,11,0.12)",  "#F59E0B", Clock],
    Rejected: ["rgba(239,68,68,0.12)",   "#EF4444", X],
  };
  const [bg, color, Icon] = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color }}>
      <Icon size={11} />
      {status}
    </span>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const [bg, color] = CATEGORY_COLORS[cat] ?? ["rgba(100,116,139,0.12)", "#64748B"];
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: bg, color }}>
      {cat}
    </span>
  );
}

// ── Submit / Edit Modal ────────────────────────────────────────────────────
interface ModalProps {
  initial: Partial<Expense> | null;
  userName: string;
  userRole: string;
  onSave: (e: Expense) => void;
  onClose: () => void;
}

function ExpenseModal({ initial, userName, userRole, onSave, onClose }: ModalProps) {
  const [f, setF] = useState<Partial<Expense>>(
    initial || { employee: userName, employeeRole: userRole, category: "Travel", status: "Pending" }
  );

  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.amount || !f.description || !f.date) return;
    onSave({
      id:           f.id || `EXP-${Date.now()}`,
      employee:     f.employee || userName,
      employeeRole: f.employeeRole || userRole,
      amount:       Number(f.amount),
      category:     f.category || "Other",
      description:  f.description!,
      date:         f.date!,
      receipt:      f.receipt || "—",
      status:       f.status as ExpenseStatus || "Pending",
      submittedOn:  f.submittedOn || new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)" }}>
              <Receipt size={16} color="#fff" />
            </div>
            <h2 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>
              {f.id ? "Edit Expense" : "Submit Expense"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X size={16} /></button>
        </div>

        <form onSubmit={sub} className="space-y-4">
          {/* Row: Amount + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Amount (₹) *</label>
              <input type="number" required min="1" placeholder="5000" value={f.amount || ""}
                onChange={e => setF({ ...f, amount: Number(e.target.value) })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Category *</label>
              <select value={f.category || "Travel"} onChange={e => setF({ ...f, category: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Description *</label>
            <textarea required rows={2} placeholder="Brief description of the expense…"
              value={f.description || ""} onChange={e => setF({ ...f, description: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
          </div>

          {/* Row: Date + Receipt ref */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Expense Date *</label>
              <input type="date" required value={f.date || ""} onChange={e => setF({ ...f, date: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Receipt / Ref</label>
              <input type="text" placeholder="invoice.pdf" value={f.receipt || ""}
                onChange={e => setF({ ...f, receipt: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              Cancel
            </button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff", border: "none" }}>
              <Save size={14} /> Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Review Note Modal ──────────────────────────────────────────────────────
function ReviewModal({ expId, onConfirm, onClose }: { expId: string; onConfirm: (note: string) => void; onClose: () => void }) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-sm rounded-2xl p-5 shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>Add Review Note (optional)</h3>
        <textarea rows={3} placeholder="Reason or note for this decision…" value={note} onChange={e => setNote(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none mb-4"
          style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
          <button onClick={() => onConfirm(note)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function Expenses() {
  const currentRole = getCurrentUserRole();
  const isFinanceAdmin = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FINANCE].includes(currentRole as UserRole);

  const userName  = sessionStorage.getItem("userFullName") || "Current User";
  const userRole  = sessionStorage.getItem("userRole")     || "employee";
  const initials  = userName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const [expenses, saveExpenses]   = useExpenseStore();
  const [modal, setModal]          = useState<Partial<Expense> | null | "new">(null);
  const [reviewTarget, setReviewTarget] = useState<{ id: string; action: "Approved" | "Rejected" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCat, setFilterCat]  = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast]          = useState("");

  // What each view sees
  const myExpenses   = expenses.filter(e => e.employee === userName);
  const viewExpenses = isFinanceAdmin ? expenses : myExpenses;

  const filtered = viewExpenses.filter(e => {
    const okStatus = filterStatus === "All" || e.status === filterStatus;
    const okCat    = filterCat    === "All" || e.category === filterCat;
    return okStatus && okCat;
  });

  // Stats
  const totalAmount  = viewExpenses.reduce((s, e) => s + e.amount, 0);
  const approved     = viewExpenses.filter(e => e.status === "Approved");
  const pending      = viewExpenses.filter(e => e.status === "Pending");
  const rejected     = viewExpenses.filter(e => e.status === "Rejected");
  const approvedAmt  = approved.reduce((s, e) => s + e.amount, 0);
  const pendingAmt   = pending.reduce((s, e) => s + e.amount, 0);

  // Category spend breakdown (top 4)
  const catBreakdown = CATEGORIES.map(cat => ({
    cat,
    amount: viewExpenses.filter(e => e.category === cat && e.status !== "Rejected").reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 4);

  const handleSave = (exp: Expense) => {
    saveExpenses(expenses.some(e => e.id === exp.id)
      ? expenses.map(e => e.id === exp.id ? exp : e)
      : [...expenses, exp]);
    setModal(null);
    notify("Expense submitted successfully!");
  };

  const review = (id: string, status: "Approved" | "Rejected", note: string) => {
    saveExpenses(expenses.map(e => e.id === id
      ? { ...e, status, reviewedBy: userName, reviewNote: note || undefined }
      : e));
    setReviewTarget(null);
    notify(`Expense ${status.toLowerCase()} successfully`);
  };

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fmt = (n: number) => `₹${n.toLocaleString()}`;

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl"
            style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
            <Receipt size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.3px" }}>
              {isFinanceAdmin ? "Expense Management" : "My Expenses"}
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
              {isFinanceAdmin ? "Review and manage all employee expense claims" : "Submit and track your expense reimbursements"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Role badge */}
          {!isFinanceAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff" }}>{initials}</div>
              <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{userName}</span>
            </div>
          )}
          <button
            onClick={() => setModal("new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff", border: "none" }}>
            <Plus size={15} /> New Expense
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: isFinanceAdmin ? "Total Submitted" : "Total Claimed", value: fmt(totalAmount), icon: Wallet,       color: "#6366F1", bg: "rgba(99,102,241,0.08)",   sub: `${viewExpenses.length} claims`     },
          { label: "Approved",                                            value: fmt(approvedAmt), icon: CheckCircle2, color: "#10B981", bg: "rgba(16,185,129,0.08)",   sub: `${approved.length} claims`         },
          { label: "Pending Review",                                      value: fmt(pendingAmt),  icon: Clock,        color: "#F59E0B", bg: "rgba(245,158,11,0.08)",   sub: `${pending.length} awaiting`        },
          { label: "Rejected",                                            value: String(rejected.length), icon: AlertCircle, color: "#EF4444", bg: "rgba(239,68,68,0.08)", sub: `${fmt(rejected.reduce((s,e)=>s+e.amount,0))}` },
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

      {/* ── Category Breakdown + Filter Row ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Category spend */}
        <div className="lg:col-span-2 rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} color="#6366F1" />
            <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Spend by Category</h3>
          </div>
          <div className="space-y-3">
            {catBreakdown.length === 0
              ? <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>No expense data yet.</p>
              : catBreakdown.map(({ cat, amount }) => {
                  const pct = Math.round((amount / totalAmount) * 100);
                  const [bg, color] = CATEGORY_COLORS[cat] ?? ["rgba(100,116,139,0.12)", "#64748B"];
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 500 }}>{cat}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{pct}%</span>
                          <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700, minWidth: "80px", textAlign: "right" }}>{fmt(amount)}</span>
                        </div>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "var(--border)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="rounded-2xl p-5 shadow-sm flex flex-col gap-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={15} color="#6366F1" />
            <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Quick Stats</h3>
          </div>
          {[
            { label: "Approval Rate",  value: viewExpenses.length ? `${Math.round((approved.length / viewExpenses.length) * 100)}%` : "—", color: "#10B981" },
            { label: "Avg Claim Size", value: viewExpenses.length ? fmt(Math.round(totalAmount / viewExpenses.length)) : "—",              color: "#6366F1" },
            { label: "Pending Amount", value: fmt(pendingAmt),                                                                              color: "#F59E0B" },
            { label: "This Month",     value: fmt(viewExpenses.filter(e => e.date.startsWith("2026-04")).reduce((s,e)=>s+e.amount, 0)),      color: "#0EA5E9" },
          ].map(q => (
            <div key={q.label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{q.label}</span>
              <span style={{ color: q.color, fontSize: "15px", fontWeight: 800 }}>{q.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        {/* Table header row */}
        <div className="flex items-center justify-between p-5 flex-wrap gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>
              {isFinanceAdmin ? "All Expense Claims" : "My Claims"}
            </h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{filtered.length} records</p>
          </div>

          {/* Filters toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: showFilters ? "rgba(99,102,241,0.1)" : "var(--secondary)",
                border: showFilters ? "1px solid #6366F1" : "1px solid var(--border)",
                color: showFilters ? "#6366F1" : "var(--foreground)",
              }}
            >
              <Filter size={13} /> Filters <ChevronDown size={13} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
          </div>
        </div>

        {/* Filter pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 px-5 py-3" style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 600 }}>Status:</span>
              {["All", "Pending", "Approved", "Rejected"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={filterStatus === s
                    ? { background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff", border: "none" }
                    : { backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 600 }}>Category:</span>
              {["All", ...CATEGORIES].map(c => (
                <button key={c} onClick={() => setFilterCat(c)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={filterCat === c
                    ? { background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff", border: "none" }
                    : { backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Table body */}
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Expense claims table">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  isFinanceAdmin ? "Employee" : null,
                  "Description", "Category", "Amount", "Date", "Status",
                  isFinanceAdmin ? "Actions" : "Review Note",
                ].filter(Boolean).map(h => (
                  <th key={h!} className="text-left px-5 py-3"
                    style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
                    No expense claims found.
                  </td>
                </tr>
              ) : filtered.map(exp => (
                <tr key={exp.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                  {/* Employee col — finance/admin only */}
                  {isFinanceAdmin && (
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "#6366F1" }}>
                          {exp.employee.split(" ").map(w => w[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{exp.employee}</p>
                          <p style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "capitalize" }}>{exp.employeeRole}</p>
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="px-5 py-3.5" style={{ maxWidth: "220px" }}>
                    <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.description}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "1px" }}>{exp.receipt}</p>
                  </td>

                  <td className="px-5 py-3.5"><CategoryBadge cat={exp.category} /></td>

                  <td className="px-5 py-3.5">
                    <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 800 }}>{fmt(exp.amount)}</span>
                  </td>

                  <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "12px", whiteSpace: "nowrap" }}>
                    <p>{exp.date}</p>
                    <p style={{ fontSize: "10px" }}>Submitted {exp.submittedOn}</p>
                  </td>

                  <td className="px-5 py-3.5"><StatusBadge status={exp.status} /></td>

                  {/* Actions (finance/admin) OR Review note (employee) */}
                  {isFinanceAdmin ? (
                    <td className="px-5 py-3.5">
                      {exp.status === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReviewTarget({ id: exp.id, action: "Approved" })}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                            style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981", border: "none" }}>
                            <CheckCircle2 size={12} /> Approve
                          </button>
                          <button
                            onClick={() => setReviewTarget({ id: exp.id, action: "Rejected" })}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                            style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444", border: "none" }}>
                            <X size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
                          {exp.reviewedBy ? `By ${exp.reviewedBy}` : "—"}
                        </p>
                      )}
                    </td>
                  ) : (
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "12px", maxWidth: "160px" }}>
                      {exp.reviewNote || (exp.status === "Pending" ? "Awaiting review" : "—")}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Submit Modal ───────────────────────────────────────────────── */}
      {modal !== null && (
        <ExpenseModal
          initial={modal === "new" ? null : (modal as Expense)}
          userName={userName}
          userRole={userRole}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* ── Review Note Modal ──────────────────────────────────────────── */}
      {reviewTarget && (
        <ReviewModal
          expId={reviewTarget.id}
          onConfirm={(note) => review(reviewTarget.id, reviewTarget.action, note)}
          onClose={() => setReviewTarget(null)}
        />
      )}

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
          style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff" }}>
          <CheckCircle2 size={16} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{toast}</span>
          <button onClick={() => setToast("")}><X size={14} /></button>
        </div>
      )}
    </div>
  );
}
