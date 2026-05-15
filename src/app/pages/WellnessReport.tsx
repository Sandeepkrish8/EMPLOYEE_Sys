import React, { useState } from "react";
import { 
  Heart, 
  Brain, 
  Users, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Droplet,
  Moon,
  Footprints,
  Coffee,
  Smile,
  Sparkles,
  CheckCircle,
  Target,
  Award,
  Zap
} from "lucide-react";

// Mock Data
const WELLNESS = {
  overall: 78,
  stress: "Medium",
  sickDays: 2,
  workLife: 82,
  categories: [
    { label: "Physical", score: 80, color: "#10B981", icon: Heart, description: "Exercise & fitness" },
    { label: "Mental", score: 72, color: "#6366F1", icon: Brain, description: "Emotional wellbeing" },
    { label: "Social", score: 68, color: "#F59E0B", icon: Users, description: "Connections & relationships" },
    { label: "Financial", score: 75, color: "#0EA5E9", icon: DollarSign, description: "Financial security" },
  ],
  atRisk: [
    { name: "David Singh", score: 55, department: "Finance", initials: "DS", color: "#EF4444", reason: "Low mental health score" },
    { name: "Olivia Brown", score: 58, department: "HR", initials: "OB", color: "#F59E0B", reason: "High stress levels" },
  ],
  mood: [
    { emoji: "😃", label: "Great", count: 7, color: "#10B981" },
    { emoji: "🙂", label: "Good", count: 5, color: "#3B82F6" },
    { emoji: "😐", label: "Okay", count: 3, color: "#F59E0B" },
    { emoji: "😟", label: "Bad", count: 2, color: "#EF4444" },
    { emoji: "😢", label: "Poor", count: 1, color: "#DC2626" },
  ],
  tips: [
    { icon: Coffee, text: "Take regular breaks and stretch during work hours.", category: "Physical" },
    { icon: Brain, text: "Practice mindfulness or meditation for 5 minutes daily.", category: "Mental" },
    { icon: Droplet, text: "Stay hydrated and drink 8 glasses of water daily.", category: "Physical" },
    { icon: Users, text: "Connect with a colleague for a quick chat.", category: "Social" },
    { icon: Moon, text: "Set boundaries for work and personal time.", category: "Mental" },
  ],
  activities: [
    { name: "Walking Challenge", participants: 24, goal: "10,000 steps/day", completion: 68 },
    { name: "Meditation Sessions", participants: 15, goal: "3x per week", completion: 82 },
    { name: "Team Sports", participants: 12, goal: "Weekly games", completion: 55 },
  ],
  healthMetrics: [
    { label: "Avg Sleep", value: "7.2 hrs", trend: "up", change: "+8%", icon: Moon, color: "#8B5CF6" },
    { label: "Avg Steps", value: "8,450", trend: "up", change: "+12%", icon: Footprints, color: "#10B981" },
    { label: "Water Intake", value: "6.8 cups", trend: "down", change: "-5%", icon: Droplet, color: "#0EA5E9" },
    { label: "Exercise", value: "3.5 days", trend: "up", change: "+15%", icon: Activity, color: "#F59E0B" },
  ],
};

function ProgressCircle({ value, color }: { value: number; color: string }) {
  const radius = 40;
  const stroke = 8;
  const norm = 2 * Math.PI * radius;
  return (
    <svg width={100} height={100} style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
      <circle
        cx={50}
        cy={50}
        r={radius}
        fill="none"
        stroke="var(--secondary)"
        strokeWidth={stroke}
      />
      <circle
        cx={50}
        cy={50}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={norm}
        strokeDashoffset={norm - (value / 100) * norm}
        strokeLinecap="round"
        style={{ 
          transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize={22}
        fontWeight={800}
        fill="var(--foreground)"
      >
        {value}
      </text>
    </svg>
  );
}

function getStressColor(stress: string) {
  if (stress === "High") return "#EF4444";
  if (stress === "Medium") return "#F59E0B";
  return "#10B981";
}

function getStressEmoji(stress: string) {
  if (stress === "High") return "😰";
  if (stress === "Medium") return "😌";
  return "😊";
}

export function WellnessReport() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .wellness-card {
          animation: fadeInUp 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wellness-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
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
            <Heart size={24} color="#fff" fill="#fff" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 800, 
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.5px",
            }}>
              Wellness Report
            </h1>
            <p style={{ 
              color: "var(--muted-foreground)", 
              fontSize: 15, 
              margin: "4px 0 0 0",
              fontWeight: 500,
            }}>
              Monitor employee wellbeing and promote healthy workplace culture
            </p>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <div 
          className="wellness-card"
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
              <Sparkles size={28} color="#10B981" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Overall Wellness Score
            </div>
            <div style={{ 
              color: "#10B981", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {WELLNESS.overall}
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
              Above Average
            </div>
          </div>
        </div>

        <div 
          className="wellness-card"
          style={{ 
            background: `linear-gradient(135deg, ${getStressColor(WELLNESS.stress)}15 0%, ${getStressColor(WELLNESS.stress)}08 100%)`,
            border: `2px solid ${getStressColor(WELLNESS.stress)}30`,
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
            background: `${getStressColor(WELLNESS.stress)}15`,
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: `${getStressColor(WELLNESS.stress)}15`, 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Brain size={28} color={getStressColor(WELLNESS.stress)} />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Team Stress Level
            </div>
            <div style={{ 
              color: getStressColor(WELLNESS.stress), 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {getStressEmoji(WELLNESS.stress)}
            </div>
            <div style={{ 
              fontSize: 14, 
              color: getStressColor(WELLNESS.stress),
              fontWeight: 700,
            }}>
              {WELLNESS.stress}
            </div>
          </div>
        </div>

        <div 
          className="wellness-card"
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
              <Calendar size={28} color="#3B82F6" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Sick Days This Month
            </div>
            <div style={{ 
              color: "#3B82F6", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {WELLNESS.sickDays}
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
              -40% vs last month
            </div>
          </div>
        </div>

        <div 
          className="wellness-card"
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
              <Target size={28} color="#8B5CF6" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Work-Life Balance
            </div>
            <div style={{ 
              color: "#8B5CF6", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {WELLNESS.workLife}
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
              Excellent
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Categories */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 20, 
        padding: 32,
        marginBottom: 32,
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
        }}>
          <Activity size={22} color="#10B981" />
          <h2 style={{ 
            color: "var(--foreground)", 
            fontWeight: 800, 
            fontSize: 22,
            margin: 0,
          }}>
            Wellness Categories
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {WELLNESS.categories.map(cat => (
            <div 
              key={cat.label} 
              style={{ 
                textAlign: "center",
                padding: 24,
                borderRadius: 16,
                background: `${cat.color}08`,
                border: `1px solid ${cat.color}20`,
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 20px ${cat.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                background: `${cat.color}15`,
                width: 56,
                height: 56,
                margin: "0 auto 16px",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <cat.icon size={28} color={cat.color} />
              </div>
              <ProgressCircle value={cat.score} color={cat.color} />
              <div style={{ 
                color: "var(--foreground)", 
                fontWeight: 700, 
                fontSize: 16, 
                marginTop: 16,
              }}>
                {cat.label}
              </div>
              <div style={{ 
                color: "var(--muted-foreground)", 
                fontSize: 12, 
                fontWeight: 500,
                marginTop: 4,
              }}>
                {cat.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Metrics */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 20, 
        padding: 32,
        marginBottom: 32,
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
        }}>
          <Zap size={22} color="#F59E0B" />
          <h2 style={{ 
            color: "var(--foreground)", 
            fontWeight: 800, 
            fontSize: 22,
            margin: 0,
          }}>
            Health Metrics
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {WELLNESS.healthMetrics.map(metric => (
            <div 
              key={metric.label}
              style={{ 
                background: `${metric.color}08`,
                border: `1px solid ${metric.color}20`,
                borderRadius: 14,
                padding: 20,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  background: `${metric.color}15`,
                  padding: 8,
                  borderRadius: 10,
                }}>
                  <metric.icon size={20} color={metric.color} />
                </div>
                <span style={{ 
                  fontSize: 13, 
                  fontWeight: 600, 
                  color: "var(--muted-foreground)",
                }}>
                  {metric.label}
                </span>
              </div>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 800, 
                color: "var(--foreground)",
                marginBottom: 8,
              }}>
                {metric.value}
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 6,
              }}>
                {metric.trend === "up" ? (
                  <TrendingUp size={16} color="#10B981" />
                ) : (
                  <TrendingUp size={16} color="#EF4444" style={{ transform: "rotate(180deg)" }} />
                )}
                <span style={{ 
                  fontSize: 13, 
                  fontWeight: 700,
                  color: metric.trend === "up" ? "#10B981" : "#EF4444",
                }}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* At Risk Employees */}
        <div style={{ 
          background: "var(--card)", 
          border: "1px solid var(--border)", 
          borderRadius: 20, 
          padding: 28,
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}>
            <AlertTriangle size={22} color="#EF4444" />
            <h2 style={{ 
              color: "var(--foreground)", 
              fontWeight: 800, 
              fontSize: 20,
              margin: 0,
            }}>
              At Risk Employees
            </h2>
          </div>
          {WELLNESS.atRisk.length === 0 ? (
            <div style={{ 
              textAlign: "center",
              padding: "32px 0",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ 
                color: "var(--foreground)", 
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 4,
              }}>
                All Clear!
              </div>
              <div style={{ 
                color: "var(--muted-foreground)", 
                fontSize: 14,
              }}>
                No employees at risk
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {WELLNESS.atRisk.map(emp => (
                <div 
                  key={emp.name} 
                  style={{ 
                    background: "var(--secondary)",
                    borderRadius: 14,
                    padding: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    border: `2px solid ${emp.color}30`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.borderColor = emp.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.borderColor = `${emp.color}30`;
                  }}
                >
                  <div style={{
                    background: emp.color,
                    color: "#fff",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                  }}>
                    {emp.initials}
                  </div>
                  <div style={{ flex: 1 }}>
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
                      {emp.department} • {emp.reason}
                    </div>
                  </div>
                  <div style={{
                    background: `${emp.color}15`,
                    color: emp.color,
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: 16,
                  }}>
                    {emp.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mood Tracker */}
        <div style={{ 
          background: "var(--card)", 
          border: "1px solid var(--border)", 
          borderRadius: 20, 
          padding: 28,
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}>
            <Smile size={22} color="#F59E0B" />
            <h2 style={{ 
              color: "var(--foreground)", 
              fontWeight: 800, 
              fontSize: 20,
              margin: 0,
            }}>
              Team Mood This Week
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {WELLNESS.mood.map(m => {
              const total = WELLNESS.mood.reduce((sum, item) => sum + item.count, 0);
              const percentage = Math.round((m.count / total) * 100);
              
              return (
                <div key={m.emoji} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ 
                    fontSize: 32,
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${m.color}15`,
                    borderRadius: 12,
                  }}>
                    {m.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}>
                      <span style={{ 
                        fontSize: 14, 
                        fontWeight: 700,
                        color: "var(--foreground)",
                      }}>
                        {m.label}
                      </span>
                      <span style={{ 
                        fontSize: 13, 
                        fontWeight: 700,
                        color: m.color,
                      }}>
                        {m.count} ({percentage}%)
                      </span>
                    </div>
                    <div style={{ 
                      background: "var(--secondary)",
                      borderRadius: 8,
                      height: 10,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        background: `linear-gradient(90deg, ${m.color} 0%, ${m.color}CC 100%)`,
                        height: "100%",
                        width: `${percentage}%`,
                        borderRadius: 8,
                        transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wellness Activities */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 20, 
        padding: 32,
        marginBottom: 32,
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
        }}>
          <Award size={22} color="#8B5CF6" />
          <h2 style={{ 
            color: "var(--foreground)", 
            fontWeight: 800, 
            fontSize: 22,
            margin: 0,
          }}>
            Wellness Activities
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {WELLNESS.activities.map((activity, idx) => (
            <div 
              key={activity.name}
              style={{ 
                background: "var(--secondary)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid var(--border)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 style={{ 
                fontSize: 16, 
                fontWeight: 700,
                color: "var(--foreground)",
                marginBottom: 12,
              }}>
                {activity.name}
              </h3>
              <div style={{ 
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}>
                <Users size={16} color="var(--muted-foreground)" />
                <span style={{ 
                  fontSize: 14, 
                  color: "var(--muted-foreground)",
                  fontWeight: 600,
                }}>
                  {activity.participants} participants
                </span>
              </div>
              <div style={{ 
                fontSize: 13, 
                color: "var(--muted-foreground)",
                marginBottom: 12,
                fontWeight: 600,
              }}>
                Goal: {activity.goal}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}>
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                  }}>
                    Completion
                  </span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: 800,
                    color: activity.completion >= 70 ? "#10B981" : "#F59E0B",
                  }}>
                    {activity.completion}%
                  </span>
                </div>
                <div style={{ 
                  background: "var(--background)",
                  borderRadius: 8,
                  height: 8,
                  overflow: "hidden",
                }}>
                  <div style={{
                    background: activity.completion >= 70 
                      ? "linear-gradient(90deg, #10B981 0%, #059669 100%)"
                      : "linear-gradient(90deg, #F59E0B 0%, #D97706 100%)",
                    height: "100%",
                    width: `${activity.completion}%`,
                    borderRadius: 8,
                    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Tips */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 20, 
        padding: 32,
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
        }}>
          <CheckCircle size={22} color="#10B981" />
          <h2 style={{ 
            color: "var(--foreground)", 
            fontWeight: 800, 
            fontSize: 22,
            margin: 0,
          }}>
            Daily Wellness Tips
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {WELLNESS.tips.map((tip, i) => (
            <div 
              key={i} 
              style={{ 
                background: "var(--secondary)",
                borderRadius: 14,
                padding: 20,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                border: "1px solid var(--border)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                borderRadius: 10,
                padding: 10,
                flexShrink: 0,
              }}>
                <tip.icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: 14, 
                  color: "var(--foreground)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}>
                  {tip.text}
                </div>
                <div style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  fontWeight: 600,
                  background: "var(--background)",
                  padding: "2px 8px",
                  borderRadius: 6,
                  display: "inline-block",
                }}>
                  {tip.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
