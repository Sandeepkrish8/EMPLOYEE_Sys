import { useState } from "react";
import {
  DollarSign, FileText, TrendingUp, AlertCircle,
  Plus, Pencil, Trash2, X, Save, CheckCircle2, Clock,
} from "lucide-react";

// ── Mock data types ────────────────────────────────────────────────────────
type InvoiceStatus = "Paid" | "Pending" | "Overdue";
type ExpenseStatus = "Approved" | "Pending" | "Rejected";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  description: string;
}

interface Expense {
  id: string;
  employee: string;
  amount: number;
  category: string;
  status: ExpenseStatus;
  date: string;
  description: string;
}

// ── Seed data ──────────────────────────────────────────────────────────────
const SEED_INVOICES: Invoice[] = [
  { id: "INV-001", client: "Acme Corp",        amount: 128000, status: "Paid",    date: "2026-04-01", dueDate: "2026-04-15", description: "Q1 Software License" },
  { id: "INV-002", client: "GlobalTech Ltd",   amount:  85000, status: "Pending", date: "2026-04-10", dueDate: "2026-04-30", description: "Consulting Services" },
  { id: "INV-003", client: "NovaSys Inc",       amount:  62500, status: "Overdue", date: "2026-03-20", dueDate: "2026-04-05", description: "Maintenance Contract" },
  { id: "INV-004", client: "BlueWave Partners", amount: 200000, status: "Paid",    date: "2026-04-14", dueDate: "2026-04-28", description: "Platform Integration" },
  { id: "INV-005", client: "Delta Finance",     amount:  45000, status: "Pending", date: "2026-04-20", dueDate: "2026-05-05", description: "Annual Support Plan"  },
];

const SEED_EXPENSES: Expense[] = [
  { id: "EXP-001", employee: "Sarah Johnson",  amount: 12500, category: "Travel",    status: "Approved", date: "2026-04-02", description: "NYC Conference trip" },
  { id: "EXP-002", employee: "Marcus Williams",amount:  4200, category: "Equipment", status: "Pending",  date: "2026-04-08", description: "New laptop request"  },
  { id: "EXP-003", employee: "Yuki Tanaka",    amount:  1800, category: "Software",  status: "Approved", date: "2026-04-10", description: "Design tool license" },
  { id: "EXP-004", employee: "James Carter",   amount:  9600, category: "Travel",    status: "Rejected", date: "2026-04-12", description: "Boston trip (cancelled)" },
  { id: "EXP-005", employee: "Emily Rodriguez",amount:  3300, category: "Training",  status: "Pending",  date: "2026-04-15", description: "HR certification course" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function useLocalState<T>(key: string, seed: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
  const [items, setItems] = useState<T[]>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : seed;
  });
  const setAndSave: React.Dispatch<React.SetStateAction<T[]>> = (val) => {
    setItems((prev) => {
      const next = typeof val === "function" ? (val as (p: T[]) => T[])(prev) : val;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return [items, setAndSave];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Paid:     { bg: "rgba(16,185,129,0.12)",  text: "#10B981" },
  Pending:  { bg: "rgba(245,158,11,0.12)",  text: "#F59E0B" },
  Overdue:  { bg: "rgba(239,68,68,0.12)",   text: "#EF4444" },
  Approved: { bg: "rgba(16,185,129,0.12)",  text: "#10B981" },
  Rejected: { bg: "rgba(239,68,68,0.12)",   text: "#EF4444" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "rgba(99,102,241,0.12)", text: "#6366F1" };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function fmt(n: number) { return `₹${n.toLocaleString()}`; }

// ── Invoice Modal ──────────────────────────────────────────────────────────
function InvoiceModal({ inv, onSave, onClose }: { inv: Partial<Invoice> | null; onSave: (i: Invoice) => void; onClose: () => void }) {
  const [f, setF] = useState<Partial<Invoice>>(inv || { status: "Pending" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.client || !f.amount) return;
    onSave({ id: f.id || `INV-${Date.now()}`, client: f.client!, amount: Number(f.amount), status: f.status as InvoiceStatus || "Pending", date: f.date || new Date().toISOString().split("T")[0], dueDate: f.dueDate || "", description: f.description || "" });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>{f.id ? "Edit Invoice" : "New Invoice"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X size={16} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {[
            { l: "Client",      k: "client",      t: "text",   p: "Acme Corp"  },
            { l: "Amount (₹)",  k: "amount",      t: "number", p: "50000"       },
            { l: "Invoice Date",k: "date",         t: "date",   p: ""            },
            { l: "Due Date",    k: "dueDate",      t: "date",   p: ""            },
            { l: "Description", k: "description",  t: "text",   p: "Details…"   },
          ].map(({ l, k, t, p }) => (
            <div key={k}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>{l}</label>
              <input type={t} required={["client","amount"].includes(k)} placeholder={p} value={(f as any)[k] || ""} onChange={(e) => setF({ ...f, [k]: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Status</label>
            <select value={f.status || "Pending"} onChange={(e) => setF({ ...f, status: e.target.value as InvoiceStatus })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              <option>Pending</option><option>Paid</option><option>Overdue</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none" }}><Save size={14} /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export function FinancePanel() {
  const [invoices, setInvoices]   = useLocalState<Invoice>("fin_invoices", SEED_INVOICES);
  const [expenses, setExpenses]   = useLocalState<Expense>("fin_expenses", SEED_EXPENSES);
  const [invModal, setInvModal]   = useState<Partial<Invoice> | null | "new">(null);
  const [tab, setTab]             = useState<"invoices" | "expenses">("invoices");
  const [delId, setDelId]         = useState<string | null>(null);

  const totalRevenue   = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending        = invoices.filter(i => i.status === "Pending").length;
  const overdue        = invoices.filter(i => i.status === "Overdue").length;
  const expPending     = expenses.filter(e => e.status === "Pending").length;

  const handleSaveInv = (inv: Invoice) => {
    setInvoices((p) => p.some(i => i.id === inv.id) ? p.map(i => i.id === inv.id ? inv : i) : [...p, inv]);
    setInvModal(null);
  };
  const handleDelInv = (id: string) => { setInvoices((p) => p.filter(i => i.id !== id)); setDelId(null); };
  const toggleExpStatus = (id: string, status: ExpenseStatus) =>
    setExpenses((p) => p.map(e => e.id === id ? { ...e, status } : e));

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl" style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
            <DollarSign size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>Finance Panel</h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Invoices, expenses & financial reports</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#F59E0B", color: "#fff" }}>Finance</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Revenue Collected", value: fmt(totalRevenue),  icon: DollarSign,   color: "#10B981", bg: "rgba(16,185,129,0.08)"  },
          { label: "Pending Invoices",  value: String(pending),    icon: Clock,        color: "#F59E0B", bg: "rgba(245,158,11,0.08)"  },
          { label: "Overdue Invoices",  value: String(overdue),    icon: AlertCircle,  color: "#EF4444", bg: "rgba(239,68,68,0.08)"   },
          { label: "Expense Reports",   value: String(expPending), icon: TrendingUp,   color: "#6366F1", bg: "rgba(99,102,241,0.08)"  },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl w-10 h-10" style={{ backgroundColor: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 500 }}>{s.label}</p>
                <p style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800 }}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["invoices", "expenses"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
            style={tab === t
              ? { background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", border: "none" }
              : { backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
            {t === "invoices" ? `📄 Invoices (${invoices.length})` : `🧾 Expenses (${expenses.length})`}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      {tab === "invoices" && (
        <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Invoices</h2>
            <button onClick={() => setInvModal("new")} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", border: "none" }}>
              <Plus size={15} /> New Invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Client", "Amount", "Status", "Date", "Due Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3" style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{inv.id}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{inv.client}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{fmt(inv.amount)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{inv.date}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{inv.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => setInvModal(inv)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Pencil size={14} color="#6366F1" /></button>
                        <button onClick={() => setDelId(inv.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Trash2 size={14} color="#EF4444" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      {tab === "expenses" && (
        <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Expense Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Employee", "Amount", "Category", "Description", "Date", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3" style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{exp.employee}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{fmt(exp.amount)}</td>
                    <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}>{exp.category}</span></td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{exp.description}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{exp.date}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={exp.status} /></td>
                    <td className="px-5 py-3.5">
                      {exp.status === "Pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => toggleExpStatus(exp.id, "Approved")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Approve"><CheckCircle2 size={15} color="#10B981" /></button>
                          <button onClick={() => toggleExpStatus(exp.id, "Rejected")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Reject"><X size={15} color="#EF4444" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invModal !== null && (
        <InvoiceModal inv={invModal === "new" ? null : (invModal as Invoice)} onSave={handleSaveInv} onClose={() => setInvModal(null)} />
      )}

      {/* Delete Confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Delete Invoice?</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "20px" }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
              <button onClick={() => handleDelInv(delId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", border: "none" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
