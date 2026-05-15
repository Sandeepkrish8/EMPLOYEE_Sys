import { useState } from "react";
import {
  Users, Briefcase, Calendar, CheckCircle2, X,
  Plus, Pencil, Trash2, Save, Search,
} from "lucide-react";
import { employees as seedEmployees } from "../data/mockData";

// ── Types ──────────────────────────────────────────────────────────────────
interface HREmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
  phone: string;
}

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
  applicants: number;
  status: "Open" | "Closed" | "On Hold";
  postedDate: string;
}

// ── Seed data ──────────────────────────────────────────────────────────────
const toHREmployee = (e: typeof seedEmployees[0]): HREmployee => ({
  id: e.id, name: e.name, email: e.email, department: e.department,
  role: e.role, status: e.status as "Active" | "On Leave" | "Inactive",
  joinDate: e.joinDate, phone: e.phone,
});

const SEED_LEAVES: LeaveRequest[] = [
  { id: "LV-001", employee: "Sarah Johnson",   type: "Annual",  from: "2026-05-20", to: "2026-05-22", days: 3, status: "Pending",  reason: "Family vacation" },
  { id: "LV-002", employee: "Marcus Williams", type: "Sick",    from: "2026-05-15", to: "2026-05-15", days: 1, status: "Approved", reason: "Medical appointment" },
  { id: "LV-003", employee: "Yuki Tanaka",     type: "Annual",  from: "2026-06-01", to: "2026-06-05", days: 5, status: "Pending",  reason: "Personal travel" },
  { id: "LV-004", employee: "James Carter",    type: "Sick",    from: "2026-05-10", to: "2026-05-12", days: 3, status: "Approved", reason: "Recovery" },
  { id: "LV-005", employee: "Emily Rodriguez", type: "Casual",  from: "2026-05-25", to: "2026-05-25", days: 1, status: "Pending",  reason: "Personal errand" },
];

const SEED_JOBS: JobOpening[] = [
  { id: "JB-001", title: "Senior Frontend Developer", department: "Engineering", type: "Full-time",  applicants: 18, status: "Open",    postedDate: "2026-04-10" },
  { id: "JB-002", title: "HR Business Partner",        department: "HR",          type: "Full-time",  applicants:  9, status: "Open",    postedDate: "2026-04-15" },
  { id: "JB-003", title: "Financial Analyst",          department: "Finance",     type: "Full-time",  applicants: 12, status: "Open",    postedDate: "2026-04-20" },
  { id: "JB-004", title: "UX Designer",                department: "Design",      type: "Contract",   applicants:  4, status: "On Hold", postedDate: "2026-03-28" },
  { id: "JB-005", title: "Marketing Coordinator",      department: "Marketing",   type: "Part-time",  applicants:  7, status: "Closed",  postedDate: "2026-03-05" },
];

function useLocalState<T>(key: string, seed: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
  const [items, setItems] = useState<T[]>(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : seed;
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Active:   ["rgba(16,185,129,0.12)", "#10B981"],
    Approved: ["rgba(16,185,129,0.12)", "#10B981"],
    Open:     ["rgba(16,185,129,0.12)", "#10B981"],
    "On Leave":["rgba(245,158,11,0.12)","#F59E0B"],
    Pending:  ["rgba(245,158,11,0.12)", "#F59E0B"],
    "On Hold":["rgba(245,158,11,0.12)", "#F59E0B"],
    Inactive: ["rgba(239,68,68,0.12)",  "#EF4444"],
    Rejected: ["rgba(239,68,68,0.12)",  "#EF4444"],
    Closed:   ["rgba(239,68,68,0.12)",  "#EF4444"],
  };
  const [bg, text] = map[status] ?? ["rgba(99,102,241,0.12)", "#6366F1"];
  return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color: text }}>{status}</span>;
}

// ── Employee Modal ─────────────────────────────────────────────────────────
function EmpModal({ emp, onSave, onClose }: { emp: Partial<HREmployee> | null; onSave: (e: HREmployee) => void; onClose: () => void }) {
  const [f, setF] = useState<Partial<HREmployee>>(emp || { status: "Active" });
  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email) return;
    onSave({ id: f.id || `EMP${Date.now()}`, name: f.name!, email: f.email!, department: f.department || "Engineering", role: f.role || "Employee", status: f.status || "Active", joinDate: f.joinDate || new Date().toISOString().split("T")[0], phone: f.phone || "" });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>{f.id ? "Edit Employee" : "Add Employee"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X size={16} /></button>
        </div>
        <form onSubmit={sub} className="space-y-4">
          {[
            { l: "Full Name",   k: "name",       t: "text",  p: "Jane Doe"          },
            { l: "Email",       k: "email",       t: "email", p: "jane@company.com"  },
            { l: "Phone",       k: "phone",       t: "tel",   p: "+1 (555) 000-0000" },
            { l: "Department",  k: "department",  t: "text",  p: "Engineering"       },
            { l: "Role",        k: "role",        t: "text",  p: "Software Engineer" },
            { l: "Join Date",   k: "joinDate",    t: "date",  p: ""                  },
          ].map(({ l, k, t, p }) => (
            <div key={k}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>{l}</label>
              <input type={t} required={["name","email"].includes(k)} placeholder={p} value={(f as any)[k] || ""} onChange={(e) => setF({ ...f, [k]: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Status</label>
            <select value={f.status || "Active"} onChange={(e) => setF({ ...f, status: e.target.value as HREmployee["status"] })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              <option>Active</option><option>On Leave</option><option>Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)", color: "#fff", border: "none" }}><Save size={14} /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export function HRPanel() {
  const [empList, setEmpList]   = useLocalState<HREmployee>("hr_employees", seedEmployees.map(toHREmployee));
  const [leaves, setLeaves]     = useLocalState<LeaveRequest>("hr_leaves", SEED_LEAVES);
  const [jobs, setJobs]         = useLocalState<JobOpening>("hr_jobs", SEED_JOBS);
  const [tab, setTab]           = useState<"employees" | "leaves" | "jobs">("employees");
  const [modal, setModal]       = useState<Partial<HREmployee> | null | "new">(null);
  const [search, setSearch]     = useState("");
  const [delId, setDelId]       = useState<string | null>(null);

  const filtered = empList.filter(
    e => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaveEmp = (e: HREmployee) => {
    setEmpList(p => p.some(x => x.id === e.id) ? p.map(x => x.id === e.id ? e : x) : [...p, e]);
    setModal(null);
  };

  const approveLeave  = (id: string) => setLeaves(p => p.map(l => l.id === id ? { ...l, status: "Approved" } : l));
  const rejectLeave   = (id: string) => setLeaves(p => p.map(l => l.id === id ? { ...l, status: "Rejected" } : l));
  const toggleJob     = (id: string) => setJobs(p => p.map(j => j.id === id ? { ...j, status: j.status === "Open" ? "Closed" : "Open" } : j));

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl" style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)" }}>
            <Users size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>HR Panel</h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Employees, leave approvals & recruitment</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#0EA5E9", color: "#fff" }}>HR</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: empList.length,                             icon: Users,       color: "#0EA5E9", bg: "rgba(14,165,233,0.08)"  },
          { label: "Active",          value: empList.filter(e=>e.status==="Active").length, icon: CheckCircle2, color: "#10B981", bg: "rgba(16,185,129,0.08)"  },
          { label: "Leave Pending",   value: leaves.filter(l=>l.status==="Pending").length, icon: Calendar,   color: "#F59E0B", bg: "rgba(245,158,11,0.08)"  },
          { label: "Open Positions",  value: jobs.filter(j=>j.status==="Open").length,  icon: Briefcase,   color: "#6366F1", bg: "rgba(99,102,241,0.08)"  },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl w-10 h-10" style={{ backgroundColor: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 500 }}>{s.label}</p>
                <p style={{ color: "var(--foreground)", fontSize: "22px", fontWeight: 800 }}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["employees", "leaves", "jobs"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
            style={tab === t
              ? { background: "linear-gradient(135deg,#0EA5E9,#0284C7)", color: "#fff", border: "none" }
              : { backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
            {t === "employees" ? `👥 Employees (${empList.length})` : t === "leaves" ? `📅 Leave Requests (${leaves.length})` : `💼 Job Openings (${jobs.length})`}
          </button>
        ))}
      </div>

      {/* Employees Table */}
      {tab === "employees" && (
        <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between p-5 flex-wrap gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Employee Records</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none w-48"
                  style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
              </div>
              <button onClick={() => setModal("new")} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)", color: "#fff", border: "none" }}>
                <Plus size={15} /> Add Employee
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Name", "Email", "Department", "Role", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3" style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "rgba(14,165,233,0.15)", color: "#0EA5E9" }}>{e.name.charAt(0)}</div>
                        <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{e.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{e.email}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px" }}>{e.department}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{e.role}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={e.status} /></td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{e.joinDate}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(e)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Pencil size={14} color="#6366F1" /></button>
                        <button onClick={() => setDelId(e.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Trash2 size={14} color="#EF4444" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Approvals */}
      {tab === "leaves" && (
        <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Leave Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Employee", "Type", "From", "To", "Days", "Reason", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3" style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaves.map(lv => (
                  <tr key={lv.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{lv.employee}</td>
                    <td className="px-5 py-3.5"><span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}>{lv.type}</span></td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{lv.from}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{lv.to}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{lv.days}d</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px", maxWidth: "160px" }}>{lv.reason}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={lv.status} /></td>
                    <td className="px-5 py-3.5">
                      {lv.status === "Pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => approveLeave(lv.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Approve"><CheckCircle2 size={15} color="#10B981" /></button>
                          <button onClick={() => rejectLeave(lv.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Reject"><X size={15} color="#EF4444" /></button>
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

      {/* Job Openings */}
      {tab === "jobs" && (
        <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Job Openings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Position", "Department", "Type", "Applicants", "Posted", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3" style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{j.title}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{j.department}</td>
                    <td className="px-5 py-3.5"><span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}>{j.type}</span></td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{j.applicants}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{j.postedDate}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={j.status} /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleJob(j.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                        style={j.status === "Open"
                          ? { backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }
                          : { backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                        {j.status === "Open" ? "Close" : "Reopen"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal !== null && (
        <EmpModal emp={modal === "new" ? null : (modal as HREmployee)} onSave={handleSaveEmp} onClose={() => setModal(null)} />
      )}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Delete Employee?</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "20px" }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
              <button onClick={() => { setEmpList(p => p.filter(e => e.id !== delId)); setDelId(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", border: "none" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
