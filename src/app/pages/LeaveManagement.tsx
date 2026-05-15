import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  AlertTriangle,
  Info,
  CalendarDays,
  BarChart2,
  Users,
  UserCheck,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity,
  Download,
  Trash2
} from "lucide-react";
import { useLeaveRequests } from "../context/AppContext";
import type { LeaveRequest as ContextLeaveRequest } from "../context/AppContext";

/* ─── Types ─────────────────────────────── */
type ApprovalStatus = "Pending" | "Approved" | "Rejected";

interface LeaveHistory {
  date: string;
  action: string;
  by: string;
  comment?: string;
}

interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  initials: string;
  avatarColor: string;
  type: string;
  from: string;
  to: string;
  days: number;
  managerApproval: ApprovalStatus;
  hrApproval: ApprovalStatus;
  status: ApprovalStatus;
  criticalRole?: boolean;
  conflictWarning?: string;
  history: LeaveHistory[];
  remarks: string;
}

/* ─── Mock Data ─────────── */
const leaveData: LeaveRequest[] = [
  {
    id: "LR001",
    employee: "Sneha Patel",
    department: "Engineering",
    initials: "SP",
    avatarColor: "linear-gradient(135deg, #059669, #047857)",
    type: "Annual Leave",
    from: "Apr 10",
    to: "Apr 12",
    days: 3,
    managerApproval: "Approved",
    hrApproval: "Pending",
    status: "Pending",
    criticalRole: true,
    conflictWarning: "Overlaps with Ravi Kumar (Eng)",
    remarks: "Taking some time off for family vacation.",
    history: [
      { date: "Apr 2, 09:00 AM", action: "Submitted", by: "Sneha Patel" },
      { date: "Apr 3, 10:15 AM", action: "Manager Approved", by: "David Lee", comment: "Have a good trip!" }
    ]
  },
  {
    id: "LR002",
    employee: "Ravi Kumar",
    department: "Engineering",
    initials: "RK",
    avatarColor: "linear-gradient(135deg, #14B8A6, #0D9488)",
    type: "Sick Leave",
    from: "Apr 8",
    to: "Apr 8",
    days: 1,
    managerApproval: "Approved",
    hrApproval: "Approved",
    status: "Approved",
    remarks: "Not feeling well today.",
    history: [
      { date: "Apr 8, 08:00 AM", action: "Submitted", by: "Ravi Kumar" },
      { date: "Apr 8, 08:30 AM", action: "Manager Approved", by: "David Lee" },
      { date: "Apr 8, 09:00 AM", action: "HR Approved", by: "Sarah Connor" }
    ]
  },
  {
    id: "LR003",
    employee: "Meera Thomas",
    department: "Design",
    initials: "MT",
    avatarColor: "linear-gradient(135deg, #F59E0B, #D97706)",
    type: "Casual Leave",
    from: "Apr 15",
    to: "Apr 16",
    days: 2,
    managerApproval: "Pending",
    hrApproval: "Pending",
    status: "Pending",
    remarks: "Personal errands.",
    history: [
      { date: "Apr 12, 14:00 PM", action: "Submitted", by: "Meera Thomas" }
    ]
  },
  {
    id: "LR004",
    employee: "Vikram Singh",
    department: "Sales",
    initials: "VS",
    avatarColor: "linear-gradient(135deg, #22C55E, #16A34A)",
    type: "Annual Leave",
    from: "Apr 20",
    to: "Apr 25",
    days: 6,
    managerApproval: "Approved",
    hrApproval: "Approved",
    status: "Approved",
    remarks: "Pre-planned long vacation.",
    history: [
      { date: "Mar 20, 11:00 AM", action: "Submitted", by: "Vikram Singh" },
      { date: "Mar 21, 10:00 AM", action: "Manager Approved", by: "Alice Wang" },
      { date: "Mar 22, 15:00 PM", action: "HR Approved", by: "Sarah Connor" }
    ]
  },
  {
    id: "LR006",
    employee: "Rahul Sharma",
    department: "Support",
    initials: "RS",
    avatarColor: "linear-gradient(135deg, #EF4444, #DC2626)",
    type: "Sick Leave",
    from: "Apr 9",
    to: "Apr 10",
    days: 2,
    managerApproval: "Rejected",
    hrApproval: "Pending",
    status: "Rejected",
    criticalRole: true,
    remarks: "Sudden illness.",
    history: [
      { date: "Apr 9, 07:30 AM", action: "Submitted", by: "Rahul Sharma" },
      { date: "Apr 9, 08:00 AM", action: "Manager Rejected", by: "John Doe", comment: "Please find coverage first, shift is highly critical." }
    ]
  },
  {
    id: "LR007",
    employee: "Anita Desai",
    department: "Marketing",
    initials: "AD",
    avatarColor: "linear-gradient(135deg, #0EA5E9, #0369A1)",
    type: "Annual Leave",
    from: "Apr 22",
    to: "Apr 24",
    days: 3,
    managerApproval: "Approved",
    hrApproval: "Pending",
    status: "Pending",
    remarks: "Attending a wedding.",
    history: [
      { date: "Apr 14, 09:30 AM", action: "Submitted", by: "Anita Desai" },
      { date: "Apr 14, 11:00 AM", action: "Manager Approved", by: "Chloe Kim" }
    ]
  }
];

/* ─── Status Config ─────────────────────── */
const STATUS_CONFIG: Record<ApprovalStatus, { bg: string; color: string; icon: any; label: string }> = {
  Pending: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", icon: Clock, label: "Pending" },
  Approved: { bg: "var(--secondary)", color: "var(--primary)", icon: Check, label: "Approved" },
  Rejected: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444", icon: X, label: "Rejected" },
};

/* ─── Leave Analytics Mock Data ─────────── */
const leaveDistribution = [
  { type: "Annual Leave", value: 45, color: "#059669" },
  { type: "Sick Leave", value: 25, color: "#14B8A6" },
  { type: "Casual Leave", value: 20, color: "#F59E0B" },
  { type: "Maternity", value: 10, color: "#A78BFA" },
];

/* ─── Components ─────────────────────────── */

function StatusBadge({ status, small = false }: { status: ApprovalStatus; small?: boolean }) {
  const sc = STATUS_CONFIG[status];
  const Icon = sc.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}
      style={{ backgroundColor: sc.bg, color: sc.color }}
    >
      <Icon size={small ? 10 : 12} />
      {sc.label}
    </span>
  );
}

function DetailDrawer({ 
  request, 
  onClose,
  onApprove,
  onReject
}: { 
  request: LeaveRequest; 
  onClose: () => void;
  onApprove: (id: string, stage: 'manager' | 'hr') => void;
  onReject: (id: string, stage: 'manager' | 'hr') => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div 
        className="w-[450px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        style={{ backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Leave Detail</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-inner" style={{ background: request.avatarColor }}>
              <span className="text-white font-bold text-lg">{request.initials}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{request.employee}</h2>
              <p className="font-medium" style={{ color: "var(--muted-foreground)" }}>{request.department} Dept · {request.type}</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Dates</p>
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{request.from} - {request.to}</p>
              <p className="text-xs mt-1" style={{ color: "var(--primary)" }}>{request.days} Days Total</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Leave Balance</p>
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>12 Days Remaining</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Annual Leave Balance</p>
            </div>
          </div>

          {/* Warnings */}
          {request.conflictWarning && (
            <div className="p-4 rounded-xl flex gap-3" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5" }}>
              <AlertTriangle className="shrink-0 mt-0.5" size={16} color="#EF4444" />
              <div>
                <p className="text-sm font-bold" style={{ color: "#991B1B" }}>Leave Conflict Detected</p>
                <p className="text-xs mt-1" style={{ color: "#B91C1C" }}>{request.conflictWarning}</p>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <h4 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>Employee Remarks</h4>
            <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              {request.remarks || "No remarks provided."}
            </div>
          </div>

          {/* Approval Workflow */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ color: "var(--foreground)" }}>Approval Timeline</h4>
            <div className="relative pl-4 border-l-2 space-y-6" style={{ borderColor: "var(--border)" }}>
              {request.history.map((hist, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full border-2" style={{ backgroundColor: "var(--card)", borderColor: "var(--primary)" }} />
                  <div className="-mt-1">
                    <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>{hist.date}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "var(--foreground)" }}>{hist.action} <span className="font-normal text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>by {hist.by}</span></p>
                    {hist.comment && (
                      <p className="text-xs mt-1 italic" style={{ color: "var(--muted-foreground)" }}>"{hist.comment}"</p>
                    )}
                  </div>
                </div>
              ))}
              {/* Next Step Prediction */}
              {request.status === "Pending" && (
                <div className="relative opacity-50">
                   <div className="absolute -left-[21px] w-4 h-4 rounded-full border-2 border-dashed" style={{ backgroundColor: "var(--card)", borderColor: "var(--muted-foreground)" }} />
                   <div className="-mt-1">
                     <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Awaiting {request.managerApproval === "Pending" ? "Manager" : "HR"} Approval</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {request.status === "Pending" && (
          <div className="p-6 border-t flex gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <button 
              onClick={() => onReject(request.id, request.managerApproval === "Pending" ? "manager" : "hr")}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-red-50 text-red-600 border border-red-200"
              style={{ backgroundColor: "white" }}
            >
              Reject Request
            </button>
            <button 
              onClick={() => onApprove(request.id, request.managerApproval === "Pending" ? "manager" : "hr")}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md"
              style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
            >
              Approve Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LeaveManagement() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveData);
  const [activeFilter, setActiveFilter] = useState<"All" | ApprovalStatus>("All");
  const [search, setSearch] = useState("");
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [exportFormat, setExportFormat] = useState<"CSV" | "Excel" | "PDF">("Excel");

  // New request form state
  const [newForm, setNewForm] = useState({
    employee: "",
    leaveType: "Annual Leave",
    department: "Engineering",
    from: "",
    to: "",
    remarks: "",
  });
  const [newFormError, setNewFormError] = useState("");

  const { addLeave, approveLeave, rejectLeave, deleteLeave } = useLeaveRequests();

  const handleDelete = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    deleteLeave(id);
    if (selectedRequest && selectedRequest.id === id) setSelectedRequest(null);
  };

  const handleExport = () => {
    const content = "Employee,Department,Type,From,To,Days,Status\nSneha Patel,Engineering,Annual Leave,Apr 10,Apr 12,3,Pending";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leave_report.${exportFormat.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const filtered = requests.filter(r => {
    const matchFilter = activeFilter === "All" || r.status === activeFilter;
    const matchSearch = search === "" || r.employee.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleApprove = (id: string, stage: 'manager' | 'hr') => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newHistory = [...r.history, { date: "Apr 15, 10:00 AM", action: stage === 'manager' ? "Manager Approved" : "HR Approved", by: "Current User" }];

      let newManager = r.managerApproval;
      let newHr = r.hrApproval;
      let newStatus = r.status;

      if (stage === 'manager') {
        newManager = "Approved";
        if (newHr === "Approved") newStatus = "Approved";
      } else {
        newHr = "Approved";
        if (newManager === "Approved") newStatus = "Approved";
      }
      if (newStatus === "Approved") approveLeave(id);
      return { ...r, managerApproval: newManager, hrApproval: newHr, status: newStatus, history: newHistory };
    }));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(null);
    }
  };

  const handleReject = (id: string, stage: 'manager' | 'hr') => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newHistory = [...r.history, { date: "Apr 15, 10:00 AM", action: stage === 'manager' ? "Manager Rejected" : "HR Rejected", by: "Current User" }];
      return { ...r, managerApproval: stage === 'manager' ? "Rejected" : r.managerApproval, hrApproval: stage === 'hr' ? "Rejected" : r.hrApproval, status: "Rejected", history: newHistory };
    }));
    rejectLeave(id);
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(null);
    }
  };

  const handleSubmitRequest = () => {
    if (!newForm.employee.trim()) { setNewFormError("Employee name is required"); return; }
    if (!newForm.from || !newForm.to) { setNewFormError("Both from and to dates are required"); return; }
    if (new Date(newForm.from) > new Date(newForm.to)) { setNewFormError("From date must be before to date"); return; }

    const from = new Date(newForm.from);
    const to = new Date(newForm.to);
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newId = `LR${String(Date.now()).slice(-4)}`;
    const initials = newForm.employee.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["linear-gradient(135deg,#059669,#047857)", "linear-gradient(135deg,#3B82F6,#2563EB)", "linear-gradient(135deg,#8B5CF6,#7C3AED)", "linear-gradient(135deg,#F59E0B,#D97706)"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const fromLabel = from.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const toLabel = to.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Add to local display state
    const localRequest: LeaveRequest = {
      id: newId,
      employee: newForm.employee.trim(),
      department: newForm.department,
      initials,
      avatarColor: color,
      type: newForm.leaveType,
      from: fromLabel,
      to: toLabel,
      days,
      managerApproval: "Pending",
      hrApproval: "Pending",
      status: "Pending",
      remarks: newForm.remarks,
      history: [{ date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), action: "Submitted", by: newForm.employee.trim() }],
    };
    setRequests((prev) => [localRequest, ...prev]);

    // Sync to global context
    const contextRequest: ContextLeaveRequest = {
      id: newId,
      employee: newForm.employee.trim(),
      avatar: "",
      type: newForm.leaveType,
      from: newForm.from,
      to: newForm.to,
      days,
      status: "Pending",
      reason: newForm.remarks,
      managerApproval: "Pending",
      hrApproval: "Pending",
    };
    addLeave(contextRequest);

    setIsNewRequestOpen(false);
    setNewForm({ employee: "", leaveType: "Annual Leave", department: "Engineering", from: "", to: "", remarks: "" });
    setNewFormError("");
  };

  const totalReqs = requests.length + 150 - leaveData.length;
  const approvedReqs = requests.filter(r => r.status === "Approved").length + 114 - leaveData.filter(r => r.status === "Approved").length;
  const pendingReqs = requests.filter(r => r.status === "Pending").length + 20 - leaveData.filter(r => r.status === "Pending").length;
  const rejectedReqs = requests.filter(r => r.status === "Rejected").length + 16 - leaveData.filter(r => r.status === "Rejected").length;

  const dynamicStats = [
    { label: "Total Requests", value: totalReqs, iconBg: "var(--secondary)", iconColor: "var(--primary)", icon: FileText },
    { label: "Pending Approvals", value: pendingReqs, iconBg: "rgba(245, 158, 11, 0.1)", iconColor: "#F59E0B", icon: Clock },
    { label: "Approved Leaves", value: approvedReqs, iconBg: "var(--secondary)", iconColor: "var(--primary)", icon: CheckCircle2 },
    { label: "On Leave Today", value: 12, iconBg: "rgba(14, 165, 233, 0.1)", iconColor: "#0EA5E9", icon: Users },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>Enterprise Leave Module</h2>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>Comprehensive absence management, workflow approvals, and analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-dashed transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
            Export Report
          </button>
          <button 
            onClick={() => setIsNewRequestOpen(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #059669, #047857)", fontSize: "13px", fontWeight: 700 }}>
            <Plus size={16} /> New Request
          </button>
        </div>
      </div>

      {/* Smart Warning Banner */}
      <div className="mb-6 rounded-xl flex items-center justify-between p-4 px-5 shadow-sm border border-orange-200" style={{ backgroundColor: "#FFFBEB" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100">
            <AlertTriangle size={16} color="#D97706" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-900">Critical Coverage Warning: Engineering & Support</p>
            <p className="text-xs font-medium text-orange-700 mt-0.5">3 team members have overlapping leaves requested between Apr 10 - Apr 15. Please review pending approvals.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const conflictReq = requests.find(r => r.conflictWarning);
            if (conflictReq) setSelectedRequest(conflictReq);
          }}
          className="text-xs font-bold text-orange-800 hover:text-orange-900 underline underline-offset-2">
          View Conflicts
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {dynamicStats.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>{card.label}</p>
                  <p className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>{card.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.iconBg }}>
                  <Icon size={20} color={card.iconColor} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Table & Analytics */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main Table Card */}
          <div className="rounded-2xl border shadow-sm flex flex-col bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <CheckCircle2 color="var(--primary)" size={20} />
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Leave Workflow Approvals</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                  <Search size={14} color="var(--muted-foreground)" />
                  <input 
                    className="bg-transparent text-sm w-32 outline-none" 
                    placeholder="Search..." 
                    style={{ color: "var(--foreground)" }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="p-2 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                    <Filter size={14} /> {activeFilter === "All" ? "Filter" : activeFilter}
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-40 border rounded-xl shadow-lg z-50 py-1" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                      {["All", "Pending", "Approved", "Rejected"].map(filterTarget => (
                        <button
                          key={filterTarget}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-zinc-800" style={{ color: "var(--foreground)" }}
                          onClick={() => {
                            setActiveFilter(filterTarget as any);
                            setShowFilterDropdown(false);
                          }}
                        >
                          {filterTarget}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--border)" }}>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Employee</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Leave Detail</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Timeline</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center whitespace-nowrap">Manager</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center whitespace-nowrap">HR</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <CalendarIcon size={32} className="mx-auto mb-3 text-neutral-300 dark:text-zinc-700" />
                        <p className="text-sm font-medium text-neutral-500">No requests found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(req => (
                      <tr key={req.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer" onClick={() => setSelectedRequest(req)}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: req.avatarColor }}>
                              <span className="text-white text-xs font-extrabold">{req.initials}</span>
                            </div>
                            <div>
                               <p className="text-sm font-bold truncate max-w-[120px]" style={{ color: "var(--foreground)" }}>{req.employee}</p>
                               <p className="text-xs font-medium mt-0.5 truncate max-w-[120px]" style={{ color: "var(--muted-foreground)" }}>{req.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{req.type}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{req.days} days</span>
                            {req.criticalRole && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700">Critical</span>}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                           <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{req.from} - {req.to}</p>
                           {req.conflictWarning && <p className="text-[11px] font-medium mt-0.5 text-orange-600 truncate max-w-[140px]" title={req.conflictWarning}>{req.conflictWarning}</p>}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <StatusBadge status={req.managerApproval} small />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <StatusBadge status={req.hrApproval} small />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                          <button 
                            className="p-1.5 rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-zinc-700"
                            onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                          >
                            <MoreVertical size={16} style={{ color: "var(--muted-foreground)" }} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
                            onClick={(e) => { e.stopPropagation(); handleDelete(req.id); }}
                          >
                            <Trash2 size={16} style={{ color: "#EF4444" }} />
                          </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex justify-between items-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
               <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Showing {filtered.length} requests</p>
               <div className="flex gap-1">
                 <button className="px-2.5 py-1 text-xs font-bold rounded" style={{ backgroundColor: "var(--primary)", color: "white" }}>1</button>
                 <button className="px-2.5 py-1 text-xs font-bold rounded text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-800">2</button>
               </div>
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl border p-5 bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Leave Distribution</h3>
                <BarChart2 size={16} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <div className="space-y-4">
                {leaveDistribution.map(dist => (
                  <div key={dist.type}>
                     <div className="flex justify-between text-xs font-semibold mb-1.5">
                       <span style={{ color: "var(--foreground)" }}>{dist.type}</span>
                       <span style={{ color: "var(--muted-foreground)" }}>{dist.value}%</span>
                     </div>
                     <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                       <div className="h-full rounded-full transition-all" style={{ width: `${dist.value}%`, backgroundColor: dist.color }} />
                     </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rounded-2xl border p-5 bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Team Availability Trend</h3>
                <Activity size={16} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <div className="h-32 flex items-end gap-2 mt-4 px-2">
                {[80, 85, 75, 90, 95, 88, 85].map((val, i) => (
                   <div key={i} className="flex-1 rounded-t-sm flex flex-col justify-end" style={{ height: '100%' }}>
                     <div className="w-full rounded-t-sm transition-all hover:opacity-80" style={{ height: `${val}%`, backgroundColor: val < 80 ? '#F59E0B' : 'var(--primary)', opacity: val < 80 ? 0.8 : 0.4 }} />
                   </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-neutral-400 uppercase">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Calendar & Widgets */}
        <div className="space-y-6">
          
          {/* Team Leave Calendar */}
          <div className="rounded-2xl border p-4 shadow-sm bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Team Calendar</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }} onClick={() => setCurrentMonth(m => Math.max(0, m - 1))}>
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold mx-1" style={{ color: "var(--foreground)", width: '60px', textAlign: 'center' }}>
                   {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currentMonth]}
                </span>
                <button className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }} onClick={() => setCurrentMonth(m => Math.min(11, m + 1))}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-[11px] font-bold uppercase" style={{ color: "var(--muted-foreground)" }}>{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === 14 && currentMonth === 3;
                const leaves = currentMonth === 3 ? [
                  { day: 8, color: "#14B8A6" },
                  { day: 10, color: "#F59E0B" },
                  { day: 11, color: "#059669" },
                  { day: 12, color: "#059669" },
                  { day: 15, color: "#F59E0B" },
                  { day: 22, color: "#0EA5E9" },
                ].filter(l => l.day === day) : [];

                return (
                  <div key={day} className={`aspect-square flex flex-col justify-between p-1 border rounded-lg cursor-pointer transition-colors ${isToday ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-neutral-50 dark:hover:bg-zinc-800'} `} style={{ borderColor: isToday ? 'var(--primary)' : 'var(--border)', backgroundColor: isToday ? 'var(--secondary)' : 'transparent' }}>
                    <span className={`text-[11px] font-semibold text-left ml-0.5 ${isToday ? 'text-emerald-700' : 'text-neutral-600 dark:text-neutral-400'}`}>{day}</span>
                    <div className="flex flex-wrap gap-0.5 h-1/2 mt-0.5 p-0.5">
                      {leaves.map((l, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 border-t pt-4 flex flex-wrap gap-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#059669" }} /> Annual
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#14B8A6" }} /> Sick
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#F59E0B" }} /> Casual
              </div>
            </div>
          </div>

          {/* Pending Approvals Widget */}
          <div className="rounded-2xl border p-5 shadow-sm bg-white dark:bg-zinc-900" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-base font-bold mb-4" style={{ color: "var(--foreground)" }}>Action Required</h3>
            <div className="space-y-3">
              {requests.filter(r => r.status === "Pending").slice(0, 3).map(req => (
                <div key={req.id} className="p-3 rounded-xl border flex gap-3 hover:shadow-sm transition-shadow cursor-pointer" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }} onClick={() => setSelectedRequest(req)}>
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: req.avatarColor }}>
                    {req.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>{req.employee}</p>
                    <p className="text-xs font-medium text-neutral-500 mb-1">{req.type} ({req.days}d)</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">{req.managerApproval === "Pending" ? "Mgr Approval" : "HR Approval"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Render Detail Drawer conditionally */}
      {selectedRequest && (
        <DetailDrawer 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* New Request Modal */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setIsNewRequestOpen(false)}>
          <div className="w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>New Leave Request</h3>
              <button onClick={() => setIsNewRequestOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {newFormError && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {newFormError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Employee Name</label>
                <input type="text" className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="E.g., John Doe" value={newForm.employee} onChange={(e) => { setNewForm({ ...newForm, employee: e.target.value }); setNewFormError(""); }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Leave Type</label>
                  <select className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={newForm.leaveType} onChange={(e) => setNewForm({ ...newForm, leaveType: e.target.value })}>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Department</label>
                  <select className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={newForm.department} onChange={(e) => setNewForm({ ...newForm, department: e.target.value })}>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>From Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={newForm.from} onChange={(e) => { setNewForm({ ...newForm, from: e.target.value }); setNewFormError(""); }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>To Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} value={newForm.to} onChange={(e) => { setNewForm({ ...newForm, to: e.target.value }); setNewFormError(""); }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Remarks (Optional)</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent resize-none" style={{ borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="Add any comments or reasons..." value={newForm.remarks} onChange={(e) => setNewForm({ ...newForm, remarks: e.target.value })} />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <button onClick={() => { setIsNewRequestOpen(false); setNewFormError(""); }} className="px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--foreground)" }}>Cancel</button>
              <button
                onClick={handleSubmitRequest}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setIsExportOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <div className="flex items-center gap-2">
                <Download size={18} style={{ color: "var(--primary)" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Export Report</h3>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors" style={{ color: "var(--muted-foreground)" }}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setExportFormat("CSV")}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-emerald-500/20 ${exportFormat === "CSV" ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border hover:border-emerald-500 hover:text-emerald-600 bg-transparent"} `}
                    style={exportFormat === "CSV" ? {} : { borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    CSV
                  </button>
                  <button 
                    onClick={() => setExportFormat("Excel")}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-emerald-500/20 ${exportFormat === "Excel" ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border hover:border-emerald-500 hover:text-emerald-600 bg-transparent"} `}
                    style={exportFormat === "Excel" ? {} : { borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    Excel
                  </button>
                  <button 
                    onClick={() => setExportFormat("PDF")}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-emerald-500/20 ${exportFormat === "PDF" ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border hover:border-emerald-500 hover:text-emerald-600 bg-transparent"} `}
                    style={exportFormat === "PDF" ? {} : { borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    PDF
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Date Range</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-transparent [&>option]:bg-[var(--card)]" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="q1">Q1 2026</option>
                  <option value="ytd">Year to Date</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="include-rejected" className="rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                <label htmlFor="include-rejected" className="text-sm font-medium cursor-pointer" style={{ color: "var(--muted-foreground)" }}>Include rejected requests</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <button onClick={() => setIsExportOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--foreground)" }}>Cancel</button>
              <button 
                onClick={handleExport}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
