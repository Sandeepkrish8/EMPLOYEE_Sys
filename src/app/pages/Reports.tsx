import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Download, FileText, TrendingUp, Users, DollarSign, Calendar, ArrowLeft, Search, ChevronDown, Star, Check, X, AlertTriangle, Clock, ArrowLeftRight, CheckCircle, XCircle, FileDown, Table, Eye, ChevronRight, MessageSquare } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

/* ─── Shared data ─── */
const headcountTrend = [
  { month: "Oct", count: 228 }, { month: "Nov", count: 233 }, { month: "Dec", count: 235 },
  { month: "Jan", count: 237 }, { month: "Feb", count: 241 }, { month: "Mar", count: 244 }, { month: "Apr", count: 248 },
];

const swapTrendData = [
  { week: "Mar W3", submitted: 4, approved: 2, declined: 1 },
  { week: "Mar W4", submitted: 6, approved: 4, declined: 1 },
  { week: "Apr W1", submitted: 5, approved: 3, declined: 0 },
  { week: "Apr W2", submitted: 9, approved: 4, declined: 1 },
];

const swapTrendMonthData = [
  { month: "Jan", submitted: 18, approved: 12, declined: 2 },
  { month: "Feb", submitted: 22, approved: 15, declined: 4 },
  { month: "Mar", submitted: 26, approved: 18, declined: 5 },
  { month: "Apr", submitted: 14, approved: 8, declined: 2 },
];

const swapReasonData = [
  { name: "Personal", value: 35, count: 9, color: "#059669" },
  { name: "Medical", value: 25, count: 6, color: "#14B8A6" },
  { name: "Travel", value: 20, count: 5, color: "#34D39A" },
  { name: "Family", value: 12, count: 3, color: "#F59E0B" },
  { name: "Other", value: 8, count: 1, color: "#D1D5DB" },
];

const swapRequests = [
  { id: "SWP-001", from: "Sarah Johnson", fromRole: "Nurse Practitioner", fromDept: "Emergency", to: "Marcus Williams", toRole: "Nurse Practitioner", origin: "Morning", originDate: "Apr 7", requested: "Evening", requestedDate: "Apr 8", reason: "Doctor appointment", submitted: "2 days ago", status: "Pending" },
  { id: "SWP-002", from: "Ravi Kumar", fromRole: "Senior Surgeon", fromDept: "Surgical", to: "James Carter", toRole: "Senior Surgeon", origin: "Evening", originDate: "Apr 9", requested: "Morning", requestedDate: "Apr 10", reason: "Family event", submitted: "3 days ago", status: "Approved" },
  { id: "SWP-003", from: "Yuki Tanaka", fromRole: "Pediatrician", fromDept: "Pediatrics", to: "Emily Rodriguez", toRole: "Pediatrician", origin: "Night", originDate: "Apr 11", requested: "Full Day", requestedDate: "Apr 12", reason: "Travel plans", submitted: "4 days ago", status: "Pending" },
  { id: "SWP-004", from: "Robert Chen", fromRole: "Anesthesiologist", fromDept: "Surgical", to: "Priya Sharma", toRole: "Anesthesiologist", origin: "Morning", originDate: "Apr 6", requested: "Evening", requestedDate: "Apr 7", reason: "Personal commitments", submitted: "1 day ago", status: "Approved" },
  { id: "SWP-005", from: "Anita Desai", fromRole: "Radiologist", fromDept: "Diagnosis", to: "Siddharth Rao", toRole: "Radiologist", origin: "Evening", originDate: "Apr 13", requested: "Morning", requestedDate: "Apr 14", reason: "Educational Seminar", submitted: "5 days ago", status: "Declined" },
  { id: "SWP-006", from: "Kevin Malone", fromRole: "Lab Tech", fromDept: "Diagnostics", to: "Oscar Martinez", toRole: "Lab Tech", origin: "Full Day", originDate: "Apr 15", requested: "Night", requestedDate: "Apr 16", reason: "Personal", submitted: "Today", status: "Pending" },
  { id: "SWP-007", from: "Jim Halpert", fromRole: "Consultant", fromDept: "Outpatient", to: "Dwight Schrute", toRole: "Consultant", origin: "Morning", originDate: "Apr 18", requested: "Evening", requestedDate: "Apr 19", reason: "Family event", submitted: "2 days ago", status: "Approved" },
  { id: "SWP-008", from: "Pam Beesly", fromRole: "Staff Nurse", fromDept: "Emergency", to: "Phyllis Vance", toRole: "Staff Nurse", origin: "Night", originDate: "Apr 20", requested: "Morning", requestedDate: "Apr 21", reason: "Doctor appointment", submitted: "3 days ago", status: "Pending" },
];

/* ══════════════════════════════════════════════ */
/* 8. OVERTIME MONITORING REPORT                 */
/* ══════════════════════════════════════════════ */
const otTrendData = [
  { week: "Feb W3", hours: 64 },
  { week: "Feb W4", hours: 82 },
  { week: "Mar W1", hours: 105 },
  { week: "Mar W2", hours: 95 },
  { week: "Mar W3", hours: 130 },
  { week: "Apr W1", hours: 142 },
];

const otTrendMonthData = [
  { week: "Jan", hours: 320 },
  { week: "Feb", hours: 450 },
  { week: "Mar", hours: 580 },
  { week: "Apr", hours: 142 }, // Current partial month
];

const otDeptData = [
  { name: "Operations", hours: 42, status: "High", color: "#EF4444" },
  { name: "Engineering", hours: 31, status: "High", color: "#EF4444" },
  { name: "Sales", hours: 24, status: "Med", color: "#F59E0B" },
  { name: "Finance", hours: 18, status: "Med", color: "#F59E0B" },
  { name: "Marketing", hours: 14, status: "OK", color: "#34D39A" },
  { name: "HR", hours: 8, status: "OK", color: "#34D39A" },
  { name: "Design", hours: 5, status: "OK", color: "#34D39A" },
];

const otEmployeeData = [
  { name: "Ravi Kumar", dept: "Operations", role: "Senior Supervisor", reg: 40, ot: 18, total: 58, days: 4, pay: 810, status: "Exceeded" },
  { name: "James Carter", dept: "Finance", role: "Sr. Accountant", reg: 40, ot: 17, total: 57, days: 4, pay: 765, status: "Exceeded" },
  { name: "Sarah Johnson", dept: "Engineering", role: "Staff Engineer", reg: 40, ot: 16, total: 56, days: 3, pay: 720, status: "Exceeded" },
  { name: "Marcus Williams", dept: "Marketing", role: "Manager", reg: 40, ot: 13, total: 53, days: 3, pay: 585, status: "High" },
  { name: "Anita Desai", dept: "Operations", role: "Specialist", reg: 40, ot: 12, total: 52, days: 3, pay: 540, status: "High" },
  { name: "Robert Chen", dept: "Finance", role: "Analyst", reg: 40, ot: 11, total: 51, days: 2, pay: 495, status: "High" },
  { name: "Yuki Tanaka", dept: "Engineering", role: "Lead Dev", reg: 40, ot: 9, total: 49, days: 2, pay: 405, status: "Normal" },
  { name: "Kevin Malone", dept: "Logistics", role: "Associate", reg: 40, ot: 8, total: 48, days: 2, pay: 360, status: "Normal" },
];

const otShiftData = [
  { name: "Night Shift", hours: 64, value: 45, color: "#8B5CF6" },
  { name: "Evening Shift", hours: 44, value: 31, color: "#F59E0B" },
  { name: "Morning Shift", hours: 20, value: 14, color: "#059669" },
  { name: "Full Day", hours: 14, value: 10, color: "#0EA5E9" },
];

const otCostForecast = [
  { week: "Week 1", amount: 2100, actual: true },
  { week: "Week 2", amount: 3420, actual: true },
  { week: "Week 3", amount: 3840, actual: true },
  { week: "Week 4", amount: 4260, actual: false },
];

function OvertimeMonitoringReport({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [trendTab, setTrendTab] = useState("6 Weeks");

  const departments = ["All Departments", ...Array.from(new Set(otEmployeeData.map(e => e.dept)))];

  const filteredEmployees = otEmployeeData.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    const cleanFilter = filter.split(' ')[0]; // Handle "All (23)" -> "All"
    if (cleanFilter === "Exceeded") matchesTab = e.status === "Exceeded";
    else if (cleanFilter === "High") matchesTab = e.status === "High";
    else if (cleanFilter === "Low") matchesTab = e.status === "Normal";

    const matchesDept = deptFilter === "All Departments" || e.dept === deptFilter;
    
    return matchesSearch && matchesTab && matchesDept;
  });

  const handleExportCSV = () => {
    const headers = ["Employee", "Role", "Department", "Regular Hours", "OT Hours", "Total Hours", "Est. Pay", "Status"];
    const rows = filteredEmployees.map(e => [e.name, e.role, e.dept, e.reg, e.ot, e.total, `₹${e.pay}`, e.status]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overtime_monitoring_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const rows = filteredEmployees.map(e => 
      `<tr>
        <td style="padding:10px;border-bottom:1px solid #eee"><b>${e.name}</b><br/><small>${e.role}</small></td>
        <td style="padding:10px;border-bottom:1px solid #eee">${e.dept}</td>
        <td style="padding:10px;border-bottom:1px solid #eee">${e.ot} hrs</td>
        <td style="padding:10px;border-bottom:1px solid #eee;color:#F59E0B">₹${e.pay}</td>
      </tr>`
    ).join("");
    
    printWindow.document.write(`
      <html><head><title>Overtime Monitoring Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#F59E0B;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px;background:#FEF3C7;color:#92400E;font-size:11px;text-transform:uppercase;border-bottom:2px solid #F59E0B}</style></head>
      <body><h1>Overtime Monitoring Report</h1><p>${filteredEmployees.length} records · Produced ${new Date().toLocaleDateString()}</p>
      <table><thead><tr><th>Employee</th><th>Dept</th><th>OT Hours</th><th>Est. OT Pay</th></tr></thead><tbody>${rows}</tbody></table></body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <ReportHeader 
        title="Overtime Monitoring Report" 
        subtitle="Consolidated overtime tracking across all departments · 142 hrs · Generated Today"
        onBack={onBack}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />

      {/* Alert Banner */}
      <div className="rounded-2xl p-4 border-l-4 flex items-center justify-between" style={{ backgroundColor: "#FEF3C7", borderColor: "#FDE68A", borderLeftColor: "#F59E0B" }}>
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-white/50">
            <AlertTriangle size={20} color="#F59E0B" />
          </div>
          <div>
            <p style={{ color: "#92400E", fontSize: "14px", fontWeight: 700 }}>3 employees have exceeded the 15-hour weekly overtime limit.</p>
            <p style={{ color: "#92400E", fontSize: "13px", marginTop: "2px" }}>Ravi Kumar (18 hrs), James Carter (17 hrs), Sarah Johnson (16 hrs) require immediate schedule review.</p>
          </div>
        </div>
        <button 
          className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-transform active:scale-95" 
          style={{ backgroundColor: "#F59E0B" }}
          onClick={() => navigate('/schedule')}
        >
          Review Schedules
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total OT Hours" value="142 hrs" color="#F59E0B" />
        <KpiCard label="Employees on OT" value="23 (9.3%)" color="var(--primary)" />
        <KpiCard label="Avg OT / Employee" value="6.2 hrs" color="#10B981" />
        <KpiCard label="OT Cost Estimate" value="₹4,260" color="#F59E0B" />
      </div>

      {/* Row 2 - Charts */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left: OT Trend */}
        <div className="col-span-3 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>{trendTab === '6 Weeks' ? 'Weekly Overtime Trend' : 'Monthly Overtime Trend'}</h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: "#ECFDF5", color: "#059669" }}>Last {trendTab === '6 Weeks' ? '6 weeks' : '4 months'}</span>
              </div>
              <div className="flex bg-[var(--background)] p-1 rounded-full border" style={{ borderColor: "var(--border)" }}>
                <button 
                  onClick={() => setTrendTab("6 Weeks")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${trendTab === '6 Weeks' ? 'text-white bg-[#059669]' : 'text-[#6B7280] hover:text-[#059669]'}`}
                >
                  6 Weeks
                </button>
                <button 
                  onClick={() => setTrendTab("3 Months")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${trendTab === '3 Months' ? 'text-white bg-[#059669]' : 'text-[#6B7280] hover:text-[#059669]'}`}
                >
                  3 Months
                </button>
              </div>
           </div>
           
           <div className="h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendTab === '6 Weeks' ? otTrendData : otTrendMonthData}>
                   <defs>
                      <linearGradient id="otGrad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                         <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                   </defs>
                   <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                   <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: "#0F3047", border: "none", borderRadius: "10px", color: "white", padding: "12px" }}
                      itemStyle={{ color: "white", fontSize: "12px" }}
                   />
                   <Area type="monotone" dataKey="hours" stroke="#F59E0B" strokeWidth={3} fill="url(#otGrad)" dot={{ fill: "#F59E0B", stroke: "white", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                   {/* Threshold Line at 100 */}
                   <Line type="monotone" dataKey={() => 100} stroke="#EF4444" strokeDasharray="5 5" dot={false} strokeWidth={1} label={{ value: "Limit: 100h", position: "insideRight", fill: "#EF4444", fontSize: 10 }} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Right: Dept Breakdown */}
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
           <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>OT Hours by Department</h3>
              <span className="text-[11px] font-bold text-[#6B7280]">This week</span>
           </div>
           
           <div className="space-y-4">
              {otDeptData.map((d, i) => (
                <div key={i} className="group cursor-pointer">
                   <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-[#0F3047] w-[130px]">{d.name}</span>
                      <div className="flex items-center gap-3 flex-1 px-4">
                         <div className="h-2.5 w-full rounded-full bg-[#FEF3C7] relative overflow-hidden">
                           <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.hours / 45) * 100}%`, backgroundColor: d.color }} />
                         </div>
                      </div>
                      <div className="flex items-center gap-2 w-[80px] justify-end">
                         <span className="text-[13px] font-bold" style={{ color: d.color }}>{d.hours} hrs</span>
                         <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ 
                            backgroundColor: d.status === 'High' ? "#FEE2E2" : d.status === 'Med' ? "#FEF3C7" : "#DCFCE7",
                            color: d.status === 'High' ? "#991B1B" : d.status === 'Med' ? "#92400E" : "#166534"
                         }}>{d.status}</span>
                      </div>
                   </div>
                   <div className="h-[1px] w-full bg-[#F0FDF4] group-last:hidden" />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Row 3 - Employee OT Details Table */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Employee Overtime Details</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Week of Apr 6–12, 2026</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
               <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:outline-none w-[220px]" 
                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
             </div>
             <div className="relative">
               <button 
                className="px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors hover:bg-gray-50 flex items-center gap-2" 
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
               >
                {deptFilter === "All Departments" ? "Filter" : deptFilter} <ChevronDown size={14} />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-1 z-30 w-[180px] bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-xl overflow-hidden py-1">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${deptFilter === dept ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-foreground'}`}
                      onClick={() => {
                        setDeptFilter(dept);
                        setShowFilterDropdown(false);
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
             </div>
          </div>
        </div>

        <div className="flex px-6 border-b" style={{ borderColor: "var(--border)" }}>
          {['All (23)', 'Exceeded Limit (3)', 'High OT (8)', 'Low OT (12)'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`py-4 px-1 mr-8 text-xs font-bold transition-all border-b-2 ${filter === t || (filter === 'All' && t.startsWith('All')) ? 'text-[#059669] border-[#059669]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}>
                {['Employee', 'Department', 'Regular', 'OT Hours', 'Total', 'Days', 'Est. Pay', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground)", opacity: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredEmployees.map((e, i) => (
                <tr key={i} className="hover:bg-[var(--secondary)] transition-colors h-[64px]">
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>{e.name.split(' ').map(n=>n[0]).join('')}</div>
                      <div>
                        <p style={{ color: "var(--foreground)", fontWeight: 700 }}>{e.name}</p>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{e.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                     <span className="px-2 py-0.5 rounded text-[11px] font-bold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{e.dept}</span>
                  </td>
                  <td className="px-6 py-2 font-mono" style={{ color: "var(--foreground)" }}>{e.reg} hrs</td>
                  <td className="px-6 py-2">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.ot > 15 ? "#EF4444" : e.ot >= 10 ? "#F59E0B" : "#059669" }} />
                           <span className="font-bold" style={{ color: e.ot > 15 ? "#EF4444" : e.ot >= 10 ? "#F59E0B" : "#059669" }}>{e.ot} hrs</span>
                        </div>
                        <div className="w-16 h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                           <div className="h-full rounded-full" style={{ width: `${(e.ot / 20) * 100}%`, backgroundColor: e.ot > 15 ? "#EF4444" : e.ot >= 10 ? "#F59E0B" : "#059669" }} />
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-2 font-mono font-bold" style={{ color: "var(--foreground)" }}>{e.total} hrs</td>
                  <td className="px-6 py-2" style={{ color: "var(--muted-foreground)" }}>{e.days} days</td>
                  <td className="px-6 py-2 font-mono font-bold text-[#F59E0B]">₹{e.pay}</td>
                  <td className="px-6 py-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ 
                      backgroundColor: e.status === 'Exceeded' ? "#FEE2E2" : e.status === 'High' ? "#FEF3C7" : "#DCFCE7",
                      color: e.status === 'Exceeded' ? "#991B1B" : e.status === 'High' ? "#92400E" : "#166534",
                      border: `1px solid ${e.status === 'Exceeded' ? "#FECACA" : "transparent"}`
                    }}>
                      {e.status === 'Exceeded' ? "⚠ Exceeded Limit" : e.status === 'High' ? "High OT" : "Normal"}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                     <div className="flex gap-1.5">
                        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all" onClick={() => navigate('/schedule')} title="View Schedule">
                          <Eye size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all" onClick={() => navigate('/attendance')} title="View Attendance Logs">
                          <Calendar size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all" onClick={() => navigate('/employees')} title="View Employee Profile">
                          <MessageSquare size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-muted-foreground font-bold">No overtime records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row - Insights */}
      <div className="grid grid-cols-2 gap-6">
         {/* Left: OT by Shift */}
         <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Overtime by Shift Type</h3>
            <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "20px" }}>Which shifts generate most OT</p>
            
            <div className="flex items-center gap-12">
               <div className="h-[180px] w-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={otShiftData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {otShiftData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span style={{ color: "#0F3047", fontSize: "18px", fontWeight: 800 }}>142 hrs</span>
                    <span style={{ color: "#6B7280", fontSize: "10px" }}>Total OT</span>
                  </div>
               </div>
               
               <div className="flex-1 space-y-2">
                 {otShiftData.map((s, i) => (
                   <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F0FFF8] transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                         <span className="text-[13px] text-[#0F3047] font-medium">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[13px] font-bold text-[#0F3047]">{s.hours}h</span>
                         <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "#ECFDF5", color: "#059669" }}>{s.value}%</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* Right: OT Cost Forecast */}
         <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-1">
               <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>OT Cost This Month</h3>
               <button className="text-[12px] font-bold text-[#059669] hover:underline" onClick={() => navigate('/attendance')}>Set OT Alert</button>
            </div>
            <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "24px" }}>Projected vs Actual spend</p>
            
            <div className="space-y-4">
               {otCostForecast.map((c, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                       <span style={{ color: "#6B7280", fontWeight: 600 }}>{c.week}</span>
                       <span style={{ color: "#F59E0B", fontWeight: 700 }}>₹{c.amount}</span>
                    </div>
                    <div className="h-2 w-full bg-[#FEF3C7] rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{ width: `${(c.amount / 5000) * 100}%`, backgroundColor: "#F59E0B" }} />
                    </div>
                 </div>
               ))}
               
               <div className="mt-6 p-4 rounded-xl space-y-3" style={{ backgroundColor: "#FEF3C7" }}>
                  <div className="flex items-center justify-between">
                     <p style={{ color: "#92400E", fontSize: "14px", fontWeight: 800 }}>Month Total: ₹13,620 / ₹15,000</p>
                     <p style={{ color: "#92400E", fontSize: "11px", fontWeight: 700 }}>90.8% used</p>
                  </div>
                  <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                     <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "90.8%" }} />
                  </div>
                  <p style={{ color: "#92400E", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                     <AlertTriangle size={14} /> ⚠️ Approaching monthly OT budget limit
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function ShiftSwapReport({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [localRequests, setLocalRequests] = useState(swapRequests);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [chartTab, setChartTab] = useState("Week");

  const departments = ["All Departments", ...Array.from(new Set(swapRequests.map(r => r.fromDept)))];

  const filtered = localRequests.filter(req => {
    const matchesSearch = req.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filter === "All" || req.status === filter;
    const matchesDept = deptFilter === "All Departments" || req.fromDept === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Requester", "Department", "Swap With", "Origin Shift", "Requested Shift", "Reason", "Submitted", "Status"];
    const rows = filtered.map(r => [r.id, r.from, r.fromDept, r.to, `${r.origin} (${r.originDate})`, `${r.requested} (${r.requestedDate})`, r.reason, r.submitted, r.status]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shift_swap_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const rows = filtered.map(r =>
      `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${r.id}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${r.from}<br/><small>${r.fromDept}</small></td>
        <td style="padding:8px;border-bottom:1px solid #eee">${r.to}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${r.origin} → ${r.requested}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${r.status}</td>
      </tr>`
    ).join("");

    printWindow.document.write(`
      <html><head><title>Shift Swap Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head>
      <body><h1>Shift Swap Report</h1><p>${filtered.length} records · Generated ${new Date().toLocaleDateString()}</p>
      <table><thead><tr><th>ID</th><th>Requester</th><th>Swap With</th><th>Shifts</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleApprove = (id: string) => {
    setLocalRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Shift Swap Report"
        subtitle={`Detailed log of all shift exchange requests · ${localRequests.filter(r => r.status === 'Pending').length} pending · Generated Today`}
        onBack={onBack}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Requests" value={String(localRequests.length)} color="var(--primary)" />
        <KpiCard label="Approved Swaps" value={String(localRequests.filter(r => r.status === 'Approved').length)} color="#10B981" />
        <KpiCard label="Pending Review" value={String(localRequests.filter(r => r.status === 'Pending').length)} color="#F59E0B" />
        <KpiCard label="Declined" value={String(localRequests.filter(r => r.status === 'Declined').length)} color="#EF4444" />
      </div>

      {/* Row 2 - Charts */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-8">
            <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Swap Requests — {chartTab === 'Week' ? 'Last 4 Weeks' : 'Last 4 Months'}</h3>
            <div className="flex bg-[#F1FEF2] p-1 rounded-full">
              <button
                onClick={() => setChartTab("Week")}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${chartTab === 'Week' ? 'text-white bg-[#059669]' : 'text-[#6B7280] hover:text-[#059669]'}`}
              >
                Week
              </button>
              <button
                onClick={() => setChartTab("Month")}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${chartTab === 'Month' ? 'text-white bg-[#059669]' : 'text-[#6B7280] hover:text-[#059669]'}`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartTab === 'Week' ? swapTrendData : swapTrendMonthData} barGap={4}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey={chartTab === 'Week' ? "week" : "month"} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: 'rgba(5,150,105,0.05)' }} contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
                <Bar dataKey="submitted" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="declined" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>Reason Breakdown</h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginBottom: "20px" }}>Why employees request swaps</p>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={swapReasonData} innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value">
                  {swapReasonData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>{localRequests.length}</span>
              <span style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>Total Swaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 - Table */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Swap Request Log</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:outline-none w-[180px]"
                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                className="px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors hover:bg-gray-50 flex items-center gap-2"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                {deptFilter === "All Departments" ? "Filter" : deptFilter} <ChevronDown size={14} />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-1 z-30 w-[180px] bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-xl overflow-hidden py-1">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${deptFilter === dept ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-foreground'}`}
                      onClick={() => {
                        setDeptFilter(dept);
                        setShowFilterDropdown(false);
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex px-6 border-b" style={{ borderColor: "var(--border)" }}>
          {['All', 'Pending', 'Approved', 'Declined'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`py-4 px-1 mr-8 text-xs font-bold transition-all border-b-2 ${filter === t ? 'text-[#059669] border-[#059669]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "rgba(5,150,105,0.02)" }}>
                {['ID', 'Requester', 'Swap With', 'Shifts', 'Reason', 'Submitted', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map((req: any, i: number) => (
                <tr key={i} className="hover:bg-[rgba(5,150,105,0.02)] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--primary)" }}>{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ background: "linear-gradient(135deg, #059669 0%, #10B981 100%)" }}>{req.from.split(' ').map((n: string) => n[0]).join('')}</div>
                      <div>
                        <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{req.from}</p>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{req.fromDept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-center">
                      <p style={{ color: "var(--foreground)", fontWeight: 500 }}>{req.to}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold inline-block w-fit" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{req.origin} → {req.requested}</span>
                      <span style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>{req.originDate} ↔ {req.requestedDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--foreground)", maxWidth: "150px" }}>{req.reason}</td>
                  <td className="px-6 py-4" style={{ color: "var(--muted-foreground)" }}>{req.submitted}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{
                      backgroundColor: req.status === 'Approved' ? "#DCFCE7" : req.status === 'Pending' ? "#FEF3C7" : "#FEE2E2",
                      color: req.status === 'Approved' ? "#166534" : req.status === 'Pending' ? "#92400E" : "#991B1B"
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg transition-colors hover:bg-gray-100" style={{ color: "var(--muted-foreground)" }} onClick={() => navigate('/schedule')}><Eye size={14} /></button>
                      {req.status === 'Pending' && <button className="p-1.5 rounded-lg font-bold text-[#059669] hover:bg-emerald-50 text-[11px]" onClick={() => handleApprove(req.id)}>APPROVE</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground font-bold">No swap requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>By Department</h4>
          <div className="space-y-4">
            {[
              { name: 'Operations', count: 8, pct: 100 },
              { name: 'Engineering', count: 6, pct: 75 },
              { name: 'Marketing', count: 4, pct: 50 },
              { name: 'Finance', count: 3, pct: 37 },
            ].map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-[11px] mb-1.5 font-bold" style={{ color: "var(--muted-foreground)" }}>
                  <span>{d.name}</span>
                  <span style={{ color: "var(--primary)" }}>{d.count} requests</span>
                </div>
                <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#059669] rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Most Frequent Requesters</h4>
          <div className="space-y-3">
            {localRequests.filter(r => r.status === 'Approved').slice(0, 4).map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl" style={{ backgroundColor: "var(--background)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#E8FDF0] text-[#059669]">{r.from[0]}</div>
                  <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{r.from}</p>
                </div>
                <span className="text-[11px] font-bold" style={{ color: "var(--primary)" }}>{4 - i} swaps</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const reports = [
  { title: "Headcount Report", desc: "Full employee roster with details", icon: Users, color: "#059669", bg: "#ECFDF5", generated: "Today", size: "248 records" },
  { title: "Payroll Summary", desc: "Monthly payroll breakdown", icon: DollarSign, color: "#22C55E", bg: "#F0FDF4", generated: "Apr 1, 2026", size: "8 pages" },
  { title: "Attendance Report", desc: "Monthly attendance logs", icon: Calendar, color: "#F59E0B", bg: "#FFFBEB", generated: "Apr 1, 2026", size: "30 days" },
  { title: "Performance Review", desc: "Q1 2026 performance scores", icon: TrendingUp, color: "#14B8A6", bg: "#F0FDFA", generated: "Mar 31, 2026", size: "248 reviews" },
  { title: "Recruitment Pipeline", desc: "Hiring funnel & candidate stats", icon: FileText, color: "#0EA5E9", bg: "#F0F9FF", generated: "Apr 5, 2026", size: "12 candidates" },
  { title: "Turnover Analysis", desc: "Employee retention metrics", icon: Users, color: "#EF4444", bg: "#FEF2F2", generated: "Mar 31, 2026", size: "Annual" },
  { title: "Shift Swap Report", desc: "Detailed log of shift exchange requests", icon: Calendar, color: "#10B981", bg: "#ECFDF5", generated: "Today", size: "8 pending" },
  { title: "Overtime Monitoring", desc: "Consolidated overtime tracking", icon: Clock, color: "#F59E0B", bg: "#FFFBEB", generated: "Today", size: "142 hrs" },
];

/* ─── Shared components ─── */
function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl px-5 py-4 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
      <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>{label}</p>
      <p style={{ color, fontSize: "24px", fontWeight: 800, marginTop: "2px" }}>{value}</p>
    </div>
  );
}

function ReportHeader({ title, subtitle, onBack, onExportPDF, onExportCSV }: { title: string; subtitle: string; onBack: () => void; onExportPDF?: () => void; onExportCSV?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} 
          className="p-2 rounded-xl transition-all duration-200" 
          style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(-2px)"; e.currentTarget.style.backgroundColor = "var(--primary)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.backgroundColor = "var(--secondary)"; e.currentTarget.style.color = "var(--primary)"; }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 800 }}>{title}</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onExportPDF} 
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200" 
          style={{ backgroundColor: "transparent", color: "var(--primary)", border: "1.5px solid var(--primary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--primary)"; e.currentTarget.style.color = "white"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5, 150, 105, 0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <FileDown size={14} /> Export PDF
        </button>
        <button onClick={onExportCSV} 
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-sm" 
          style={{ background: "var(--primary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 15px rgba(5, 150, 105, 0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"; }}
        >
          <Table size={14} /> Export Excel
        </button>
      </div>
    </div>
  );
}

const EMERALD_SHADES = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#14B8A6"];

/* ══════════════════════════════════════════════ */
/* 1. HEADCOUNT REPORT                           */
/* ══════════════════════════════════════════════ */
const hcEmployees = [
  { name: "Karan Shah", id: "EMP001", dept: "Engineering", role: "Frontend Dev", location: "Remote", joinDate: "Jan 15, 2024", status: "Active", type: "Full-time", initials: "KS" },
  { name: "Pooja Gupta", id: "EMP002", dept: "Design", role: "UX Designer", location: "Hybrid", joinDate: "Mar 10, 2024", status: "Active", type: "Full-time", initials: "PG" },
  { name: "Tanisha Joshi", id: "EMP003", dept: "Engineering", role: "DevOps Eng.", location: "On-site", joinDate: "Jun 5, 2023", status: "Active", type: "Full-time", initials: "TJ" },
  { name: "Nisha Mishra", id: "EMP004", dept: "Marketing", role: "Product Mgr", location: "Remote", joinDate: "Sep 20, 2023", status: "On Leave", type: "Full-time", initials: "NM" },
  { name: "Siddharth R.", id: "EMP005", dept: "Engineering", role: "Backend Dev", location: "Remote", joinDate: "Feb 1, 2024", status: "Active", type: "Full-time", initials: "SR" },
  { name: "Rohan Verma", id: "EMP006", dept: "Engineering", role: "ML Engineer", location: "Remote", joinDate: "Aug 12, 2023", status: "Active", type: "Contract", initials: "RV" },
  { name: "Aarav Kumar", id: "EMP007", dept: "Sales", role: "Data Analyst", location: "On-site", joinDate: "Nov 3, 2023", status: "Active", type: "Full-time", initials: "AK" },
  { name: "Meera Patel", id: "EMP008", dept: "HR", role: "HR Manager", location: "Hybrid", joinDate: "Apr 18, 2022", status: "Active", type: "Full-time", initials: "MP" },
];
const hcDeptBreakdown = [
  { name: "Engineering", value: 98 }, { name: "Design", value: 32 }, { name: "Marketing", value: 28 },
  { name: "Sales", value: 35 }, { name: "HR", value: 22 }, { name: "Finance", value: 33 },
];

function HeadcountReport({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const perPage = 8;

  const departments = ["All", ...Array.from(new Set(hcEmployees.map(e => e.dept)))];
  const statuses = ["All", ...Array.from(new Set(hcEmployees.map(e => e.status)))];
  const locations = ["All", ...Array.from(new Set(hcEmployees.map(e => e.location)))];

  const filtered = hcEmployees.filter(emp => {
    const matchSearch = search === "" ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || emp.dept === deptFilter;
    const matchStatus = statusFilter === "All" || emp.status === statusFilter;
    const matchLocation = locationFilter === "All" || emp.location === locationFilter;
    return matchSearch && matchDept && matchStatus && matchLocation;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleExportCSV = () => {
    const headers = ["Name", "ID", "Department", "Role", "Location", "Join Date", "Status", "Type"];
    const rows = filtered.map(e => [e.name, e.id, e.dept, e.role, e.location, e.joinDate, e.status, e.type]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "headcount_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const rows = filtered.map(e =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.id}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.role}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.location}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.joinDate}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.status}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.type}</td></tr>`
    ).join("");
    printWindow.document.write(`
      <html><head><title>Headcount Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #059669}</style></head>
      <body><h1>Headcount Report</h1><p>${filtered.length} records · Generated ${new Date().toLocaleDateString()}</p>
      <table><thead><tr><th>Name</th><th>ID</th><th>Department</th><th>Role</th><th>Location</th><th>Join Date</th><th>Status</th><th>Type</th></tr></thead><tbody>${rows}</tbody></table></body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const filterConfigs = [
    { name: "Department", value: deptFilter, options: departments, setter: setDeptFilter },
    { name: "Status", value: statusFilter, options: statuses, setter: setStatusFilter },
    { name: "Location", value: locationFilter, options: locations, setter: setLocationFilter },
  ];

  return (
    <div>
      <ReportHeader 
        title="Headcount Report" 
        subtitle={`${filtered.length} records · Generated Today`} 
        onBack={onBack} 
        onExportPDF={handleExportPDF} 
        onExportCSV={handleExportCSV} 
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Employees" value={String(hcEmployees.length)} color="#059669" />
        <KpiCard label="Active" value={String(hcEmployees.filter(e => e.status === "Active").length)} color="#22C55E" />
        <KpiCard label="On Leave" value={String(hcEmployees.filter(e => e.status === "On Leave").length)} color="#F59E0B" />
        <KpiCard label="Inactive" value={String(hcEmployees.filter(e => e.status === "Inactive").length)} color="#EF4444" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Table Section */}
        <div className="col-span-2 rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          {/* Search + Filter Bar */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                className="rounded-xl pl-9 pr-4 py-2 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", width: "240px" }}
                placeholder="Search employees..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex gap-2">
              {filterConfigs.map(fc => (
                <div key={fc.name} className="relative">
                  <button
                    onClick={() => toggleDropdown(fc.name)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold"
                    style={{
                      border: fc.value !== "All" ? "1px solid var(--primary)" : "1px solid var(--border)",
                      color: fc.value !== "All" ? "var(--primary)" : "var(--muted-foreground)",
                      backgroundColor: fc.value !== "All" ? "var(--secondary)" : "var(--background)",
                    }}
                  >
                    {fc.value !== "All" ? fc.value : fc.name} <ChevronDown size={12} style={{ transform: openDropdown === fc.name ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {openDropdown === fc.name && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                      <div className="absolute right-0 top-full mt-1 z-20 rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", minWidth: "140px" }}>
                        {fc.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => { fc.setter(opt); setOpenDropdown(null); setCurrentPage(1); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium transition-colors"
                            style={{
                              color: opt === fc.value ? "var(--primary)" : "var(--foreground)",
                              backgroundColor: opt === fc.value ? "var(--secondary)" : "transparent",
                            }}
                            onMouseEnter={(e) => { if (opt !== fc.value) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)"; }}
                            onMouseLeave={(e) => { if (opt !== fc.value) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Employee", "ID", "Department", "Role", "Location", "Join Date", "Status", "Type"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>No employees match your filters</p>
                      <button onClick={() => { setSearch(""); setDeptFilter("All"); setStatusFilter("All"); setLocationFilter("All"); }} className="mt-2 text-xs font-semibold" style={{ color: "var(--primary)" }}>Clear all filters</button>
                    </td>
                  </tr>
                ) : (
                  paginated.map((emp, i) => (
                    <tr key={emp.id} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: EMERALD_SHADES[i % 6] }}>{emp.initials}</div>
                          <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{emp.id}</span></td>
                      <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>{emp.dept}</td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.role}</td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.location}</td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.joinDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{
                          backgroundColor: emp.status === "Active" ? "#ECFDF5" : emp.status === "On Leave" ? "#FFFBEB" : "#FEF2F2",
                          color: emp.status === "Active" ? "#059669" : emp.status === "On Leave" ? "#F59E0B" : "#EF4444",
                        }}>{emp.status}</span>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{emp.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              {getPageNumbers().map((p, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: p === currentPage ? "var(--primary)" : "transparent",
                    color: p === currentPage ? "white" : "var(--muted-foreground)",
                    cursor: typeof p === "number" ? "pointer" : "default",
                  }}
                  onClick={() => { if (typeof p === "number") setCurrentPage(p); }}
                  disabled={typeof p !== "number"}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Department Breakdown Sidebar */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Department Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={hcDeptBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {hcDeptBreakdown.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {hcDeptBreakdown.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between cursor-pointer rounded-lg px-2 py-1 transition-colors"
                onClick={() => { setDeptFilter(deptFilter === d.name ? "All" : d.name); setCurrentPage(1); }}
                style={{ backgroundColor: deptFilter === d.name ? "var(--secondary)" : "transparent" }}
              >
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span style={{ color: deptFilter === d.name ? "var(--primary)" : "var(--muted-foreground)", fontSize: "12px", fontWeight: deptFilter === d.name ? 700 : 400 }}>{d.name}</span></div>
                <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 2. PAYROLL SUMMARY                            */
/* ══════════════════════════════════════════════ */
const payrollTrend = [
  { month: "Nov", gross: 82000, net: 68000 }, { month: "Dec", gross: 83500, net: 69200 },
  { month: "Jan", gross: 84200, net: 69800 }, { month: "Feb", gross: 85100, net: 70500 },
  { month: "Mar", gross: 85800, net: 71000 }, { month: "Apr", gross: 86584, net: 71700 },
];
const payrollEmployees = [
  { name: "Karan Shah", dept: "Engineering", basic: 7500, allowances: 1200, deductions: 1850, net: 6850, status: "Paid" },
  { name: "Pooja Gupta", dept: "Design", basic: 6800, allowances: 1000, deductions: 1650, net: 6150, status: "Paid" },
  { name: "Tanisha Joshi", dept: "Engineering", basic: 8200, allowances: 1500, deductions: 2100, net: 7600, status: "Paid" },
  { name: "Nisha Mishra", dept: "Marketing", basic: 7000, allowances: 1100, deductions: 1700, net: 6400, status: "Pending" },
  { name: "Siddharth R.", dept: "Engineering", basic: 7800, allowances: 1300, deductions: 1900, net: 7200, status: "Paid" },
  { name: "Rohan Verma", dept: "Engineering", basic: 9000, allowances: 1800, deductions: 2300, net: 8500, status: "Paid" },
];
const deductionBreakdown = [{ name: "Tax", value: 45 }, { name: "PF", value: 30 }, { name: "Insurance", value: 25 }];

function PayrollSummary({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Department", "Basic Salary", "Allowances", "Deductions", "Net Pay", "Status"];
    const rows = payrollEmployees.map(e => [e.name, e.dept, e.basic, e.allowances, e.deductions, e.net, e.status]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll_summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = payrollEmployees.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.basic.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.allowances.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.deductions.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">₹${e.net.toLocaleString()}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.status}</td></tr>`).join("");
    w.document.write(`<html><head><title>Payroll Summary</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Payroll Summary</h1><p>April 2026</p><table><thead><tr><th>Employee</th><th>Department</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  return (
    <div>
      <ReportHeader title="Payroll Summary — April 2026" subtitle="Monthly payroll breakdown" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard label="Total Gross Payout" value="₹86,584" color="#059669" />
        <KpiCard label="Total Deductions" value="₹14,884" color="#F59E0B" />
        <KpiCard label="Net Disbursed" value="₹71,700" color="#22C55E" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Monthly Payroll Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={payrollTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              <Bar dataKey="gross" fill="#059669" radius={[6, 6, 0, 0]} name="Gross" />
              <Bar dataKey="net" fill="#34D399" radius={[6, 6, 0, 0]} name="Net" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Deduction Breakdown</h4>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deductionBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {deductionBreakdown.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {deductionBreakdown.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{d.name}</span></div>
                <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Employee", "Department", "Basic Salary", "Allowances", "Deductions", "Net Pay", "Status", ""].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {payrollEmployees.map((emp, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.dept}</td>
                <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>₹{emp.basic.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: "#22C55E" }}>+₹{emp.allowances.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: "#EF4444" }}>-₹{emp.deductions.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 700 }}>₹{emp.net.toLocaleString()}</td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: emp.status === "Paid" ? "#ECFDF5" : "#FFFBEB", color: emp.status === "Paid" ? "#059669" : "#F59E0B" }}>{emp.status}</span></td>
                <td className="px-4 py-3"><button onClick={() => {
                  const w = window.open("", "_blank");
                  if (!w) return;
                  w.document.write(`<html><head><title>Payslip - ${emp.name}</title></head><body style="font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a;max-width:600px;margin:0 auto"><h1 style="color:#059669;margin-bottom:4px">Payslip</h1><p style="color:#6b7280;margin-bottom:32px">Employee: <strong style="color:#111827">${emp.name}</strong></p><table style="width:100%;border-collapse:collapse"><tr style="border-bottom:1px solid #e5e7eb"><td style="padding:12px 0;font-size:14px">Gross Payout</td><td style="text-align:right;font-weight:600;font-size:14px">₹${(emp.basic + emp.allowances).toLocaleString()}</td></tr><tr style="border-bottom:1px solid #e5e7eb"><td style="padding:12px 0;color:#ef4444;font-size:14px">Total Deductions</td><td style="text-align:right;color:#ef4444;font-weight:600;font-size:14px">-₹${emp.deductions.toLocaleString()}</td></tr><tr style="border-top:2px solid #059669"><td style="padding:16px 0;font-weight:800;font-size:16px">Net Pay</td><td style="text-align:right;color:#059669;font-size:22px;font-weight:900">₹${emp.net.toLocaleString()}</td></tr></table><p style="margin-top:32px;font-size:12px;color:#9ca3af;text-align:center">This is a system-generated payslip.</p></body></html>`);
                  w.document.close(); w.print();
                }} className="text-xs font-semibold hover:underline" style={{ color: "var(--primary)" }}>Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 3. ATTENDANCE REPORT                          */
/* ══════════════════════════════════════════════ */
const attendanceData = [
  { name: "Karan Shah", total: 22, present: 20, absent: 1, late: 1, leave: 0, pct: 91 },
  { name: "Pooja Gupta", total: 22, present: 21, absent: 0, late: 1, leave: 0, pct: 95 },
  { name: "Tanisha Joshi", total: 22, present: 22, absent: 0, late: 0, leave: 0, pct: 100 },
  { name: "Nisha Mishra", total: 22, present: 18, absent: 2, late: 0, leave: 2, pct: 82 },
  { name: "Siddharth R.", total: 22, present: 19, absent: 1, late: 2, leave: 0, pct: 86 },
  { name: "Rohan Verma", total: 22, present: 21, absent: 0, late: 0, leave: 1, pct: 95 },
];
const deptAttendance = [
  { dept: "Engineering", pct: 94 }, { dept: "Design", pct: 91 }, { dept: "Marketing", pct: 87 },
  { dept: "Sales", pct: 89 }, { dept: "HR", pct: 96 }, { dept: "Finance", pct: 92 },
];

function AttendanceReport({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Total Days", "Present", "Absent", "Late", "Leave", "Attendance %"];
    const rows = attendanceData.map(e => [e.name, e.total, e.present, e.absent, e.late, e.leave, `${e.pct}%`]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = attendanceData.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.total}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.present}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.absent}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.late}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.leave}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.pct}%</td></tr>`).join("");
    w.document.write(`<html><head><title>Attendance Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Attendance Report</h1><p>April 2026</p><table><thead><tr><th>Employee</th><th>Total Days</th><th>Present</th><th>Absent</th><th>Late</th><th>Leave</th><th>Attendance %</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  const days = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, pct: Math.floor(Math.random() * 30) + 70 }));
  return (
    <div>
      <ReportHeader title="Attendance Report — April 2026" subtitle="Monthly attendance logs" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Present Days" value="20.2" color="#059669" />
        <KpiCard label="Absent Days" value="0.8" color="#EF4444" />
        <KpiCard label="Late Arrivals" value="1.2" color="#F59E0B" />
        <KpiCard label="Avg Work Hours" value="8.4h" color="#14B8A6" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Attendance Heatmap — April 2026</h4>
          <div className="grid grid-cols-10 gap-1.5">
            {days.map(d => (
              <div key={d.day} className="rounded-lg flex items-center justify-center" style={{ aspectRatio: "1", backgroundColor: `rgba(5, 150, 105, ${d.pct / 100})`, minHeight: "32px" }} title={`Day ${d.day}: ${d.pct}%`}>
                <span style={{ color: d.pct > 85 ? "white" : "var(--foreground)", fontSize: "10px", fontWeight: 600 }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3"><span style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>Low</span><div className="flex gap-0.5">{[0.3, 0.5, 0.7, 0.85, 1].map((o, i) => <div key={i} className="w-5 h-3 rounded" style={{ backgroundColor: `rgba(5, 150, 105, ${o})` }} />)}</div><span style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>High</span></div>
        </div>
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Department Attendance</h4>
          <div className="space-y-4">
            {deptAttendance.map(d => (
              <div key={d.dept}>
                <div className="flex items-center justify-between mb-1"><span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{d.dept}</span><span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{d.pct}%</span></div>
                <div className="rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "var(--secondary)" }}><div className="rounded-full h-full" style={{ width: `${d.pct}%`, backgroundColor: "#059669" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Employee", "Total Days", "Present", "Absent", "Late", "Leave", "Attendance %"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {attendanceData.map((emp, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.total}</td>
                <td className="px-4 py-3" style={{ color: "#059669", fontWeight: 600 }}>{emp.present}</td>
                <td className="px-4 py-3" style={{ color: "#EF4444", fontWeight: 600 }}>{emp.absent}</td>
                <td className="px-4 py-3" style={{ color: "#F59E0B", fontWeight: 600 }}>{emp.late}</td>
                <td className="px-4 py-3" style={{ color: "#14B8A6" }}>{emp.leave}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "var(--secondary)" }}><div className="rounded-full h-full" style={{ width: `${emp.pct}%`, backgroundColor: emp.pct >= 90 ? "#059669" : emp.pct >= 80 ? "#F59E0B" : "#EF4444" }} /></div>
                    <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700, minWidth: "32px" }}>{emp.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 4. PERFORMANCE REVIEW                         */
/* ══════════════════════════════════════════════ */
const scoreDistribution = [
  { range: "1.0-1.9", count: 3 }, { range: "2.0-2.9", count: 12 }, { range: "3.0-3.9", count: 85 },
  { range: "4.0-4.4", count: 108 }, { range: "4.5-5.0", count: 40 },
];
const perfEmployees = [
  { name: "Tanisha Joshi", dept: "Engineering", manager: "Raj Sharma", score: 4.8, goals: 96, status: "Completed", date: "Mar 28, 2026" },
  { name: "Karan Shah", dept: "Engineering", manager: "Raj Sharma", score: 4.5, goals: 92, status: "Completed", date: "Mar 27, 2026" },
  { name: "Pooja Gupta", dept: "Design", manager: "Anita Roy", score: 4.3, goals: 88, status: "Completed", date: "Mar 25, 2026" },
  { name: "Rohan Verma", dept: "Engineering", manager: "Raj Sharma", score: 3.9, goals: 80, status: "Completed", date: "Mar 30, 2026" },
  { name: "Nisha Mishra", dept: "Marketing", manager: "Vikram S.", score: 3.5, goals: 72, status: "Pending", date: "—" },
  { name: "Siddharth R.", dept: "Engineering", manager: "Raj Sharma", score: 4.1, goals: 85, status: "Completed", date: "Mar 29, 2026" },
];
const topPerformers = [
  { name: "Tanisha Joshi", score: 4.8, initials: "TJ" }, { name: "Karan Shah", score: 4.5, initials: "KS" },
  { name: "Pooja Gupta", score: 4.3, initials: "PG" }, { name: "Meera Patel", score: 4.2, initials: "MP" },
  { name: "Siddharth R.", score: 4.1, initials: "SR" },
];
const deptScores = [
  { dept: "Engineering", avg: 4.2 }, { dept: "Design", avg: 4.0 }, { dept: "HR", avg: 3.9 },
  { dept: "Sales", avg: 3.7 }, { dept: "Marketing", avg: 3.5 }, { dept: "Finance", avg: 3.8 },
];

function PerformanceReview({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Department", "Manager", "Score", "Goals %", "Status", "Date"];
    const rows = perfEmployees.map(e => [e.name, e.dept, e.manager, e.score, `${e.goals}%`, e.status, e.date]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "performance_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = perfEmployees.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.manager}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.score}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.goals}%</td><td style="padding:8px;border-bottom:1px solid #eee">${e.status}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.date}</td></tr>`).join("");
    w.document.write(`<html><head><title>Performance Review</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Performance Review</h1><p>Q1 2026</p><table><thead><tr><th>Employee</th><th>Department</th><th>Manager</th><th>Score</th><th>Goals %</th><th>Status</th><th>Last Review</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  return (
    <div>
      <ReportHeader title="Performance Review — Q1 2026" subtitle="248 reviews" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Avg Score" value="3.9" color="#059669" />
        <KpiCard label="Top Performers (≥4.5)" value="40" color="#22C55E" />
        <KpiCard label="Needs Improvement (≤2)" value="15" color="#EF4444" />
        <KpiCard label="Reviews Pending" value="23" color="#F59E0B" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Score Distribution Chart */}
        <div className="rounded-2xl p-6 shadow-sm flex flex-col" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Score Distribution</h4>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0F3047", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers List */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}>Top Performers</h4>
          <div className="space-y-4">
            {topPerformers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-emerald-500/5" style={{ backgroundColor: i === 0 ? "var(--secondary)" : "transparent" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm" style={{ background: EMERALD_SHADES[i] }}>{p.initials}</div>
                <div className="flex-1">
                  <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{p.name}</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>Overall Rating</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10">
                  <Star size={12} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 800 }}>{p.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dept Avg Scores List */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}>Dept Avg Scores</h4>
          <div className="space-y-6">
            {deptScores.map(d => (
              <div key={d.dept}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: "var(--muted-foreground)", fontSize: "13px", fontWeight: 500 }}>{d.dept}</span>
                  <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 800 }}>{d.avg}</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "var(--secondary)" }}>
                  <div className="rounded-full h-full transition-all duration-1000" style={{ width: `${(d.avg / 5) * 100}%`, backgroundColor: "#10B981" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Employee", "Department", "Manager", "Score", "Goal Completion", "Status", "Last Review"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {perfEmployees.map((emp, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{emp.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.dept}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{emp.manager}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} fill={s <= Math.round(emp.score) ? "#F59E0B" : "transparent"} color={s <= Math.round(emp.score) ? "#F59E0B" : "#D1D5DB"} />)}<span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700, marginLeft: "4px" }}>{emp.score}</span></div></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 rounded-full overflow-hidden" style={{ height: "5px", backgroundColor: "var(--secondary)" }}><div className="rounded-full h-full" style={{ width: `${emp.goals}%`, backgroundColor: "#059669" }} /></div><span style={{ fontSize: "11px", fontWeight: 600, color: "var(--foreground)" }}>{emp.goals}%</span></div></td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: emp.status === "Completed" ? "#ECFDF5" : "#FFFBEB", color: emp.status === "Completed" ? "#059669" : "#F59E0B" }}>{emp.status}</span></td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{emp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 5. RECRUITMENT PIPELINE REPORT                */
/* ══════════════════════════════════════════════ */
const funnelData = [
  { stage: "Applied", count: 120, conv: "100%" }, { stage: "Screening", count: 68, conv: "57%" },
  { stage: "Interview", count: 35, conv: "51%" }, { stage: "Offer", count: 14, conv: "40%" }, { stage: "Hired", count: 8, conv: "57%" },
];
const recruitCandidates = [
  { name: "Karan Shah", role: "Frontend Dev", source: "LinkedIn", stage: "Hired", applied: "Feb 10", updated: "Mar 28" },
  { name: "Pooja Gupta", role: "UX Designer", source: "Referral", stage: "Offer", applied: "Mar 1", updated: "Apr 2" },
  { name: "Tanisha Joshi", role: "DevOps Eng.", source: "LinkedIn", stage: "Interview", applied: "Mar 15", updated: "Apr 4" },
  { name: "Nisha Mishra", role: "Product Mgr", source: "Job Portal", stage: "Screening", applied: "Mar 20", updated: "Apr 3" },
  { name: "Siddharth R.", role: "Backend Dev", source: "Referral", stage: "Interview", applied: "Mar 12", updated: "Apr 1" },
  { name: "Rohan Verma", role: "ML Engineer", source: "LinkedIn", stage: "Applied", applied: "Apr 1", updated: "Apr 1" },
];
const sourceBreakdown = [{ name: "LinkedIn", value: 45 }, { name: "Referral", value: 28 }, { name: "Job Portal", value: 18 }, { name: "Other", value: 9 }];

function RecruitmentPipeline({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Candidate", "Role Applied", "Source", "Stage", "Applied Date", "Last Updated"];
    const rows = recruitCandidates.map(e => [e.name, e.role, e.source, e.stage, e.applied, e.updated]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recruitment_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = recruitCandidates.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.role}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.source}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.stage}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.applied}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.updated}</td></tr>`).join("");
    w.document.write(`<html><head><title>Recruitment Pipeline Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Recruitment Pipeline Report</h1><p>12 candidates · Apr 5, 2026</p><table><thead><tr><th>Candidate</th><th>Role Applied</th><th>Source</th><th>Stage</th><th>Applied</th><th>Updated</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };
  const stageColor: Record<string, { bg: string; color: string }> = { Applied: { bg: "#ECFDF5", color: "#059669" }, Screening: { bg: "#FFFBEB", color: "#F59E0B" }, Interview: { bg: "#F0FDFA", color: "#14B8A6" }, Offer: { bg: "#F0F9FF", color: "#0EA5E9" }, Hired: { bg: "#ECFDF5", color: "#22C55E" } };
  return (
    <div>
      <ReportHeader title="Recruitment Pipeline Report" subtitle="12 candidates · Apr 5, 2026" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Applicants" value="120" color="#059669" />
        <KpiCard label="Interviews Scheduled" value="35" color="#14B8A6" />
        <KpiCard label="Offers Sent" value="14" color="#0EA5E9" />
        <KpiCard label="Hired This Month" value="8" color="#22C55E" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}>Hiring Funnel</h4>
          <div className="space-y-3">
            {funnelData.map((f, i) => (
              <div key={f.stage} className="flex items-center gap-4">
                <span style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 600, width: "80px" }}>{f.stage}</span>
                <div className="flex-1 relative" style={{ height: "32px" }}>
                  <div className="absolute inset-0 rounded-lg" style={{ width: `${(f.count / 120) * 100}%`, backgroundColor: EMERALD_SHADES[i], opacity: 0.85 }} />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span style={{ color: "white", fontSize: "12px", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>{f.count}</span>
                  </div>
                </div>
                <span style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 600, width: "40px" }}>{f.conv}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>Source Breakdown</h4>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart><Pie data={sourceBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">{sourceBreakdown.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} /></PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">{sourceBreakdown.map((s, i) => (<div key={s.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{s.name}</span></div><span style={{ color: "var(--foreground)", fontSize: "11px", fontWeight: 700 }}>{s.value}%</span></div>))}</div>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Avg. Time-to-Hire</p>
            <p style={{ color: "var(--primary)", fontSize: "28px", fontWeight: 900 }}>18 <span style={{ fontSize: "14px", fontWeight: 600 }}>days</span></p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Candidate", "Role Applied", "Source", "Stage", "Applied Date", "Last Updated"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {recruitCandidates.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                <td className="px-4 py-3" style={{ color: "var(--foreground)", fontWeight: 600 }}>{c.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.role}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.source}</td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: stageColor[c.stage]?.bg, color: stageColor[c.stage]?.color }}>{c.stage}</span></td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.applied}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{c.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* 6. TURNOVER ANALYSIS                          */
/* ══════════════════════════════════════════════ */
const turnoverTrend = [
  { month: "May", rate: 3.8 }, { month: "Jun", rate: 4.2 }, { month: "Jul", rate: 3.5 },
  { month: "Aug", rate: 3.1 }, { month: "Sep", rate: 4.0 }, { month: "Oct", rate: 3.6 },
  { month: "Nov", rate: 3.3 }, { month: "Dec", rate: 4.5 }, { month: "Jan", rate: 3.9 },
  { month: "Feb", rate: 3.7 }, { month: "Mar", rate: 4.1 }, { month: "Apr", rate: 3.2 },
];
const turnoverByDept = [
  { dept: "Engineering", count: 5 }, { dept: "Design", count: 2 }, { dept: "Marketing", count: 4 },
  { dept: "Sales", count: 6 }, { dept: "HR", count: 1 }, { dept: "Finance", count: 3 },
];
const exitReasons = [{ name: "Better Opportunity", value: 40 }, { name: "Relocation", value: 22 }, { name: "Personal", value: 20 }, { name: "Performance", value: 18 }];
const exitedEmployees = [
  { name: "Arun Mehta", dept: "Sales", role: "Sales Exec", tenure: "1.8 yrs", exit: "Mar 15, 2026", reason: "Better Opportunity", interview: true },
  { name: "Priya Nair", dept: "Marketing", role: "Content Lead", tenure: "2.5 yrs", exit: "Feb 28, 2026", reason: "Relocation", interview: true },
  { name: "Deepak Rao", dept: "Engineering", role: "Sr. Developer", tenure: "4.1 yrs", exit: "Jan 20, 2026", reason: "Better Opportunity", interview: false },
  { name: "Sunita Das", dept: "Finance", role: "Accountant", tenure: "3.0 yrs", exit: "Mar 5, 2026", reason: "Personal", interview: true },
  { name: "Vikash Tiwari", dept: "Sales", role: "BDE", tenure: "0.9 yrs", exit: "Feb 10, 2026", reason: "Performance", interview: false },
];
const flightRisks = [
  { name: "Raj Sharma", dept: "Engineering", tenure: "0.6 yrs", score: 2.1, risk: "High" },
  { name: "Anita Desai", dept: "Design", tenure: "1.1 yrs", score: 2.8, risk: "Medium" },
  { name: "Kiran Patel", dept: "Sales", tenure: "0.4 yrs", score: 2.4, risk: "High" },
];

function TurnoverAnalysis({ onBack }: { onBack: () => void }) {
  const handleExportCSV = () => {
    const headers = ["Employee", "Department", "Role", "Tenure", "Exit Date", "Reason", "Process Status"];
    const rows = exitedEmployees.map(e => [e.name, e.dept, e.role, e.tenure, e.exit, e.reason, e.interview ? "Completed" : "Pending"]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "turnover_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = exitedEmployees.map(e => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.dept}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.role}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.tenure}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.exit}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.reason}</td><td style="padding:8px;border-bottom:1px solid #eee">${e.interview ? "Yes" : "No"}</td></tr>`).join("");
    w.document.write(`<html><head><title>Turnover Analysis Report</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}h1{color:#059669;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 8px;background:#f0fdf4;color:#059669;font-size:11px;text-transform:uppercase;border-bottom:2px solid #059669}</style></head><body><h1>Turnover Analysis Report</h1><p>Mar 31, 2026</p><table><thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Tenure</th><th>Exit Date</th><th>Reason</th><th>Interviewed</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div className="space-y-6">
      <ReportHeader title="Turnover Analysis — Annual" subtitle="Mar 31, 2026" onBack={onBack} onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-5">
        <KpiCard label="Turnover Rate" value="4.1%" color="#EF4444" />
        <KpiCard label="Avg Tenure" value="3.2 yrs" color="#10B981" />
        <KpiCard label="Retention Rate" value="96.8%" color="#22C55E" />
      </div>

      {/* Row 2: Analytics Grid */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Monthly Turnover Trend */}
          <div className="rounded-2xl p-6 shadow-sm flex flex-col h-[320px]" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>Monthly Turnover Trend</h4>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginBottom: "20px" }}>May 2025 — Apr 2026</p>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={turnoverTrend}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[2, 5]} hide />
                  <Tooltip contentStyle={{ backgroundColor: "#0F3047", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Turnover by Department */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "24px" }}>Turnover by Department</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turnoverByDept} layout="vertical" margin={{ left: -10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="dept" type="category" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={85} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F3047", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="#34D399" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Exit Reasons */}
          <div className="rounded-2xl p-6 shadow-sm h-1/2 flex flex-col" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}>Top Exit Reasons</h4>
            <div className="flex-1 min-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={exitReasons} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {exitReasons.map((_, i) => <Cell key={i} fill={EMERALD_SHADES[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F3047", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {exitReasons.map((r, i) => (
                <div key={r.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: EMERALD_SHADES[i] }} /><span>{r.name}</span></div>
                  <span className="font-bold">{r.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flight Risk Alert */}
          <div className="rounded-2xl p-6 shadow-sm border border-border" style={{ backgroundColor: "var(--card)" }}>
            <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Flight Risk Summary</h4>
            <div className="space-y-3">
              {flightRisks.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/50">
                  <div>
                    <p style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>{r.name}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>{r.dept} · {r.tenure}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${r.risk === "High" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>{r.risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Full Width Table */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Exited Employees — Annual Log</h4>
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--secondary)] text-[var(--primary)] uppercase">Detailed Summary 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                {["Employee", "Department", "Role", "Tenure", "Exit Date", "Reason", "Process"].map(h => (
                  <th key={h} className="px-6 py-4 text-left font-bold" style={{ color: "var(--muted-foreground)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {exitedEmployees.map((emp, i) => (
                <tr key={i} className="hover:bg-[var(--secondary)] transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground">{emp.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{emp.dept}</td>
                  <td className="px-6 py-4 text-muted-foreground">{emp.role}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-background border border-border">{emp.tenure}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{emp.exit}</td>
                  <td className="px-6 py-4 text-foreground">{emp.reason}</td>
                  <td className="px-6 py-4">
                    {emp.interview ? 
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]"><CheckCircle size={14} /> Completed</div> : 
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px]"><Clock size={14} /> Pending</div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* MAIN REPORTS PAGE                             */
/* ══════════════════════════════════════════════ */
export function Reports() {
  const location = useLocation();
  const [activeReport, setActiveReport] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.activeReport) {
      setActiveReport(location.state.activeReport);
    }
  }, [location.state]);

  // Switch logic for reports
  if (activeReport === "Headcount Report") return <HeadcountReport onBack={() => setActiveReport(null)} />;
  if (activeReport === "Payroll Summary") return <PayrollSummary onBack={() => setActiveReport(null)} />;
  if (activeReport === "Attendance Report") return <AttendanceReport onBack={() => setActiveReport(null)} />;
  if (activeReport === "Performance Review") return <PerformanceReview onBack={() => setActiveReport(null)} />;
  if (activeReport === "Recruitment Pipeline") return <RecruitmentPipeline onBack={() => setActiveReport(null)} />;
  if (activeReport === "Turnover Analysis") return <TurnoverAnalysis onBack={() => setActiveReport(null)} />;
  if (activeReport === "Shift Swap Report") return <ShiftSwapReport onBack={() => setActiveReport(null)} />;
  if (activeReport === "Overtime Monitoring") return <OvertimeMonitoringReport onBack={() => setActiveReport(null)} />;

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: "248", color: "#059669" },
          { label: "Monthly Payroll", value: "₹86,584", color: "#22C55E" },
          { label: "Attendance Rate", value: "88.3%", color: "#F59E0B" },
          { label: "Turnover Rate", value: "3.2%", color: "#EF4444" },
        ].map((s, i) => (
          <KpiCard key={i} label={s.label} value={s.value} color={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Headcount Trend Chart */}
        <div className="col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Headcount Growth Trend</h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "20px" }}>Oct 2025 — Apr 2026</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={headcountTrend}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[220, 255]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#064E3B", border: "none", borderRadius: "10px", color: "white", fontSize: "12px" }} />
              <Area type="monotone" dataKey="count" stroke="#059669" strokeWidth={3} fill="url(#areaGrad)" dot={{ fill: "#059669", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Key Metrics</h3>
          <div className="space-y-4">
            {[
              { label: "Avg. Tenure", value: "3.2 years", bar: 64, color: "#059669" },
              { label: "Avg. Salary", value: "₹94,200", bar: 72, color: "#22C55E" },
              { label: "Training Hours", value: "48 hrs/yr", bar: 48, color: "#14B8A6" },
              { label: "Retention Rate", value: "96.8%", bar: 97, color: "#F59E0B" },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: "#6B7280", fontSize: "12px" }}>{m.label}</span>
                  <span style={{ color: "#022C22", fontSize: "13px", fontWeight: 700 }}>{m.value}</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: "5px", backgroundColor: "#D1FAE5" }}>
                  <div className="rounded-full" style={{ width: `${m.bar}%`, height: "100%", backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Available Reports</h3>
        <div className="grid grid-cols-3 gap-4">
          {reports.map((report, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex items-start justify-between transition-all cursor-pointer border border-border bg-background"
              onClick={() => setActiveReport(report.title)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--secondary)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--background)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: "36px", height: "36px", backgroundColor: report.bg }}>
                  <report.icon size={16} color={report.color} />
                </div>
                <div>
                  <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>{report.title}</p>
                  <p style={{ color: "#6B7280", fontSize: "11px", marginTop: "1px" }}>{report.desc}</p>
                  <p style={{ color: "#CBD5E1", fontSize: "10px", marginTop: "4px" }}>{report.size} · {report.generated}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg transition-colors shrink-0" style={{ color: "#6B7280" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ECFDF5"; (e.currentTarget as HTMLButtonElement).style.color = "#059669"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#6B7280"; }}
              >
                <Download size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
