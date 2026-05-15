import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Plus,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  User,
  Mail,
  Briefcase,
  Calendar as CalendarIcon,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useEmployees } from "../context/AppContext";
import type { Employee } from "../context/AppContext";

const ROWS_PER_PAGE = 8;
const departments = ["All Departments", "Engineering", "Marketing", "Design", "Finance", "HR", "Product", "Sales", "Operations"];
const statuses = ["All Status", "Active", "Inactive", "On Leave"];

// Validation helpers
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidForm(form: Partial<Employee>): { valid: boolean; error?: string } {
  if (!form.name?.trim()) return { valid: false, error: "Name is required" };
  if (!form.email?.trim()) return { valid: false, error: "Email is required" };
  if (!validateEmail(form.email)) return { valid: false, error: "Invalid email format" };
  if (!form.department) return { valid: false, error: "Department is required" };
  if (!form.designation?.trim()) return { valid: false, error: "Designation is required" };
  if (!form.salary || Number(form.salary) <= 0) return { valid: false, error: "Salary must be greater than 0" };
  if (!form.joinDate) return { valid: false, error: "Join date is required" };
  return { valid: true };
}

// Toast notification
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className="fixed bottom-4 right-4 rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg z-[100] animate-in"
      style={{
        backgroundColor: type === "success" ? "#10B981" : "#EF4444",
        color: "white",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

/* ─── Add Employee Modal ─────────────────── */
function AddEmployeeModal({ onClose, onAdd, onSuccess }: { onClose: () => void; onAdd: (emp: Employee) => void; onSuccess: (msg: string) => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Engineering",
    designation: "",
    salary: 0,
    joinDate: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState<string>("");

  const handleAdd = () => {
    const validation = isValidForm(form);
    if (!validation.valid) {
      setError(validation.error || "Invalid form");
      return;
    }

    const newEmployee: Employee = {
      id: `EMP${String(Math.floor(Math.random() * 10000)).padStart(3, "0")}`,
      name: form.name,
      email: form.email,
      phone: form.phone || "+1 (555) 000-0000",
      department: form.department,
      role: form.designation,
      designation: form.designation,
      status: "Active",
      joinDate: form.joinDate,
      salary: form.salary,
      grossSalary: form.salary / 12,
      deductions: Math.round((form.salary / 12) * 0.12),
      netPay: Math.round((form.salary / 12) * 0.88),
      avatar: "https://images.unsplash.com/photo-1765005204058-10418f5123c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      location: "New York, NY",
      manager: "Manager Name",
      employmentType: "Full-time",
      gender: "Other",
      dob: "1990-01-01",
      address: "123 Street, City, State",
      emergencyContact: "Contact — +1 (555) 000-0000",
      performance: 75,
    };

    onAdd(newEmployee);
    onSuccess(`Employee ${newEmployee.name} added successfully!`);
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
        <div
          className="flex items-center justify-between px-8 py-7"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}
        >
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Add New Employee
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "2px" }}>
              Create a new employee profile in the system
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-[rgba(0,0,0,0.05)]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-8 overflow-y-auto" style={{ maxHeight: "70vh" }}>
          {error && (
            <div
              className="mb-4 p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "13px" }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="john.doe@company.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Department
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {departments.slice(1).map((d) => (
                    <option key={d} style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Designation
              </label>
              <input
                className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="e.g. Senior Developer"
                value={form.designation}
                onChange={(e) => { setForm({ ...form, designation: e.target.value }); setError(""); }}
              />
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Annual Salary (₹)
              </label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="75000"
                  value={form.salary}
                  onChange={(e) => { setForm({ ...form, salary: Number(e.target.value) }); setError(""); }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", opacity: 0.9 }}>
                Joining Date
              </label>
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.joinDate}
                  onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="px-6 py-5 flex gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all hover:bg-emerald-500/10"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "none" }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "#10B981",
              border: "none"
            }}
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Employee Modal ────────────────── */
function EditEmployeeModal({ employee, onClose, onUpdate, onSuccess }: { employee: Employee; onClose: () => void; onUpdate: (emp: Employee) => void; onSuccess: (msg: string) => void }) {
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    salary: String(employee.salary),
    joinDate: employee.joinDate,
    status: employee.status,
  });
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    const validation = isValidForm(form);
    if (!validation.valid) {
      setError(validation.error || "Invalid form");
      return;
    }

    const updated: Employee = {
      ...employee,
      name: form.name,
      email: form.email,
      phone: form.phone,
      department: form.department,
      role: form.designation,
      designation: form.designation,
      salary: Number(form.salary),
      joinDate: form.joinDate,
      status: form.status as "Active" | "On Leave" | "Inactive",
      grossSalary: Number(form.salary) / 12,
      deductions: Math.round((Number(form.salary) / 12) * 0.12),
      netPay: Math.round((Number(form.salary) / 12) * 0.88),
    };

    onUpdate(updated);
    onSuccess(`Employee ${updated.name} updated successfully!`);
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
        <div
          className="flex items-center justify-between px-8 py-6"
          style={{ borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg,#ECFDF5 0%,#F0FDFA 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "2px solid #10B981", flexShrink: 0 }}
            >
              <img src={employee.avatar} alt={employee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <h3 style={{ color: "#0F3047", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.4px" }}>Edit Employee</h3>
              <p style={{ color: "#6B8C7A", fontSize: "12px", marginTop: "1px" }}>{employee.id} · {employee.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: "65vh" }}>
          {error && (
            <div
              className="mb-4 p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "13px" }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Department</label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {departments.slice(1).map((d) => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Status</label>
              <div className="relative">
                <select
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["Active", "Inactive", "On Leave"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-2">
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Designation</label>
              <input
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                value={form.designation}
                onChange={(e) => { setForm({ ...form, designation: e.target.value }); setError(""); }}
              />
            </div>

            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Annual Salary (₹)</label>
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.salary}
                  onChange={(e) => { setForm({ ...form, salary: e.target.value }); setError(""); }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "#374151", fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "6px" }}>Joining Date</label>
              <div className="relative">
                <CalendarIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.joinDate}
                  onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 flex gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "none" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#10B981", border: "none", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ───────────────── */
function DeleteConfirmModal({ employee, onClose, onDelete, onSuccess }: { employee: Employee; onClose: () => void; onDelete: () => void; onSuccess: (msg: string) => void }) {
  const handleDelete = () => {
    onDelete();
    onSuccess(`Employee ${employee.name} deleted successfully!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: "4px", background: "linear-gradient(90deg,#EF4444,#DC2626)" }} />

        <div className="px-7 py-7">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-5"
            style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
          >
            <Trash2 size={24} color="#EF4444" />
          </div>

          <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800, textAlign: "center", marginBottom: "8px" }}>
            Delete Employee
          </h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px", textAlign: "center", lineHeight: 1.6 }}>
            Are you sure you want to delete{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{employee.name}</span>?
            <br />
            <span style={{ fontSize: "12px" }}>This action cannot be undone.</span>
          </p>

          <div
            className="flex items-center gap-3 rounded-xl p-3 mt-5"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(239,68,68,0.3)", flexShrink: 0 }}>
              <img src={employee.avatar} alt={employee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700, margin: 0 }}>{employee.name}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "11px", margin: 0 }}>{employee.designation} · {employee.department}</p>
            </div>
            <span
              className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: employee.status === "Active" ? "var(--secondary)" : employee.status === "On Leave" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                color: employee.status === "Active" ? "var(--primary)" : employee.status === "On Leave" ? "#F59E0B" : "#EF4444",
              }}
            >
              {employee.status}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)", border: "none" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)", border: "none", boxShadow: "0 4px 14px rgba(239,68,68,0.35)" }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function Employees() {
  const navigate = useNavigate();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployeeData, setDeleteEmployeeData] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === "All Departments" || emp.department === selectedDept;
    const matchStatus = selectedStatus === "All Status" || emp.status === selectedStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const statusConfig: Record<string, { bg: string; color: string }> = {
    Active: { bg: "var(--secondary)", color: "var(--primary)" },
    Inactive: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444" },
    "On Leave": { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" },
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: employees.length, color: "var(--primary)" },
          { label: "Active", value: employees.filter((e) => e.status === "Active").length, color: "#10B981" },
          { label: "On Leave", value: employees.filter((e) => e.status === "On Leave").length, color: "#F59E0B" },
          { label: "Inactive", value: employees.filter((e) => e.status === "Inactive").length, color: "#EF4444" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{stat.label}</span>
            <span style={{ color: stat.color, fontSize: "20px", fontWeight: 800 }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="rounded-2xl p-5 mb-5 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className="flex items-center gap-2.5 flex-1 rounded-xl px-4"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              height: "40px",
            }}
          >
            <Search size={15} color="var(--muted-foreground)" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, ID, or email..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "13px",
                color: "var(--foreground)",
                width: "100%",
              }}
            />
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowDeptDropdown(!showDeptDropdown); setShowStatusDropdown(false); }}
              className="flex items-center gap-2 rounded-xl px-4 transition-colors"
              style={{
                height: "40px",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontSize: "13px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: "pointer"
              }}
            >
              <Filter size={13} color="var(--muted-foreground)" />
              {selectedDept}
              <ChevronDown size={13} color="var(--muted-foreground)" />
            </button>
            {showDeptDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDeptDropdown(false)} />
                <div
                  className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20 shadow-xl"
                  style={{
                    minWidth: "180px",
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => { setSelectedDept(dept); setShowDeptDropdown(false); setPage(1); }}
                      className="w-full px-4 py-2.5 text-left transition-colors"
                      style={{
                        fontSize: "13px",
                        color: selectedDept === dept ? "var(--primary)" : "var(--foreground)",
                        backgroundColor: selectedDept === dept ? "var(--secondary)" : "transparent",
                        fontWeight: selectedDept === dept ? 600 : 400,
                        border: "none",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        if (selectedDept !== dept)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDept !== dept)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowDeptDropdown(false); }}
              className="flex items-center gap-2 rounded-xl px-4 transition-colors"
              style={{
                height: "40px",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontSize: "13px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: "pointer"
              }}
            >
              {selectedStatus}
              <ChevronDown size={13} color="var(--muted-foreground)" />
            </button>
            {showStatusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                <div
                  className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20 shadow-xl"
                  style={{
                    minWidth: "150px",
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false); setPage(1); }}
                      className="w-full px-4 py-2.5 text-left transition-colors"
                      style={{
                        fontSize: "13px",
                        color: selectedStatus === status ? "var(--primary)" : "var(--foreground)",
                        backgroundColor: selectedStatus === status ? "var(--secondary)" : "transparent",
                        fontWeight: selectedStatus === status ? 600 : 400,
                        border: "none",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        if (selectedStatus !== status)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedStatus !== status)
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Add Employee Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl px-5 transition-all hover:opacity-90 active:scale-95"
            style={{
              height: "40px",
              backgroundColor: "var(--primary)",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
              whiteSpace: "nowrap",
              border: "none",
              cursor: "pointer"
            }}
          >
            <Plus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="grid px-6 py-3"
          style={{
            backgroundColor: "var(--secondary)",
            borderBottom: "1px solid var(--border)",
            gridTemplateColumns: "2.5fr 1fr 1.2fr 1.5fr 1fr 1fr",
          }}
        >
          {["Employee", "ID", "Department", "Designation", "Status", "Actions"].map((col) => (
            <span
              key={col}
              style={{
                color: "var(--foreground)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                opacity: 0.8
              }}
            >
              {col}
            </span>
          ))}
        </div>

        {paginated.map((emp, i) => (
          <div
            key={emp.id}
            className="grid px-6 py-3.5 items-center cursor-pointer transition-colors"
            style={{
              gridTemplateColumns: "2.5fr 1fr 1.2fr 1.5fr 1fr 1fr",
              borderBottom: i < paginated.length - 1 ? "1px solid var(--border)" : "none",
              backgroundColor:
                hoveredRow === emp.id
                  ? "var(--secondary)"
                  : i % 2 === 0
                    ? "var(--card)"
                    : "var(--background)",
            }}
            onMouseEnter={() => setHoveredRow(emp.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="flex items-center gap-3">
              <img
                src={emp.avatar}
                alt={emp.name}
                className="rounded-full object-cover shrink-0"
                style={{ width: "36px", height: "36px", border: "2px solid var(--border)" }}
              />
              <div>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{emp.name}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{emp.email}</p>
              </div>
            </div>

            <span
              className="px-2 py-1 rounded-lg"
              style={{
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "var(--secondary)",
                width: "fit-content",
              }}
            >
              {emp.id}
            </span>

            <span style={{ color: "var(--foreground)", fontSize: "13px" }}>{emp.department}</span>
            <span style={{ color: "var(--foreground)", fontSize: "13px" }}>{emp.designation}</span>

            <span
              className="px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: statusConfig[emp.status]?.bg || "var(--secondary)",
                color: statusConfig[emp.status]?.color || "var(--foreground)",
                fontSize: "11px",
                fontWeight: 700,
                width: "fit-content",
              }}
            >
              {emp.status}
            </span>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => navigate(`/employees/${emp.id}`)}
                className="p-2 rounded-lg transition-colors"
                title="View"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                }}
              >
                <Eye size={15} />
              </button>
              <button
                onClick={() => setEditEmployee(emp)}
                className="p-2 rounded-lg transition-colors"
                title="Edit"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                }}
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setDeleteEmployeeData(emp)}
                className="p-2 rounded-lg transition-colors"
                title="Delete"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>No employees found matching your filters.</p>
          </div>
        )}

        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
            Showing{" "}
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>
              {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(page * ROWS_PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>{filtered.length}</span> employees
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: page === 1 ? "var(--muted-foreground)" : "var(--foreground)",
                backgroundColor: page === 1 ? "var(--background)" : "var(--card)",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + Math.max(1, page - 2)).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: page === p ? "var(--primary)" : "var(--border)",
                  color: page === p ? "white" : "var(--foreground)",
                  backgroundColor: page === p ? "var(--primary)" : "var(--card)",
                  fontSize: "13px",
                  fontWeight: page === p ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: page === totalPages ? "var(--muted-foreground)" : "var(--foreground)",
                backgroundColor: page === totalPages ? "var(--background)" : "var(--card)",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onAdd={addEmployee} onSuccess={showToast} />}
      {editEmployee && <EditEmployeeModal employee={editEmployee} onClose={() => setEditEmployee(null)} onUpdate={updateEmployee} onSuccess={showToast} />}
      {deleteEmployeeData && <DeleteConfirmModal employee={deleteEmployeeData} onClose={() => setDeleteEmployeeData(null)} onDelete={() => { deleteEmployee(deleteEmployeeData.id); setDeleteEmployeeData(null); }} onSuccess={showToast} />}
    </div>
  );
}
