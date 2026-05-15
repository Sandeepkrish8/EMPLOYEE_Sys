import { useState, useEffect } from "react";
import { Download, Play, ChevronDown, X, CheckCircle2, Loader2, AlertCircle, Pencil, Save, Trash2 } from "lucide-react";
import { payrollEmployees } from "../data/mockData";
import { usePayroll } from "../context/AppContext";
import type { PayrollEntry } from "../context/AppContext";

const months = ["January 2026", "February 2026", "March 2026", "April 2026"];

/* ─── Edit Payroll Entry Modal ──────────── */
function EditPayrollModal({
  entry, onClose, onSave,
}: {
  entry: PayrollEntry;
  onClose: () => void;
  onSave: (updated: PayrollEntry) => void;
}) {
  const [form, setForm] = useState({
    grossSalary: String(entry.grossSalary),
    deductions: String(entry.deductions),
    status: entry.status,
  });

  const netPay = Math.max(0, parseFloat(form.grossSalary || "0") - parseFloat(form.deductions || "0"));

  const handleSave = () => {
    onSave({
      ...entry,
      grossSalary: parseFloat(form.grossSalary) || entry.grossSalary,
      deductions: parseFloat(form.deductions) || entry.deductions,
      netPay,
      status: form.status as PayrollEntry["status"],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 800 }}>Edit Payroll Entry</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "2px" }}>{entry.employeeName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--muted-foreground)" }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Gross Salary (₹)</label>
            <input type="number" className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.grossSalary} onChange={(e) => setForm({ ...form, grossSalary: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Deductions (₹)</label>
            <input type="number" className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Net Pay (₹)</label>
            <div className="px-3 py-2.5 rounded-xl border text-sm font-bold" style={{ borderColor: "var(--border)", color: "#10B981", backgroundColor: "rgba(16,185,129,0.05)" }}>
              ₹{netPay.toLocaleString()}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Status</label>
            <select className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PayrollEntry["status"] })}>
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--foreground)", border: "1px solid var(--border)" }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Run Payroll Modal ─────────────────── */
function RunPayrollModal({
  onClose, month, onProcessed,
}: {
  onClose: () => void; month: string; onProcessed: (entries: PayrollEntry[]) => void;
}) {
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");
  const totalNet = payrollEmployees.reduce((s, e) => s + e.net, 0);

  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => {
        const [monthName, yearStr] = month.split(" ");
        const entries: PayrollEntry[] = payrollEmployees.map((emp) => ({
          id: `PAY-${emp.id}-${monthName}-${yearStr}`,
          employeeId: emp.id,
          employeeName: emp.name,
          month: monthName,
          year: parseInt(yearStr),
          grossSalary: emp.gross,
          deductions: emp.deductions,
          netPay: emp.net,
          status: "Processed",
        }));
        onProcessed(entries);
        setStep("success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        {step === "confirm" && (
          <>
            <div className="px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center" style={{ backgroundColor: "var(--secondary)" }}>
                  <Play size={28} color="var(--primary)" fill="var(--primary)" />
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-emerald-500/10" style={{ color: "var(--muted-foreground)" }}>
                  <X size={20} />
                </button>
              </div>
              <h3 style={{ color: "var(--foreground)", fontSize: "24px", fontWeight: 800 }}>Process Payroll</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "15px", marginTop: "4px" }}>
                You are about to run payroll for <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{month}</span>.
              </p>
              <div className="mt-8 rounded-3xl p-6" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>Total Employees</span>
                  <span style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>{payrollEmployees.length}</span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>Gross Payout</span>
                  <span style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>₹{payrollEmployees.reduce((s, e) => s + e.gross, 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>Net Disbursement</span>
                  <span style={{ color: "#10B981", fontSize: "22px", fontWeight: 900 }}>₹{totalNet.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl" style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <AlertCircle size={20} color="#F59E0B" className="shrink-0" />
                <p style={{ color: "#F59E0B", fontSize: "13px", lineHeight: "1.6" }}>Disbursement will be initiated immediately. Review all deductions before confirming.</p>
              </div>
            </div>
            <div className="px-8 py-6 flex gap-4" style={{ borderTop: "1px solid var(--border)" }}>
              <button onClick={onClose} className="flex-1 py-4 rounded-2xl text-sm font-bold hover:bg-emerald-500/10" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>Cancel</button>
              <button onClick={() => setStep("processing")} className="flex-1 py-4 rounded-2xl text-sm font-bold text-white hover:opacity-90 shadow-lg" style={{ background: "#10B981" }}>Confirm & Disburse</button>
            </div>
          </>
        )}
        {step === "processing" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center" style={{ borderColor: "var(--secondary)" }}>
                <Loader2 size={40} color="var(--primary)" className="animate-spin" />
              </div>
            </div>
            <h3 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>Processing Payroll...</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "8px", maxWidth: "240px" }}>Calculating disbursements and initiating bank transfers.</p>
          </div>
        )}
        {step === "success" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full mb-8 flex items-center justify-center" style={{ backgroundColor: "var(--secondary)" }}>
              <CheckCircle2 size={48} color="var(--primary)" />
            </div>
            <h3 style={{ color: "var(--foreground)", fontSize: "24px", fontWeight: 900 }}>Success!</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "15px", marginTop: "8px" }}>
              Payroll for <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{month}</span> has been processed.
            </p>
            <button onClick={onClose} className="mt-10 w-full py-4 rounded-2xl text-sm font-bold text-white shadow-xl" style={{ background: "var(--primary)" }}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [editEntry, setEditEntry] = useState<PayrollEntry | null>(null);

  const { payroll, addPayrollEntry, updatePayrollEntry, deletePayrollEntry } = usePayroll();
  const [deletedMockIds, setDeletedMockIds] = useState<Set<string>>(new Set());

  // Merge mock data with context entries for the selected month
  const [monthName] = selectedMonth.split(" ");
  const contextEntries = payroll.filter((e) => e.month === monthName);
  const contextMap = Object.fromEntries(contextEntries.map((e) => [e.employeeId, e]));

  const displayRows = payrollEmployees
    .filter((emp) => !deletedMockIds.has(emp.id))
    .map((emp) => {
    const ctx = contextMap[emp.id];
    return {
      id: emp.id,
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      avatar: emp.avatar,
      gross: ctx ? ctx.grossSalary : emp.gross,
      deductions: ctx ? ctx.deductions : emp.deductions,
      net: ctx ? ctx.netPay : emp.net,
      status: ctx ? ctx.status : (emp.status as "Paid" | "Pending" | "Processed"),
      hasEntry: !!ctx,
      entryId: ctx?.id,
    };
  });

  const totalGross = displayRows.reduce((s, e) => s + e.gross, 0);
  const totalDeductions = displayRows.reduce((s, e) => s + e.deductions, 0);
  const totalNet = displayRows.reduce((s, e) => s + e.net, 0);

  const handleProcessed = (entries: PayrollEntry[]) => {
    entries.forEach((entry) => {
      if (contextMap[entry.employeeId]) {
        updatePayrollEntry(entry);
      } else {
        addPayrollEntry(entry);
      }
    });
  };

  const handleEditSave = (updated: PayrollEntry) => {
    if (contextMap[updated.employeeId]) {
      updatePayrollEntry(updated);
    } else {
      addPayrollEntry(updated);
    }
  };

  const handleStatusToggle = (empId: string) => {
    const row = displayRows.find((r) => r.id === empId);
    if (!row) return;
    const newStatus: PayrollEntry["status"] = row.status === "Paid" ? "Pending" : row.status === "Pending" ? "Processed" : "Paid";
    const [mName, mYear] = selectedMonth.split(" ");
    const entry: PayrollEntry = {
      id: row.entryId || `PAY-${empId}-${mName}-${mYear}`,
      employeeId: empId,
      employeeName: row.name,
      month: mName,
      year: parseInt(mYear),
      grossSalary: row.gross,
      deductions: row.deductions,
      netPay: row.net,
      status: newStatus,
    };
    if (contextMap[empId]) {
      updatePayrollEntry(entry);
    } else {
      addPayrollEntry(entry);
    }
  };

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Month Selector */}
        <div className="relative">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors shadow-sm"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
            {selectedMonth}
            <ChevronDown size={14} color="var(--muted-foreground)" style={{ transform: showMonthDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {showMonthDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMonthDropdown(false)} />
              <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20 shadow-xl" style={{ minWidth: "180px", backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                {months.map((m) => (
                  <button key={m} onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false); }} className="w-full px-4 py-2.5 text-left transition-colors" style={{ fontSize: "13px", color: selectedMonth === m ? "var(--primary)" : "var(--foreground)", backgroundColor: selectedMonth === m ? "var(--secondary)" : "transparent", fontWeight: selectedMonth === m ? 700 : 400, border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => { if (selectedMonth !== m) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)"; }}
                    onMouseLeave={(e) => { if (selectedMonth !== m) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                  >{m}</button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => setShowRunModal(true)}
          className="flex items-center gap-2.5 rounded-xl px-6 py-2.5 hover:opacity-90 active:scale-95 shadow-lg"
          style={{ background: "linear-gradient(135deg, #059669, #047857)", color: "white", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}
        >
          <Play size={15} fill="white" /> Run Payroll
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { label: "Total Gross Salary", value: `₹${totalGross.toLocaleString()}`, sub: `${payrollEmployees.length} employees`, color: "var(--primary)", bg: "var(--secondary)", border: "var(--border)", icon: "💰" },
          { label: "Total Deductions", value: `₹${totalDeductions.toLocaleString()}`, sub: "Tax, PF & Insurance", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)", icon: "📉" },
          { label: "Net Payout", value: `₹${totalNet.toLocaleString()}`, sub: "After all deductions", color: "#22C55E", bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)", icon: "✅" },
        ].map((card, i) => (
          <div key={i} className="rounded-2xl p-6" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>{card.label}</p>
                <p style={{ color: card.color, fontSize: "28px", fontWeight: 800 }}>{card.value}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "4px" }}>{card.sub}</p>
              </div>
              <span style={{ fontSize: "28px" }}>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payroll Table */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Payroll Details — {selectedMonth}</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              {displayRows.filter((e) => e.status === "Paid").length} paid · {displayRows.filter((e) => e.status === "Pending").length} pending
            </p>
          </div>
          <button
            onClick={() => {
              const headers = ["Name", "Designation", "Department", "Gross", "Deductions", "Net Pay", "Status"];
              const rows = displayRows.map((e) => [e.name, e.designation, e.department, e.gross, e.deductions, e.net, e.status]);
              const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `payroll_${selectedMonth.replace(" ", "_").toLowerCase()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "13px", fontWeight: 600, backgroundColor: "var(--background)", cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Table Header */}
        <div className="grid px-6 py-3" style={{ backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)", gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr" }}>
          {["Employee", "Department", "Gross", "Deductions", "Net Pay", "Status", "Actions"].map((col) => (
            <span key={col} style={{ color: "var(--foreground)", opacity: 0.8, fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{col}</span>
          ))}
        </div>

        {/* Table Rows */}
        {displayRows.map((emp, i) => (
          <div
            key={emp.id}
            className="grid px-6 py-4 items-center transition-colors"
            style={{ gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr", borderBottom: i < displayRows.length - 1 ? "1px solid var(--border)" : "none", backgroundColor: hoveredRow === emp.id ? "var(--secondary)" : i % 2 === 0 ? "var(--card)" : "var(--background)" }}
            onMouseEnter={() => setHoveredRow(emp.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {/* Employee */}
            <div className="flex items-center gap-3">
              <img src={emp.avatar} alt={emp.name} className="rounded-full object-cover shrink-0" style={{ width: "36px", height: "36px", border: "2px solid var(--border)" }} />
              <div>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{emp.name}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{emp.designation}</p>
              </div>
            </div>
            <span style={{ color: "var(--foreground)", fontSize: "13px", opacity: 0.9 }}>{emp.department}</span>
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>₹{emp.gross.toLocaleString()}</span>
            <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: 500 }}>-₹{emp.deductions.toLocaleString()}</span>
            <span style={{ color: "#10B981", fontSize: "13px", fontWeight: 700 }}>₹{emp.net.toLocaleString()}</span>

            {/* Status — clickable toggle */}
            <button
              onClick={() => handleStatusToggle(emp.id)}
              title="Click to cycle status"
              className="px-2.5 py-1 rounded-full transition-opacity hover:opacity-75 cursor-pointer"
              style={{
                backgroundColor: emp.status === "Paid" ? "rgba(16,185,129,0.1)" : emp.status === "Processed" ? "rgba(59,130,246,0.1)" : "rgba(245,158,11,0.1)",
                color: emp.status === "Paid" ? "#10B981" : emp.status === "Processed" ? "#3B82F6" : "#F59E0B",
                fontSize: "11px", fontWeight: 700, width: "fit-content", border: "none",
              }}
            >
              {emp.status === "Paid" ? "✓ Paid" : emp.status === "Processed" ? "⚡ Processed" : "⏳ Pending"}
            </button>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const [mName, mYear] = selectedMonth.split(" ");
                  setEditEntry({
                    id: emp.entryId || `PAY-${emp.id}-${mName}-${mYear}`,
                    employeeId: emp.id,
                    employeeName: emp.name,
                    month: mName,
                    year: parseInt(mYear),
                    grossSalary: emp.gross,
                    deductions: emp.deductions,
                    netPay: emp.net,
                    status: emp.status,
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "11px", fontWeight: 600, backgroundColor: "var(--card)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--card)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; }}
              >
                <Pencil size={11} /> Edit
              </button>
              <button
                onClick={() => {
                  const w = window.open("", "_blank");
                  if (!w) return;
                  w.document.write(`<html><head><title>Payslip - ${emp.name}</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a;max-width:600px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #059669;padding-bottom:16px;margin-bottom:24px}.logo{color:#059669;font-size:22px;font-weight:900}.month{color:#6b7280;font-size:13px}.emp{margin-bottom:24px}.emp h2{margin:0;font-size:18px}.emp p{color:#6b7280;margin:2px 0;font-size:13px}table{width:100%;border-collapse:collapse;margin-bottom:24px}th{text-align:left;padding:10px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}td{padding:10px;border-bottom:1px solid #e5e7eb;font-size:13px}.total td{font-weight:800;border-top:2px solid #059669;border-bottom:none}.net{color:#059669;font-size:18px;font-weight:900}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;text-align:center}</style></head><body><div class="header"><span class="logo">EMS</span><span class="month">${selectedMonth}</span></div><div class="emp"><h2>${emp.name}</h2><p>${emp.designation}</p><p>${emp.department}</p></div><table><tr><th>Component</th><th style="text-align:right">Amount</th></tr><tr><td>Gross Salary</td><td style="text-align:right">₹${emp.gross.toLocaleString()}</td></tr><tr><td style="color:#ef4444">Total Deductions</td><td style="text-align:right;color:#ef4444">-₹${emp.deductions.toLocaleString()}</td></tr><tr class="total"><td>Net Pay</td><td style="text-align:right" class="net">₹${emp.net.toLocaleString()}</td></tr></table><div class="footer">This is a system-generated payslip.</div></body></html>`);
                  w.document.close();
                  w.print();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "11px", fontWeight: 600, backgroundColor: "var(--card)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--card)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; }}
              >
                <Download size={11} /> Payslip
              </button>
              <button
                onClick={() => {
                  if (emp.entryId) {
                    deletePayrollEntry(emp.entryId);
                  } else {
                    setDeletedMockIds((prev) => new Set([...prev, emp.id]));
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: "11px", fontWeight: 600, backgroundColor: "var(--card)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--card)"; }}
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Total Row */}
        <div className="grid px-6 py-4" style={{ gridTemplateColumns: "2.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr", borderTop: "2px solid var(--border)", backgroundColor: "var(--secondary)" }}>
          <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>Total ({payrollEmployees.length} employees)</span>
          <span /><span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 800 }}>₹{totalGross.toLocaleString()}</span>
          <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: 700 }}>-₹{totalDeductions.toLocaleString()}</span>
          <span style={{ color: "#10B981", fontSize: "13px", fontWeight: 800 }}>₹{totalNet.toLocaleString()}</span>
          <span /><span />
        </div>
      </div>

      {showRunModal && <RunPayrollModal onClose={() => setShowRunModal(false)} month={selectedMonth} onProcessed={handleProcessed} />}
      {editEntry && <EditPayrollModal entry={editEntry} onClose={() => setEditEntry(null)} onSave={handleEditSave} />}
    </div>
  );
}
