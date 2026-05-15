import { useState } from "react";
import {
  User, CalendarDays, Wallet, CheckCircle2, Clock, X, Send,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveEntry {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function useLocalLeaves(): [LeaveEntry[], (e: LeaveEntry) => void] {
  const key = "emp_leaves";
  const [leaves, setLeaves] = useState<LeaveEntry[]>(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : [
      { id: "L001", type: "Annual",  from: "2026-03-10", to: "2026-03-12", days: 3, reason: "Family event",       status: "Approved", appliedOn: "2026-03-01" },
      { id: "L002", type: "Sick",    from: "2026-04-02", to: "2026-04-02", days: 1, reason: "Not feeling well",   status: "Approved", appliedOn: "2026-04-02" },
      { id: "L003", type: "Annual",  from: "2026-05-20", to: "2026-05-22", days: 3, reason: "Vacation",           status: "Pending",  appliedOn: "2026-04-25" },
    ] as LeaveEntry[];
  });
  const add = (entry: LeaveEntry) => {
    setLeaves((prev) => {
      const next = [...prev, entry];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return [leaves, add];
}

function daysBetween(from: string, to: string): number {
  const d1 = new Date(from), d2 = new Date(to);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
  return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1);
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  const map: Record<LeaveStatus, [string, string]> = {
    Approved: ["rgba(16,185,129,0.12)", "#10B981"],
    Pending:  ["rgba(245,158,11,0.12)", "#F59E0B"],
    Rejected: ["rgba(239,68,68,0.12)",  "#EF4444"],
  };
  const [bg, text] = map[status];
  return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color: text }}>{status}</span>;
}

// ── Mock payroll ───────────────────────────────────────────────────────────
const PAYROLL = { gross: 75000, pf: 3600, tax: 7500, other: 1200, net: 62700, month: "April 2026" };

// ── Main ───────────────────────────────────────────────────────────────────
export function EmployeePortal() {
  const name     = sessionStorage.getItem("userFullName") || "Employee";
  const email    = sessionStorage.getItem("userEmail")    || "employee@company.com";
  const role     = sessionStorage.getItem("userRole")     || "employee";
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const [leaves, addLeave] = useLocalLeaves();
  const [form, setForm]    = useState({ type: "Annual", from: "", to: "", reason: "" });
  const [toast, setToast]  = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [phone, setPhone]   = useState(sessionStorage.getItem("emp_phone") || "");
  const [address, setAddress] = useState(sessionStorage.getItem("emp_address") || "");

  const roleLabel: Record<string, string> = {
    employee: "Employee", manager: "Manager", hr: "HR", finance: "Finance", admin: "Admin", super_admin: "Super Admin",
  };

  const approved  = leaves.filter(l => l.status === "Approved").length;
  const pending   = leaves.filter(l => l.status === "Pending").length;
  const totalUsed = leaves.filter(l => l.status === "Approved").reduce((s, l) => s + l.days, 0);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason) return;
    addLeave({
      id: `L${Date.now()}`, type: form.type, from: form.from, to: form.to,
      days: daysBetween(form.from, form.to), reason: form.reason, status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    });
    setForm({ type: "Annual", from: "", to: "", reason: "" });
    setToast("Leave application submitted!");
    setTimeout(() => setToast(""), 3000);
  };

  const saveProfile = () => {
    sessionStorage.setItem("emp_phone", phone);
    sessionStorage.setItem("emp_address", address);
    setEditProfile(false);
    setToast("Profile updated!");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl" style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
            <User size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>Employee Portal</h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Your profile, leaves & payroll</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#2563EB", color: "#fff" }}>
          {roleLabel[role] || "Employee"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Profile Card */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff" }}>
              {initials}
            </div>
            <div>
              <p style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>{name}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{email}</p>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold mt-1 inline-block" style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#2563EB" }}>
                {roleLabel[role] || "Employee"}
              </span>
            </div>
          </div>

          {!editProfile ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs" style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                <span style={{ color: "var(--muted-foreground)" }}>Phone</span>
                <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{phone || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--muted-foreground)" }}>Address</span>
                <span style={{ color: "var(--foreground)", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{address || "—"}</span>
              </div>
              <button onClick={() => setEditProfile(true)} className="w-full mt-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-3" style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              {[
                { l: "Phone",   v: phone,   set: setPhone   },
                { l: "Address", v: address, set: setAddress },
              ].map(({ l, v, set }) => (
                <div key={l}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "4px" }}>{l}</label>
                  <input value={v} onChange={e => set(e.target.value)} placeholder={`Enter ${l.toLowerCase()}`}
                    className="w-full rounded-xl px-3 py-2 text-xs outline-none"
                    style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setEditProfile(false)} className="flex-1 py-2 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>Cancel</button>
                <button onClick={saveProfile} className="flex-1 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none" }}>Save</button>
              </div>
            </div>
          )}
        </div>

        {/* Leave Stats */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
            <CalendarDays size={15} style={{ display: "inline", marginRight: "6px", color: "#2563EB" }} />
            Leave Summary
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Used",     value: totalUsed, color: "#2563EB", bg: "rgba(37,99,235,0.08)"   },
              { label: "Approved", value: approved,  color: "#10B981", bg: "rgba(16,185,129,0.08)"  },
              { label: "Pending",  value: pending,   color: "#F59E0B", bg: "rgba(245,158,11,0.08)"  },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: s.bg }}>
                <p style={{ color: s.color, fontSize: "22px", fontWeight: 800 }}>{s.value}</p>
                <p style={{ color: s.color, fontSize: "10px", fontWeight: 600, opacity: 0.8 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: "var(--muted-foreground)" }}>Annual Balance</span>
              <span style={{ color: "var(--foreground)", fontWeight: 700 }}>30 days/yr</span>
            </div>
            <div className="w-full rounded-full" style={{ backgroundColor: "var(--border)", height: "6px" }}>
              <div className="rounded-full h-full" style={{ width: `${Math.min((totalUsed / 30) * 100, 100)}%`, background: "linear-gradient(90deg,#2563EB,#1D4ED8)" }} />
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: "10px", marginTop: "4px" }}>{totalUsed} used · {30 - totalUsed} remaining</p>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
            <Wallet size={15} style={{ display: "inline", marginRight: "6px", color: "#10B981" }} />
            Payroll — {PAYROLL.month}
          </h3>
          <div className="space-y-2.5">
            {[
              { l: "Gross Salary",       v: PAYROLL.gross,  c: "#10B981", icon: "+" },
              { l: "Provident Fund",     v: PAYROLL.pf,     c: "#EF4444", icon: "−" },
              { l: "Income Tax (TDS)",   v: PAYROLL.tax,    c: "#EF4444", icon: "−" },
              { l: "Other Deductions",   v: PAYROLL.other,  c: "#EF4444", icon: "−" },
            ].map(row => (
              <div key={row.l} className="flex justify-between items-center text-xs py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--muted-foreground)" }}>{row.l}</span>
                <span style={{ color: row.c, fontWeight: 700 }}>{row.icon} ₹{row.v.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>Net Pay</span>
              <span style={{ color: "#10B981", fontSize: "18px", fontWeight: 800 }}>₹{PAYROLL.net.toLocaleString()}</span>
            </div>
          </div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "10px", marginTop: "10px" }}>* Read-only. Contact Finance for queries.</p>
        </div>
      </div>

      {/* Leave Application */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
            <Send size={14} style={{ display: "inline", marginRight: "6px", color: "#2563EB" }} />
            Apply for Leave
          </h3>
          <form onSubmit={handleApplyLeave} className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Leave Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                <option>Annual</option><option>Sick</option><option>Casual</option><option>Maternity</option><option>Paternity</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "From", k: "from" },
                { l: "To",   k: "to"   },
              ].map(({ l, k }) => (
                <div key={k}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>{l}</label>
                  <input type="date" required value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "5px" }}>Reason</label>
              <textarea required rows={3} placeholder="Brief reason for leave…" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", border: "none" }}>
              <Send size={14} /> Submit Application
            </button>
          </form>
        </div>

        {/* Leave History */}
        <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>
              <Clock size={14} style={{ display: "inline", marginRight: "6px", color: "#2563EB" }} />
              Leave History
            </h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
            {leaves.length === 0 ? (
              <p className="text-center p-8" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>No leave records found.</p>
            ) : leaves.slice().reverse().map(l => (
              <div key={l.id} className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}>{l.type}</span>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{l.days} day{l.days > 1 ? "s" : ""}</span>
                  </div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{l.from} → {l.to}</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{l.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={l.status} />
                  <span style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>Applied {l.appliedOn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
          style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff" }}>
          <CheckCircle2 size={16} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{toast}</span>
          <button onClick={() => setToast("")}><X size={14} /></button>
        </div>
      )}
    </div>
  );
}
