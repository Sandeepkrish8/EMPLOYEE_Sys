import React, { useState } from "react";
import { TrendingUp, DollarSign, Award, Users, CheckCircle, XCircle, Clock, Star, Filter, ChevronDown, AlertCircle, Target, Sparkles, Trophy } from "lucide-react";

const EMPLOYEES = [
  {
    id: 1,
    name: "Emily Chen",
    role: "Frontend Developer",
    department: "Engineering",
    salary: 90000,
    rating: 5,
    increment: 10,
    status: "Pending",
    avatar: "EC",
    color: "#F59E0B",
    tenure: "3.5 years",
  },
  {
    id: 2,
    name: "Ryan Park",
    role: "HR Manager",
    department: "HR",
    salary: 85000,
    rating: 4,
    increment: 7,
    status: "Approved",
    avatar: "RP",
    color: "#3B82F6",
    tenure: "2.8 years",
  },
  {
    id: 3,
    name: "Ava Patel",
    role: "Accountant",
    department: "Finance",
    salary: 78000,
    rating: 3,
    increment: 5,
    status: "Rejected",
    avatar: "AP",
    color: "#8B5CF6",
    tenure: "1.5 years",
  },
  {
    id: 4,
    name: "Lucas Kim",
    role: "Backend Developer",
    department: "Engineering",
    salary: 95000,
    rating: 4,
    increment: 8,
    status: "Pending",
    avatar: "LK",
    color: "#10B981",
    tenure: "4.2 years",
  },
  {
    id: 5,
    name: "Sophia Lee",
    role: "Marketing Lead",
    department: "Marketing",
    salary: 80000,
    rating: 5,
    increment: 12,
    status: "Approved",
    avatar: "SL",
    color: "#EF4444",
    tenure: "5.1 years",
  },
  {
    id: 6,
    name: "David Singh",
    role: "Finance Analyst",
    department: "Finance",
    salary: 76000,
    rating: 2,
    increment: 3,
    status: "Pending",
    avatar: "DS",
    color: "#14B8A6",
    tenure: "1.2 years",
  },
  {
    id: 7,
    name: "Olivia Brown",
    role: "HR Executive",
    department: "HR",
    salary: 72000,
    rating: 3,
    increment: 4,
    status: "Approved",
    avatar: "OB",
    color: "#F97316",
    tenure: "2.3 years",
  },
  {
    id: 8,
    name: "Noah Smith",
    role: "UI Designer",
    department: "Engineering",
    salary: 82000,
    rating: 4,
    increment: 6,
    status: "Pending",
    avatar: "NS",
    color: "#8B5CF6",
    tenure: "3.0 years",
  },
];


const DEPARTMENTS = ["All", ...Array.from(new Set(EMPLOYEES.map(e => e.department)))];
const STATUSES = ["All", "Pending", "Approved", "Rejected"];

function StarRating({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star 
          key={i} 
          size={16} 
          color={i <= value ? "#F59E0B" : "#D1D5DB"}
          fill={i <= value ? "#F59E0B" : "none"}
          style={{ transition: "all 0.2s" }}
        />
      ))}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Approved": return "#10B981";
    case "Rejected": return "#EF4444";
    case "Pending": return "#F59E0B";
    default: return "#6B7280";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Approved": return CheckCircle;
    case "Rejected": return XCircle;
    case "Pending": return Clock;
    default: return AlertCircle;
  }
}

export function IncrementAppraisal() {
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ open: boolean; emp?: any; action?: string }>({ open: false });
  const [comment, setComment] = useState("");
  const [data, setData] = useState(EMPLOYEES);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Filtered employees
  const filtered = data.filter(e =>
    (department === "All" || e.department === department) &&
    (status === "All" || e.status === status)
  );

  // Stats
  const pending = data.filter(e => e.status === "Pending").length;
  const completed = data.filter(e => e.status !== "Pending").length;
  const avgRating = data.length ? (data.reduce((sum, e) => sum + e.rating, 0) / data.length).toFixed(1) : 0;
  const totalBudget = data.reduce((sum, e) => sum + (e.salary * e.increment / 100), 0);
  const approvedCount = data.filter(e => e.status === "Approved").length;

  function handleAction(emp: any, action: string) {
    setModal({ open: true, emp, action });
    setComment("");
  }

  function handleModalSubmit() {
    setData(prev => prev.map(e =>
      e.id === modal.emp.id ? { ...e, status: modal.action === "approve" ? "Approved" : "Rejected" } : e
    ));
    setModal({ open: false });
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .appraisal-card {
          animation: fadeInUp 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .appraisal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
        .table-row {
          transition: all 0.2s ease;
        }
        .table-row:hover {
          background: var(--accent);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            padding: 12,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
          }}>
            <TrendingUp size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 800, 
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.5px",
            }}>
              Increment & Appraisal
            </h1>
            <p style={{ 
              color: "var(--muted-foreground)", 
              fontSize: 15, 
              margin: "4px 0 0 0",
              fontWeight: 500,
            }}>
              Review and approve salary increments based on performance ratings
            </p>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <div 
          className="appraisal-card"
          style={{ 
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)",
            border: "2px solid rgba(245, 158, 11, 0.3)",
            borderRadius: 16, 
            padding: 24,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            background: "rgba(245, 158, 11, 0.1)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: "rgba(245, 158, 11, 0.15)", 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Clock size={28} color="#F59E0B" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Pending Reviews
            </div>
            <div style={{ 
              color: "#F59E0B", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {pending}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: "#F59E0B",
              fontWeight: 600,
              background: "rgba(245, 158, 11, 0.1)",
              padding: "4px 12px",
              borderRadius: 20,
              display: "inline-block",
            }}>
              Awaiting Action
            </div>
          </div>
        </div>

        <div 
          className="appraisal-card"
          style={{ 
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
            border: "2px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 16, 
            padding: 24,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            background: "rgba(16, 185, 129, 0.1)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: "rgba(16, 185, 129, 0.15)", 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <CheckCircle size={28} color="#10B981" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Completed
            </div>
            <div style={{ 
              color: "#10B981", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {completed}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: "#10B981",
              fontWeight: 600,
              background: "rgba(16, 185, 129, 0.1)",
              padding: "4px 12px",
              borderRadius: 20,
              display: "inline-block",
            }}>
              {approvedCount} Approved
            </div>
          </div>
        </div>

        <div 
          className="appraisal-card"
          style={{ 
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)",
            border: "2px solid rgba(139, 92, 246, 0.3)",
            borderRadius: 16, 
            padding: 24,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            background: "rgba(139, 92, 246, 0.1)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: "rgba(139, 92, 246, 0.15)", 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Award size={28} color="#8B5CF6" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Average Rating
            </div>
            <div style={{ 
              color: "#8B5CF6", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {avgRating}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: "#8B5CF6",
              fontWeight: 600,
              background: "rgba(139, 92, 246, 0.1)",
              padding: "4px 12px",
              borderRadius: 20,
              display: "inline-block",
            }}>
              Out of 5.0
            </div>
          </div>
        </div>

        <div 
          className="appraisal-card"
          style={{ 
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            borderRadius: 16, 
            padding: 24,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: "rgba(59, 130, 246, 0.15)", 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <DollarSign size={28} color="#3B82F6" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Total Budget
            </div>
            <div style={{ 
              color: "#3B82F6", 
              fontWeight: 800, 
              fontSize: 28,
              marginBottom: 4,
            }}>
              ₹{totalBudget.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: "#3B82F6",
              fontWeight: 600,
              background: "rgba(59, 130, 246, 0.1)",
              padding: "4px 12px",
              borderRadius: 20,
              display: "inline-block",
            }}>
              Increment Budget
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 16, 
        padding: 20,
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={18} color="var(--muted-foreground)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
            Filters:
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            style={{
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              borderRadius: 10,
              padding: "10px 36px 10px 14px",
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            {DEPARTMENTS.map(dep => (
              <option key={dep} value={dep}>{dep === "All" ? "All Departments" : dep}</option>
            ))}
          </select>
          <ChevronDown 
            size={16} 
            color="var(--muted-foreground)" 
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              borderRadius: 10,
              padding: "10px 36px 10px 14px",
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
          <ChevronDown 
            size={16} 
            color="var(--muted-foreground)" 
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
        </div>
        <div style={{ 
          marginLeft: "auto",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--muted-foreground)",
        }}>
          Showing {filtered.length} of {data.length} employees
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 20, 
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--secondary)" }}>
              <th style={{ padding: "16px 20px", color: "var(--muted-foreground)", fontWeight: 700, fontSize: 12, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Employee
              </th>
              <th style={{ padding: "16px 20px", color: "var(--muted-foreground)", fontWeight: 700, fontSize: 12, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Current Salary
              </th>
              <th style={{ padding: "16px 20px", color: "var(--muted-foreground)", fontWeight: 700, fontSize: 12, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Performance
              </th>
              <th style={{ padding: "16px 20px", color: "var(--muted-foreground)", fontWeight: 700, fontSize: 12, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Increment
              </th>
              <th style={{ padding: "16px 20px", color: "var(--muted-foreground)", fontWeight: 700, fontSize: 12, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                New Salary
              </th>
              <th style={{ padding: "16px 20px", color: "var(--muted-foreground)", fontWeight: 700, fontSize: 12, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Status
              </th>
              <th style={{ padding: "16px 16px", color: "var(--muted-foreground)", fontWeight: 700, fontSize: 12, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px", minWidth: 120 }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, idx) => {
              const StatusIcon = getStatusIcon(emp.status);
              const statusColor = getStatusColor(emp.status);
              const newSalary = Math.round(emp.salary * (1 + emp.increment / 100));
              const incrementAmount = newSalary - emp.salary;
              
              return (
                <tr 
                  key={emp.id} 
                  className="table-row"
                  style={{ 
                    borderBottom: idx === filtered.length - 1 ? "none" : "1px solid var(--border)",
                  }}
                  onMouseEnter={() => setHoveredRow(emp.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        background: emp.color,
                        color: "#fff",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                      }}>
                        {emp.avatar}
                      </div>
                      <div>
                        <div style={{ 
                          color: "var(--foreground)", 
                          fontWeight: 700,
                          fontSize: 14,
                        }}>
                          {emp.name}
                        </div>
                        <div style={{ 
                          color: "var(--muted-foreground)", 
                          fontSize: 12,
                          fontWeight: 500,
                          marginTop: 2,
                        }}>
                          {emp.role} • {emp.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{ 
                      color: "var(--foreground)", 
                      fontWeight: 700,
                      fontSize: 15,
                    }}>
                      ₹{emp.salary.toLocaleString()}
                    </div>
                    <div style={{ 
                      color: "var(--muted-foreground)", 
                      fontSize: 12,
                      fontWeight: 500,
                      marginTop: 2,
                    }}>
                      Tenure: {emp.tenure}
                    </div>
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{ marginBottom: 6 }}>
                      <StarRating value={emp.rating} />
                    </div>
                    <div style={{ 
                      fontSize: 12,
                      fontWeight: 700,
                      color: emp.rating >= 4 ? "#10B981" : emp.rating >= 3 ? "#F59E0B" : "#EF4444",
                    }}>
                      {emp.rating >= 4 ? "Excellent" : emp.rating >= 3 ? "Good" : "Needs Improvement"}
                    </div>
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{ 
                      display: "inline-block",
                      background: `${emp.increment >= 10 ? "#10B981" : emp.increment >= 7 ? "#F59E0B" : "#6B7280"}15`,
                      color: emp.increment >= 10 ? "#10B981" : emp.increment >= 7 ? "#F59E0B" : "#6B7280",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 15,
                    }}>
                      {emp.increment}%
                    </div>
                    <div style={{ 
                      color: "var(--muted-foreground)", 
                      fontSize: 12,
                      fontWeight: 600,
                      marginTop: 4,
                    }}>
                      +₹{incrementAmount.toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{ 
                      color: "#10B981", 
                      fontWeight: 800,
                      fontSize: 16,
                    }}>
                      ₹{newSalary.toLocaleString()}
                    </div>
                    <div style={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 4,
                    }}>
                      <TrendingUp size={14} color="#10B981" />
                      <span style={{ 
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#10B981",
                      }}>
                        {((incrementAmount / emp.salary) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: `${statusColor}15`,
                      color: statusColor,
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13,
                    }}>
                      <StatusIcon size={14} />
                      {emp.status}
                    </div>
                  </td>
                  <td style={{ padding: "18px 16px" }}>
                    {emp.status === "Pending" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" }}>
                        <button
                          onClick={() => handleAction(emp, "approve")}
                          style={{ 
                            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                            color: "#fff", 
                            border: "none", 
                            borderRadius: 8, 
                            padding: "7px 12px", 
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.3)";
                          }}
                        >
                          <CheckCircle size={13} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(emp, "reject")}
                          style={{ 
                            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                            color: "#fff", 
                            border: "none", 
                            borderRadius: 8, 
                            padding: "7px 12px", 
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(239, 68, 68, 0.3)";
                          }}
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      </div>
                    )}
                    {emp.status !== "Pending" && (
                      <div style={{ 
                        color: "var(--muted-foreground)",
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "center",
                      }}>
                        —
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          background: "rgba(0,0,0,0.6)", 
          backdropFilter: "blur(4px)",
          zIndex: 1000, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          animation: "fadeInUp 0.3s ease-out",
        }}>
          <div style={{ 
            background: "var(--card)", 
            border: "1px solid var(--border)", 
            borderRadius: 20, 
            padding: 40, 
            minWidth: 500,
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}>
            <button 
              onClick={() => setModal({ open: false })} 
              style={{ 
                position: "absolute", 
                top: 16, 
                right: 20, 
                background: "var(--secondary)", 
                border: "none", 
                fontSize: 24, 
                color: "var(--muted-foreground)", 
                cursor: "pointer",
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
                e.currentTarget.style.color = "var(--muted-foreground)";
              }}
            >
              ×
            </button>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{
                background: modal.action === "approve" 
                  ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                  : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                padding: 12,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {modal.action === "approve" ? (
                  <CheckCircle size={24} color="#fff" />
                ) : (
                  <XCircle size={24} color="#fff" />
                )}
              </div>
              <div>
                <h2 style={{ 
                  color: "var(--foreground)", 
                  fontWeight: 800, 
                  fontSize: 24, 
                  margin: 0,
                }}>
                  {modal.action === "approve" ? "Approve" : "Reject"} Appraisal
                </h2>
                <p style={{ 
                  color: "var(--muted-foreground)", 
                  fontSize: 14, 
                  margin: "4px 0 0 0",
                }}>
                  {modal.emp?.name} • {modal.emp?.role}
                </p>
              </div>
            </div>

            <div style={{
              background: "var(--secondary)",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)" }}>
                  Current Salary:
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                  ₹{modal.emp?.salary.toLocaleString()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)" }}>
                  Increment:
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>
                  {modal.emp?.increment}% (+₹{modal.emp ? Math.round(modal.emp.salary * modal.emp.increment / 100).toLocaleString() : 0})
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)" }}>
                  New Salary:
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981" }}>
                  ₹{modal.emp ? Math.round(modal.emp.salary * (1 + modal.emp.increment / 100)).toLocaleString() : 0}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--foreground)",
                marginBottom: 8,
              }}>
                Add a comment (optional):
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Enter your feedback or comments..."
                style={{ 
                  width: "100%", 
                  minHeight: 80, 
                  borderRadius: 10, 
                  border: "1px solid var(--border)", 
                  padding: 12, 
                  fontSize: 14, 
                  color: "var(--foreground)", 
                  background: "var(--background)",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              />
            </div>

            <button
              onClick={handleModalSubmit}
              style={{ 
                background: modal.action === "approve"
                  ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                  : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                color: "#fff", 
                border: "none", 
                borderRadius: 10, 
                padding: "12px 28px", 
                fontWeight: 700, 
                fontSize: 15, 
                cursor: "pointer",
                width: "100%",
                boxShadow: modal.action === "approve"
                  ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                  : "0 4px 12px rgba(239, 68, 68, 0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = modal.action === "approve"
                  ? "0 6px 16px rgba(16, 185, 129, 0.4)"
                  : "0 6px 16px rgba(239, 68, 68, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = modal.action === "approve"
                  ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                  : "0 4px 12px rgba(239, 68, 68, 0.3)";
              }}
            >
              {modal.action === "approve" ? "Approve Increment" : "Reject Request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
