import React, { useState } from "react";
import { Trophy, TrendingUp, TrendingDown, Award, Star, Crown, Zap, Target, BarChart3, Users, Calendar, Filter } from "lucide-react";

// Mock data for leaderboard
const EMPLOYEES = [
  {
    id: "1",
    name: "Emily Chen",
    initials: "EC",
    avatarColor: "#14B8A6",
    department: "Engineering",
    score: 98,
    trend: "up",
    improvement: 12,
    tasksCompleted: 47,
    projectsLed: 8,
    streak: 24,
  },
  {
    id: "2",
    name: "Ryan Park",
    initials: "RP",
    avatarColor: "#059669",
    department: "HR",
    score: 94,
    trend: "up",
    improvement: 8,
    tasksCompleted: 42,
    projectsLed: 5,
    streak: 18,
  },
  {
    id: "3",
    name: "Ava Patel",
    initials: "AP",
    avatarColor: "#0EA5E9",
    department: "Finance",
    score: 91,
    trend: "down",
    improvement: -2,
    tasksCompleted: 38,
    projectsLed: 6,
    streak: 15,
  },
  {
    id: "4",
    name: "Lucas Kim",
    initials: "LK",
    avatarColor: "#F59E0B",
    department: "Engineering",
    score: 89,
    trend: "up",
    improvement: 5,
    tasksCompleted: 35,
    projectsLed: 4,
    streak: 12,
  },
  {
    id: "5",
    name: "Sophia Lee",
    initials: "SL",
    avatarColor: "#8B5CF6",
    department: "Marketing",
    score: 87,
    trend: "up",
    improvement: 7,
    tasksCompleted: 33,
    projectsLed: 7,
    streak: 20,
  },
  {
    id: "6",
    name: "David Singh",
    initials: "DS",
    avatarColor: "#EF4444",
    department: "Finance",
    score: 85,
    trend: "down",
    improvement: -3,
    tasksCompleted: 31,
    projectsLed: 3,
    streak: 8,
  },
  {
    id: "7",
    name: "Olivia Brown",
    initials: "OB",
    avatarColor: "#6366F1",
    department: "HR",
    score: 83,
    trend: "up",
    improvement: 4,
    tasksCompleted: 29,
    projectsLed: 5,
    streak: 10,
  },
  {
    id: "8",
    name: "Noah Smith",
    initials: "NS",
    avatarColor: "#F472B6",
    department: "Engineering",
    score: 81,
    trend: "down",
    improvement: -1,
    tasksCompleted: 27,
    projectsLed: 2,
    streak: 6,
  },
  {
    id: "9",
    name: "Mia Garcia",
    initials: "MG",
    avatarColor: "#FBBF24",
    department: "Marketing",
    score: 80,
    trend: "up",
    improvement: 6,
    tasksCompleted: 25,
    projectsLed: 4,
    streak: 14,
  },
  {
    id: "10",
    name: "Ethan Wilson",
    initials: "EW",
    avatarColor: "#10B981",
    department: "Finance",
    score: 78,
    trend: "down",
    improvement: -4,
    tasksCompleted: 23,
    projectsLed: 3,
    streak: 5,
  },
];

const DEPARTMENTS = ["All", ...Array.from(new Set(EMPLOYEES.map(e => e.department)))];
const PERIODS = ["This Month", "This Quarter", "This Year", "All Time"];

function getRankBadge(rank: number) {
  if (rank === 1) {
    return (
      <div style={{ 
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", 
        color: "#fff", 
        fontWeight: 800, 
        padding: "8px 16px", 
        borderRadius: 12, 
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
      }}>
        <Crown size={18} fill="#fff" />
        <span>1st</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div style={{ 
        background: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)", 
        color: "#fff", 
        fontWeight: 800, 
        padding: "8px 16px", 
        borderRadius: 12, 
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 4px 12px rgba(192, 192, 192, 0.4)",
      }}>
        <Award size={18} fill="#fff" />
        <span>2nd</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div style={{ 
        background: "linear-gradient(135deg, #CD7F32 0%, #B8792E 100%)", 
        color: "#fff", 
        fontWeight: 800, 
        padding: "8px 16px", 
        borderRadius: 12, 
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 4px 12px rgba(205, 127, 50, 0.4)",
      }}>
        <Trophy size={18} fill="#fff" />
        <span>3rd</span>
      </div>
    );
  }
  return (
    <div style={{ 
      background: "var(--secondary)", 
      color: "var(--muted-foreground)", 
      fontWeight: 700, 
      padding: "8px 16px", 
      borderRadius: 12, 
      fontSize: 15,
      minWidth: 50,
      textAlign: "center",
    }}>
      {rank}th
    </div>
  );
}

function getTrendIndicator(trend: string, improvement: number) {
  const isPositive = trend === "up";
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 6,
      background: isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
      padding: "6px 12px",
      borderRadius: 8,
    }}>
      {isPositive ? (
        <TrendingUp size={16} style={{ color: "#22C55E" }} />
      ) : (
        <TrendingDown size={16} style={{ color: "#EF4444" }} />
      )}
      <span style={{ 
        color: isPositive ? "#22C55E" : "#EF4444", 
        fontWeight: 700, 
        fontSize: 14 
      }}>
        {improvement > 0 ? "+" : ""}{improvement}%
      </span>
    </div>
  );
}

function AnimatedProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ 
        background: "var(--secondary)", 
        borderRadius: 8, 
        height: 10, 
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}>
        <div
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
            height: "100%",
            borderRadius: 8,
            transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            animation: "shimmer 2s infinite",
          }} />
        </div>
      </div>
      <div style={{ 
        color: "var(--muted-foreground)", 
        fontSize: 12, 
        fontWeight: 600,
        marginTop: 4,
      }}>
        {value}%
      </div>
    </div>
  );
}

export function PerformanceLeaderboard() {
  const [department, setDepartment] = useState("All");
  const [period, setPeriod] = useState(PERIODS[0]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Filtered employees
  const filtered = EMPLOYEES.filter(e => department === "All" || e.department === department);
  // Sort by score descending
  const sorted = [...filtered].sort((a, b) => b.score - a.score).slice(0, 10);

  // Statistics
  const topPerformer = sorted[0];
  const avgScore = sorted.length ? Math.round(sorted.reduce((sum, e) => sum + e.score, 0) / sorted.length) : 0;
  const mostImproved = [...sorted].sort((a, b) => b.improvement - a.improvement)[0];
  const totalParticipants = filtered.length;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
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
        .leaderboard-card {
          animation: fadeInUp 0.5s ease-out;
        }
        .leaderboard-row {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .leaderboard-row:hover {
          background: var(--accent) !important;
          transform: translateX(4px);
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
            <Trophy size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 800, 
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.5px",
            }}>
              Performance Leaderboard
            </h1>
            <p style={{ 
              color: "var(--muted-foreground)", 
              fontSize: 15, 
              margin: "4px 0 0 0",
              fontWeight: 500,
            }}>
              Track top performers and celebrate success across teams
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: 20, marginBottom: 32 }}>
        {/* 2nd Place */}
        {sorted[1] && (
          <div className="leaderboard-card" style={{ 
            background: "linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(168, 168, 168, 0.05) 100%)",
            border: "2px solid #C0C0C0",
            borderRadius: 20,
            padding: 24,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            marginTop: 20,
          }}>
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: "rgba(192, 192, 192, 0.1)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Award size={32} color="#C0C0C0" style={{ marginBottom: 12 }} />
              <div style={{
                background: sorted[1].avatarColor,
                color: "#fff",
                borderRadius: "50%",
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 28,
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                border: "4px solid #C0C0C0",
              }}>
                {sorted[1].initials}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px 0", color: "var(--foreground)" }}>
                {sorted[1].name}
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "0 0 12px 0", fontWeight: 600 }}>
                {sorted[1].department}
              </p>
              <div style={{
                background: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 28,
                fontWeight: 800,
                margin: "0 auto",
                boxShadow: "0 4px 12px rgba(192, 192, 192, 0.4)",
              }}>
                {sorted[1].score}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted-foreground)", fontWeight: 600 }}>
                {sorted[1].tasksCompleted} tasks • {sorted[1].streak} day streak
              </div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {sorted[0] && (
          <div className="leaderboard-card" style={{ 
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.1) 100%)",
            border: "3px solid #FFD700",
            borderRadius: 24,
            padding: 32,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(255, 215, 0, 0.3)",
          }}>
            <div style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 150,
              height: 150,
              background: "rgba(255, 215, 0, 0.2)",
              borderRadius: "50%",
              filter: "blur(50px)",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Crown size={40} color="#FFD700" fill="#FFD700" style={{ marginBottom: 16 }} />
              <div style={{
                background: sorted[0].avatarColor,
                color: "#fff",
                borderRadius: "50%",
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 36,
                margin: "0 auto 20px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                border: "5px solid #FFD700",
              }}>
                {sorted[0].initials}
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px 0", color: "var(--foreground)" }}>
                {sorted[0].name}
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: "0 0 16px 0", fontWeight: 600 }}>
                {sorted[0].department} • Top Performer
              </p>
              <div style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 16,
                fontSize: 36,
                fontWeight: 900,
                margin: "0 auto",
                boxShadow: "0 6px 20px rgba(255, 215, 0, 0.5)",
              }}>
                {sorted[0].score}
              </div>
              <div style={{ 
                marginTop: 16, 
                display: "flex", 
                gap: 12, 
                justifyContent: "center",
                fontSize: 13,
                color: "var(--muted-foreground)",
                fontWeight: 600,
              }}>
                <div>⭐ {sorted[0].tasksCompleted} tasks</div>
                <div>•</div>
                <div>🔥 {sorted[0].streak} days</div>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {sorted[2] && (
          <div className="leaderboard-card" style={{ 
            background: "linear-gradient(135deg, rgba(205, 127, 50, 0.1) 0%, rgba(184, 121, 46, 0.05) 100%)",
            border: "2px solid #CD7F32",
            borderRadius: 20,
            padding: 24,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            marginTop: 20,
          }}>
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: "rgba(205, 127, 50, 0.1)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Trophy size={32} color="#CD7F32" style={{ marginBottom: 12 }} />
              <div style={{
                background: sorted[2].avatarColor,
                color: "#fff",
                borderRadius: "50%",
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 28,
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                border: "4px solid #CD7F32",
              }}>
                {sorted[2].initials}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px 0", color: "var(--foreground)" }}>
                {sorted[2].name}
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "0 0 12px 0", fontWeight: 600 }}>
                {sorted[2].department}
              </p>
              <div style={{
                background: "linear-gradient(135deg, #CD7F32 0%, #B8792E 100%)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 28,
                fontWeight: 800,
                margin: "0 auto",
                boxShadow: "0 4px 12px rgba(205, 127, 50, 0.4)",
              }}>
                {sorted[2].score}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted-foreground)", fontWeight: 600 }}>
                {sorted[2].tasksCompleted} tasks • {sorted[2].streak} day streak
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <div style={{ 
          background: "var(--card)", 
          border: "1px solid var(--border)", 
          borderRadius: 16, 
          padding: 20,
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ 
              background: "rgba(16, 185, 129, 0.1)", 
              padding: 10, 
              borderRadius: 10,
            }}>
              <Users size={20} color="#10B981" />
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600 }}>
              Total Participants
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--foreground)" }}>
            {totalParticipants}
          </div>
        </div>

        <div style={{ 
          background: "var(--card)", 
          border: "1px solid var(--border)", 
          borderRadius: 16, 
          padding: 20,
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ 
              background: "rgba(59, 130, 246, 0.1)", 
              padding: 10, 
              borderRadius: 10,
            }}>
              <Target size={20} color="#3B82F6" />
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600 }}>
              Average Score
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--foreground)" }}>
            {avgScore}
          </div>
        </div>

        <div style={{ 
          background: "var(--card)", 
          border: "1px solid var(--border)", 
          borderRadius: 16, 
          padding: 20,
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ 
              background: "rgba(139, 92, 246, 0.1)", 
              padding: 10, 
              borderRadius: 10,
            }}>
              <Zap size={20} color="#8B5CF6" />
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600 }}>
              Most Improved
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)" }}>
            {mostImproved?.name}
          </div>
          <div style={{ fontSize: 13, color: "#10B981", fontWeight: 600, marginTop: 4 }}>
            +{mostImproved?.improvement}% growth
          </div>
        </div>

        <div style={{ 
          background: "var(--card)", 
          border: "1px solid var(--border)", 
          borderRadius: 16, 
          padding: 20,
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ 
              background: "rgba(245, 158, 11, 0.1)", 
              padding: 10, 
              borderRadius: 10,
            }}>
              <Star size={20} color="#F59E0B" fill="#F59E0B" />
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600 }}>
              Top Score
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--foreground)" }}>
            {topPerformer?.score}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "16px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Filter size={18} color="var(--muted-foreground)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--muted-foreground)" }}>
            Filter by:
          </span>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {DEPARTMENTS.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          <Calendar size={18} color="var(--muted-foreground)" />
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {PERIODS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted-foreground)", fontWeight: 600 }}>
          Showing {sorted.length} of {totalParticipants} employees
        </div>
      </div>

      {/* Leaderboard Table */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 16, 
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--secondary)" }}>
              <th style={{ 
                textAlign: "left", 
                padding: "18px 20px", 
                color: "var(--muted-foreground)", 
                fontWeight: 700, 
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Rank
              </th>
              <th style={{ 
                textAlign: "left", 
                padding: "18px 20px", 
                color: "var(--muted-foreground)", 
                fontWeight: 700, 
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Employee
              </th>
              <th style={{ 
                textAlign: "left", 
                padding: "18px 20px", 
                color: "var(--muted-foreground)", 
                fontWeight: 700, 
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Department
              </th>
              <th style={{ 
                textAlign: "left", 
                padding: "18px 20px", 
                color: "var(--muted-foreground)", 
                fontWeight: 700, 
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Score
              </th>
              <th style={{ 
                textAlign: "left", 
                padding: "18px 20px", 
                color: "var(--muted-foreground)", 
                fontWeight: 700, 
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Trend
              </th>
              <th style={{ 
                textAlign: "left", 
                padding: "18px 20px", 
                color: "var(--muted-foreground)", 
                fontWeight: 700, 
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Performance
              </th>
              <th style={{ 
                textAlign: "left", 
                padding: "18px 20px", 
                color: "var(--muted-foreground)", 
                fontWeight: 700, 
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Stats
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((emp, idx) => (
              <tr 
                key={emp.id} 
                className="leaderboard-row"
                style={{ 
                  borderBottom: idx < sorted.length - 1 ? "1px solid var(--border)" : "none",
                  background: hoveredRow === emp.id ? "var(--accent)" : "transparent",
                }}
                onMouseEnter={() => setHoveredRow(emp.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{ padding: "18px 20px" }}>
                  {getRankBadge(idx + 1)}
                </td>
                <td style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ 
                      background: emp.avatarColor, 
                      color: "#fff", 
                      borderRadius: "50%", 
                      width: 44, 
                      height: 44, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontWeight: 700, 
                      fontSize: 16,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}>
                      {emp.initials}
                    </div>
                    <div>
                      <div style={{ 
                        color: "var(--foreground)", 
                        fontWeight: 700,
                        fontSize: 15,
                      }}>
                        {emp.name}
                      </div>
                      <div style={{ 
                        color: "var(--muted-foreground)", 
                        fontSize: 12,
                        fontWeight: 500,
                        marginTop: 2,
                      }}>
                        {emp.projectsLed} projects led
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "18px 20px" }}>
                  <span style={{ 
                    background: "var(--secondary)",
                    color: "var(--foreground)", 
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "6px 12px",
                    borderRadius: 8,
                  }}>
                    {emp.department}
                  </span>
                </td>
                <td style={{ padding: "18px 20px" }}>
                  <div style={{ 
                    color: "var(--foreground)", 
                    fontWeight: 800,
                    fontSize: 20,
                  }}>
                    {emp.score}
                  </div>
                </td>
                <td style={{ padding: "18px 20px" }}>
                  {getTrendIndicator(emp.trend, emp.improvement)}
                </td>
                <td style={{ padding: "18px 20px", width: "200px" }}>
                  <AnimatedProgressBar value={emp.score} color={emp.avatarColor} />
                </td>
                <td style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ 
                      fontSize: 12, 
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      <BarChart3 size={14} />
                      {emp.tasksCompleted} tasks
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: emp.streak >= 15 ? "#F59E0B" : "var(--muted-foreground)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      {emp.streak >= 15 && "🔥"}
                      {emp.streak} day streak
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Message */}
      <div style={{
        marginTop: 32,
        textAlign: "center",
        padding: 24,
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: 16,
      }}>
        <Star size={24} color="#10B981" fill="#10B981" style={{ marginBottom: 12 }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)", margin: "0 0 8px 0" }}>
          Keep Up the Great Work!
        </h3>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}>
          Performance is updated in real-time. Check back regularly to see your progress.
        </p>
      </div>
    </div>
  );
}
