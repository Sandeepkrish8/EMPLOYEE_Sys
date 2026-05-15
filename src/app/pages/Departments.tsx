import { Building2, Plus, Users, TrendingUp, X, User, DollarSign, Layout, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDepartments } from "../context/AppContext";
import type { Department } from "../context/AppContext";

const DEPT_COLORS = ["#059669", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#14B8A6", "#EC4899", "#6366F1"];

function formatBudget(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(0)}L`;
  return `₹${n.toLocaleString()}`;
}

/* ─── Add Department Modal ──────────────── */
function AddDepartmentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (dept: Department) => void }) {
  const [form, setForm] = useState({ name: "", head: "", budget: "", description: "" });
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!form.name.trim()) { setError("Department name is required"); return; }
    if (!form.head.trim()) { setError("Department head is required"); return; }
    const budgetNum = parseFloat(form.budget.replace(/[^0-9.]/g, ""));
    if (!form.budget || isNaN(budgetNum) || budgetNum <= 0) { setError("Valid budget is required"); return; }

    onAdd({
      id: `DEPT${String(Date.now()).slice(-5)}`,
      name: form.name.trim(),
      head: form.head.trim(),
      employees: 0,
      budget: budgetNum,
      color: DEPT_COLORS[Math.floor(Math.random() * DEPT_COLORS.length)],
      description: form.description.trim() || undefined,
      growth: 0,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>Create Department</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "2px" }}>Define a new organizational unit</p>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl hover:bg-emerald-500/10" style={{ color: "var(--muted-foreground)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Department Name</label>
            <div className="relative">
              <Layout size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="e.g. Design Tech"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
              />
            </div>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Department Head</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="Employee name..."
                value={form.head}
                onChange={(e) => { setForm({ ...form, head: e.target.value }); setError(""); }}
              />
            </div>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Allocated Budget (Annual)</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="e.g. 5000000"
                value={form.budget}
                onChange={(e) => { setForm({ ...form, budget: e.target.value }); setError(""); }}
              />
            </div>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Description</label>
            <textarea
              rows={3}
              className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500/20"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              placeholder="Describe the department's core responsibilities..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex gap-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl text-sm font-bold hover:bg-emerald-500/10" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 py-4 rounded-2xl text-sm font-bold text-white hover:opacity-90 active:scale-95 shadow-lg"
            style={{ background: "#10B981", boxShadow: "0 6px 20px rgba(16,185,129,0.25)" }}
          >
            Create Department
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Department Drawer ────────────── */
function DepartmentDetailModal({ dept, onClose, onSave, onDelete }: {
  dept: Department;
  onClose: () => void;
  onSave: (dept: Department) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState({
    name: dept.name,
    head: dept.head,
    budget: String(dept.budget),
    growth: String(dept.growth ?? 0),
    description: dept.description ?? "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    onSave({
      ...dept,
      name: form.name.trim() || dept.name,
      head: form.head.trim() || dept.head,
      budget: parseFloat(form.budget) || dept.budget,
      growth: parseFloat(form.growth) || 0,
      description: form.description.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(dept.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-4 sm:p-0" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div
        className="w-full sm:w-[450px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        style={{ backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--secondary)" }}>
              <Building2 size={20} color="var(--primary)" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{dept.name}</h3>
              <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>Edit Department</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--muted-foreground)" }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Employees</p>
              <div className="flex items-center gap-2">
                <Users size={16} color="var(--primary)" />
                <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{dept.employees}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Annual Budget</p>
              <div className="flex items-center gap-2">
                <DollarSign size={16} color="var(--primary)" />
                <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{formatBudget(dept.budget)}</p>
              </div>
            </div>
          </div>

          {/* Edit Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Department Name</label>
              <input type="text" className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Department Head</label>
              <input type="text" className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Annual Budget (₹)</label>
              <input type="number" className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Target Growth (%)</label>
              <input type="number" className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.growth} onChange={(e) => setForm({ ...form, growth: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Description</label>
              <textarea rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-transparent resize-none" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          {/* Delete Zone */}
          <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors hover:bg-red-50 dark:hover:bg-red-900/10" style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                <Trash2 size={15} /> Delete Department
              </button>
            ) : (
              <div className="p-4 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-sm font-bold mb-3" style={{ color: "#EF4444" }}>Permanently delete "{dept.name}"?</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-lg text-sm font-bold bg-white dark:bg-zinc-800" style={{ color: "var(--foreground)", border: "1px solid var(--border)" }}>Cancel</button>
                  <button onClick={handleDelete} className="flex-1 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "#EF4444" }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--foreground)" }}>Close</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast ─────────────────────────────── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useState(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); });
  return (
    <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-lg flex items-center gap-2" style={{ backgroundColor: "#10B981" }}>
      ✓ {message}
    </div>
  );
}

/* ─── Main Page ─────────────────────────── */
export function Departments() {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleAdd = (dept: Department) => {
    addDepartment(dept);
    setToast("Department created successfully");
  };

  const handleSave = (dept: Department) => {
    updateDepartment(dept);
    setToast("Department updated successfully");
  };

  const handleDelete = (id: string) => {
    deleteDepartment(id);
    setToast("Department deleted");
  };

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ color: "var(--foreground)", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Departments</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "4px" }}>Manage organizational structure</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #059669, #047857)", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 12px rgba(5,150,105,0.3)" }}
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => setSelectedDept(dept)}
            className="group relative rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-lg"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center justify-center rounded-2xl" style={{ width: "52px", height: "52px", backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
                <Building2 size={24} color="var(--primary)" />
              </div>
              <div className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
                <TrendingUp size={12} color="var(--primary)" />
                <span style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 700 }}>+{dept.growth ?? 0}</span>
              </div>
            </div>

            {/* Name & Head */}
            <div className="mb-6">
              <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800 }}>{dept.name}</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "2px" }}>
                Head: <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{dept.head}</span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-5" style={{ borderTop: "1px dotted var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-lg" style={{ width: "28px", height: "28px", backgroundColor: "var(--secondary)" }}>
                  <Users size={14} color="var(--primary)" />
                </div>
                <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 600 }}>
                  {dept.employees} <span style={{ color: "var(--muted-foreground)", fontWeight: 400, fontSize: "13px" }}>employees</span>
                </p>
              </div>
              <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
                Budget: <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{formatBudget(dept.budget)}</span>
              </p>
            </div>
          </div>
        ))}

        {/* Add Placeholder */}
        <div
          onClick={() => setShowAddModal(true)}
          className="rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed hover:border-emerald-400"
          style={{ minHeight: "220px", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-center rounded-full" style={{ width: "48px", height: "48px", backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
            <Plus size={24} />
          </div>
          <p style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 700 }}>Create Department</p>
        </div>
      </div>

      {showAddModal && <AddDepartmentModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {selectedDept && (
        <DepartmentDetailModal
          dept={selectedDept}
          onClose={() => setSelectedDept(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
