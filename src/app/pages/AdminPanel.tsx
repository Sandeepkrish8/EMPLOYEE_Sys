import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users, ShieldCheck, Activity, Settings2, Plus, Pencil, Trash2,
  X, Save, UserCog, LayoutDashboard, TrendingUp, Database,
} from "lucide-react";
import { UserRole } from "../config/roles";

interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  joined: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function loadUsers(): ManagedUser[] {
  const raw: { fullName: string; email: string; password: string; role: string }[] =
    JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  return raw.map((u, i) => ({
    id: `U${String(i + 1).padStart(3, "0")}`,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    status: "Active",
    joined: "2024-01-01",
  }));
}

function saveUsers(users: ManagedUser[]) {
  // Merge back – preserve passwords
  const raw: any[] = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  const updated = users.map((u) => {
    const orig = raw.find((r: any) => r.email === u.email);
    return { fullName: u.fullName, email: u.email, password: orig?.password || "admin123", role: u.role };
  });
  localStorage.setItem("registeredUsers", JSON.stringify(updated));
}

const ROLE_OPTIONS = [
  UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR,
  UserRole.FINANCE, UserRole.MANAGER, UserRole.EMPLOYEE,
];
const ROLE_COLORS: Record<string, string> = {
  super_admin: "#DC2626", admin: "#7C3AED", hr: "#0EA5E9",
  finance: "#F59E0B", manager: "#059669", employee: "#2563EB",
};
const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin", admin: "Admin", hr: "HR",
  finance: "Finance", manager: "Manager", employee: "Employee",
};

const MODULE_CARDS = [
  { label: "Employees",   icon: Users,         route: "/employees",   color: "#059669", desc: "248 active"      },
  { label: "Performance", icon: TrendingUp,     route: "/performance", color: "#6366F1", desc: "Reviews open"    },
  { label: "Reports",     icon: Database,       route: "/reports",     color: "#F59E0B", desc: "12 reports"      },
  { label: "Settings",    icon: Settings2,      route: "/settings",    color: "#EF4444", desc: "System config"   },
];

// ── Modal ──────────────────────────────────────────────────────────────────
function UserModal({
  user,
  onSave,
  onClose,
}: {
  user: Partial<ManagedUser> | null;
  onSave: (u: ManagedUser) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<ManagedUser>>(user || { role: UserRole.EMPLOYEE, status: "Active" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.role) return;
    onSave({
      id:       form.id || `U${Date.now()}`,
      fullName: form.fullName!,
      email:    form.email!,
      role:     form.role!,
      status:   form.status || "Active",
      joined:   form.joined || new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>
            {form.id ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", key: "fullName", type: "text",  placeholder: "Jane Doe" },
            { label: "Email",     key: "email",    type: "email", placeholder: "jane@company.com" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "6px" }}>{label}</label>
              <input
                type={type} required placeholder={placeholder}
                value={(form as any)[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "6px" }}>Role</label>
            <select
              value={form.role || UserRole.EMPLOYEE}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "6px" }}>Status</label>
            <select
              value={form.status || "Active"}
              onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              Cancel
            </button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none" }}>
              <Save size={14} /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ManagedUser[]>(loadUsers);
  const [modal, setModal] = useState<Partial<ManagedUser> | null | "new">(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { saveUsers(users); }, [users]);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = (u: ManagedUser) => {
    setUsers((prev) =>
      prev.some((p) => p.id === u.id) ? prev.map((p) => (p.id === u.id ? u : p)) : [...prev, u],
    );
    setModal(null);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteId(null);
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl" style={{ background: "linear-gradient(135deg,#DC2626,#B91C1C)" }}>
            <ShieldCheck size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>Admin Panel</h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Full system control — superadmin only</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#DC2626", color: "#fff" }}>Super Admin</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users",     value: users.length,                         icon: Users,         color: "#DC2626", bg: "rgba(220,38,38,0.08)"   },
          { label: "Active Users",    value: users.filter(u => u.status==="Active").length, icon: Activity, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
          { label: "Roles Assigned",  value: new Set(users.map(u=>u.role)).size,  icon: UserCog,       color: "#6366F1", bg: "rgba(99,102,241,0.08)"  },
          { label: "Modules",         value: MODULE_CARDS.length,                  icon: LayoutDashboard, color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
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

      {/* Module Quick Access */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {MODULE_CARDS.map((m) => (
          <div key={m.label} onClick={() => navigate(m.route)} className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <m.icon size={22} color={m.color} />
            <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginTop: "10px" }}>{m.label}</p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{m.desc}</p>
          </div>
        ))}
      </div>

      {/* User Management Table */}
      <div className="rounded-2xl shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>User Management</h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{users.length} registered users</p>
          </div>
          <div className="flex gap-3">
            <input
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none w-52"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
            <button onClick={() => setModal("new")} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none" }}>
              <Plus size={15} /> Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["User", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3" style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>No users found.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold" style={{ backgroundColor: `${ROLE_COLORS[u.role] || "#6366F1"}22`, color: ROLE_COLORS[u.role] || "#6366F1" }}>
                        {u.fullName.charAt(0)}
                      </div>
                      <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${ROLE_COLORS[u.role] || "#6366F1"}18`, color: ROLE_COLORS[u.role] || "#6366F1" }}>
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: u.status === "Active" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: u.status === "Active" ? "#10B981" : "#EF4444" }}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{u.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(u)} className="p-1.5 rounded-lg transition-colors hover:bg-secondary" title="Edit">
                        <Pencil size={14} color="#6366F1" />
                      </button>
                      <button onClick={() => setDeleteId(u.id)} className="p-1.5 rounded-lg transition-colors hover:bg-secondary" title="Delete">
                        <Trash2 size={14} color="#EF4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {modal !== null && (
        <UserModal
          user={modal === "new" ? null : (modal as ManagedUser)}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Delete User?</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "20px" }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", border: "none" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
