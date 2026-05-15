import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Download,
  User,
  FileText,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Building2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { employees, performanceData } from "../data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "payroll", label: "Payroll", icon: DollarSign },
  { id: "performance", label: "Performance", icon: TrendingUp },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  Active: { bg: "var(--secondary)", color: "var(--primary)" },
  Inactive: { bg: "rgba(220, 38, 38, 0.1)", color: "#DC2626" },
  "On Leave": { bg: "rgba(245, 158, 11, 0.1)", color: "#D97706" },
};

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const employee = employees.find((e) => e.id === id) || employees[0];
  const status = statusConfig[employee.status] || statusConfig.Active;

  const handleDownloadProfile = () => {
    const dataStr = JSON.stringify(employee, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee.name.replace(/\\s+/g, "_")}_Profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDoc = (doc: any) => {
    const textContent = `Document Name: ${doc.name}\nFile Size: ${doc.size}\nUpload Date: ${new Date(doc.date).toLocaleDateString()}\n\n[This is a mock representation of the actual file content]`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // ensure extension is .txt for mock files
    const filename = doc.name.includes('.') ? doc.name.substring(0, doc.name.lastIndexOf('.')) + '.txt' : doc.name + '.txt';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const infoField = (label: string, value: string, icon?: any) => (
    <div
      key={label}
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
    >
      {icon && (
        <div
          className="flex items-center justify-center rounded-lg mt-0.5 shrink-0"
          style={{ width: "28px", height: "28px", backgroundColor: "var(--secondary)" }}
        >
          {icon}
        </div>
      )}
      <div>
        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase" }}>
          {label}
        </p>
        <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 500, marginTop: "2px" }}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 mb-5 rounded-xl px-3 py-2 transition-colors"
        style={{ color: "var(--muted-foreground)", fontSize: "13px", fontWeight: 500 }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
        }}
      >
        <ArrowLeft size={15} />
        Back to Employee Directory
      </button>

      <div className="flex gap-5">
        {/* Left Panel */}
        <div
          className="rounded-2xl p-6 flex flex-col shadow-sm"
          style={{
            width: "280px",
            minWidth: "280px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="rounded-full object-cover"
                style={{
                  width: "96px",
                  height: "96px",
                  border: "3px solid var(--card)",
                  boxShadow: "0 0 0 3px var(--secondary)",
                }}
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                }}
              />
              <div
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full"
                style={{
                  backgroundColor: employee.status === "Active" ? "#22C55E" : "#F59E0B",
                  border: "2px solid var(--card)",
                }}
              />
            </div>
            <h2 style={{ color: "var(--foreground)", fontSize: "17px", fontWeight: 700, marginTop: "12px" }}>
              {employee.name}
            </h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "2px" }}>{employee.designation}</p>
            <span
              className="mt-2 px-3 py-1 rounded-full"
              style={{
                backgroundColor: status.bg,
                color: status.color,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {employee.status}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "20px 0" }} />

          {/* Info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "var(--secondary)" }}
              >
                <Building2 size={14} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Department</p>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "var(--secondary)" }}
              >
                <Mail size={14} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Email</p>
                <p style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 500, wordBreak: "break-all" }}>
                  {employee.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "var(--secondary)" }}
              >
                <Phone size={14} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Phone</p>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 500 }}>{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "var(--secondary)" }}
              >
                <MapPin size={14} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Location</p>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 500 }}>{employee.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "var(--secondary)" }}
              >
                <Calendar size={14} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Joined</p>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 500 }}>
                  {new Date(employee.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: "30px", height: "30px", backgroundColor: "var(--secondary)" }}
              >
                <Clock size={14} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Employment Type</p>
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 500 }}>{employee.employmentType}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "20px 0" }} />

          {/* Performance score */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>Performance Score</span>
              <span style={{ color: "var(--primary)", fontSize: "16px", fontWeight: 800 }}>
                {employee.performance}%
              </span>
            </div>
            <div
              className="rounded-full overflow-hidden"
              style={{ height: "6px", backgroundColor: "var(--secondary)" }}
            >
              <div
                className="rounded-full"
                style={{
                  height: "100%",
                  width: `${employee.performance}%`,
                  background: "linear-gradient(90deg, #059669, #14B8A6)",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
              }}
            >
              <Pencil size={13} />
              Edit Profile
            </button>
            <button
              onClick={handleDownloadProfile}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "var(--primary)",
                fontSize: "13px",
                backgroundColor: "var(--card)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--card)";
              }}
            >
              <Download size={13} />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 min-w-0">
          {/* Employee ID Banner */}
          <div
            className="rounded-2xl p-4 mb-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #064E3B, #065F46)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: "44px", height: "44px", backgroundColor: "rgba(5,150,105,0.2)", border: "1px solid rgba(5,150,105,0.3)" }}
            >
              <span style={{ color: "#10B981", fontSize: "11px", fontWeight: 800 }}>ID</span>
            </div>
            {[
              { label: "Employee ID", value: employee.id },
              { label: "Manager", value: employee.manager },
              { label: "Employment", value: employee.employmentType },
              { label: "Annual Salary", value: `₹${employee.salary.toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="flex-1">
                <p style={{ color: "#6EE7B7", fontSize: "11px" }}>{item.label}</p>
                <p style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Tab Headers */}
            <div
              className="flex"
              style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-5 py-4 transition-colors"
                  style={{
                    color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
                    borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                    backgroundColor: activeTab === tab.id ? "var(--card)" : "transparent",
                    fontSize: "13px",
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    marginBottom: "-1px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "personal" && (
                <div>
                  <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {infoField(
                      "Full Name",
                      employee.name,
                      <User size={14} color="var(--primary)" />
                    )}
                    {infoField(
                      "Date of Birth",
                      new Date(employee.dob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                      <Calendar size={14} color="var(--primary)" />
                    )}
                    {infoField(
                      "Gender",
                      employee.gender,
                      <User size={14} color="var(--primary)" />
                    )}
                    {infoField(
                      "Phone Number",
                      employee.phone,
                      <Phone size={14} color="var(--primary)" />
                    )}
                    <div className="col-span-2">
                      {infoField(
                        "Home Address",
                        employee.address,
                        <MapPin size={14} color="var(--primary)" />
                      )}
                    </div>
                    <div className="col-span-2">
                      {infoField(
                        "Emergency Contact",
                        employee.emergencyContact,
                        <AlertCircle size={14} color="var(--primary)" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div>
                  <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Documents
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: "Employment Contract.pdf", size: "2.4 MB", date: employee.joinDate, type: "PDF" },
                      { name: "NDA Agreement.pdf", size: "1.1 MB", date: employee.joinDate, type: "PDF" },
                      { name: "ID Verification.jpg", size: "840 KB", date: "2023-01-10", type: "IMG" },
                      { name: "Tax Form W-4.pdf", size: "560 KB", date: "2024-01-01", type: "PDF" },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center rounded-lg"
                            style={{
                              width: "36px",
                              height: "36px",
                              backgroundColor: doc.type === "PDF" ? "#FEF2F2" : "#ECFDF5",
                            }}
                          >
                            <FileText size={16} color={doc.type === "PDF" ? "#EF4444" : "#059669"} />
                          </div>
                          <div>
                            <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{doc.name}</p>
                            <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>
                              {doc.size} • Uploaded {new Date(doc.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadDoc(doc)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                          style={{
                            color: "var(--primary)",
                            backgroundColor: "var(--secondary)",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "attendance" && (
                <div>
                  <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Attendance Summary — April 2026
                  </h4>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Working Days", value: "22", color: "#059669" },
                      { label: "Present", value: "18", color: "#22C55E" },
                      { label: "Absent", value: "2", color: "#EF4444" },
                      { label: "Leaves", value: "2", color: "#F59E0B" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl p-4 text-center"
                        style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                      >
                        <p style={{ color: s.color, fontSize: "22px", fontWeight: 800 }}>{s.value}</p>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "12px", textAlign: "center" }}>
                    Detailed attendance log available in the Attendance module.
                  </p>
                </div>
              )}

              {activeTab === "payroll" && (
                <div>
                  <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Payroll Summary — March 2026
                  </h4>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "Gross Salary", value: `₹${employee.grossSalary?.toLocaleString() || "N/A"}`, color: "#059669", bg: "#ECFDF5" },
                      { label: "Deductions", value: `₹${employee.deductions?.toLocaleString() || "N/A"}`, color: "#EF4444", bg: "#FEF2F2" },
                      { label: "Net Pay", value: `₹${employee.netPay?.toLocaleString() || "N/A"}`, color: "#22C55E", bg: "#F0FDF4" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl p-4 text-center"
                        style={{ border: `1px solid var(--border)`, backgroundColor: "var(--background)" }}
                      >
                        <p style={{ color: s.color, fontSize: "20px", fontWeight: 800 }}>{s.value}</p>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "performance" && (
                <div>
                  <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                    Performance Trend
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[70, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "10px",
                          color: "var(--foreground)",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        key="line-score"
                        type="monotone"
                        dataKey="score"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={{ fill: "var(--primary)", r: 5 }}
                        activeDot={{ r: 7, fill: "var(--primary)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div
                    className="mt-4 rounded-xl p-4 flex items-center justify-between"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                  >
                    <div>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Current Score</p>
                      <p style={{ color: "var(--primary)", fontSize: "22px", fontWeight: 800 }}>{employee.performance}%</p>
                    </div>
                    <div>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Rating</p>
                      <p style={{ color: "#22C55E", fontSize: "14px", fontWeight: 700 }}>
                        {employee.performance >= 90 ? "⭐ Excellent" : employee.performance >= 80 ? "✅ Good" : "📈 Improving"}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>YoY Change</p>
                      <p style={{ color: "#22C55E", fontSize: "14px", fontWeight: 700 }}>+14%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="w-full max-w-md p-6 rounded-2xl shadow-xl"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <h3 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
              Edit Employee Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Full Name</label>
                <input 
                  type="text" 
                  defaultValue={employee.name}
                  className="w-full px-3 py-2 rounded-xl outline-none transition-colors"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Designation</label>
                <input 
                  type="text" 
                  defaultValue={employee.designation}
                  className="w-full px-3 py-2 rounded-xl outline-none transition-colors"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>Department</label>
                <input 
                  type="text" 
                  defaultValue={employee.department}
                  className="w-full px-3 py-2 rounded-xl outline-none transition-colors"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 4px 12px rgba(5,150,105,0.3)" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
