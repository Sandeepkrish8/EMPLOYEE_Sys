import React, { useState } from "react";
import { Trophy, Zap, Target, Flame, Crown, Award, Star, Gift, TrendingUp, Users, Calendar, CheckCircle, Clock, Sparkles, Medal } from "lucide-react";

// Mock Data
const EMPLOYEE = {
  name: "Emily Chen",
  xp: 4200,
  level: 7,
  nextLevelXP: 5000,
  streak: 12,
  rank: 1,
  totalBadges: 12,
  unlockedBadges: 5,
};

const BADGES = [
  { label: "On Time", emoji: "⏰", unlocked: true, rarity: "Common", xp: 50, description: "100% attendance for 30 days" },
  { label: "Team Player", emoji: "🤝", unlocked: true, rarity: "Rare", xp: 100, description: "Helped 10 colleagues" },
  { label: "5-Day Streak", emoji: "🔥", unlocked: true, rarity: "Common", xp: 75, description: "5 consecutive days active" },
  { label: "Early Bird", emoji: "🐦", unlocked: false, rarity: "Uncommon", xp: 80, description: "First to clock in 20 times" },
  { label: "Night Owl", emoji: "🌙", unlocked: false, rarity: "Uncommon", xp: 80, description: "Late shift hero" },
  { label: "Top Performer", emoji: "🏆", unlocked: true, rarity: "Epic", xp: 200, description: "Ranked #1 this month" },
  { label: "Helper", emoji: "🙌", unlocked: false, rarity: "Common", xp: 60, description: "Answer 50 questions" },
  { label: "Innovator", emoji: "💡", unlocked: true, rarity: "Legendary", xp: 300, description: "Suggest 5 improvements" },
];

const LEADERBOARD = [
  { name: "Emily Chen", points: 4200, avatar: "EC", level: 7, trend: "up", badgeCount: 5, color: "#F59E0B" },
  { name: "Ryan Park", points: 3900, avatar: "RP", level: 6, trend: "up", badgeCount: 4, color: "#3B82F6" },
  { name: "Ava Patel", points: 3700, avatar: "AP", level: 6, trend: "same", badgeCount: 4, color: "#8B5CF6" },
  { name: "Lucas Kim", points: 3500, avatar: "LK", level: 5, trend: "up", badgeCount: 3, color: "#10B981" },
  { name: "Sophia Lee", points: 3400, avatar: "SL", level: 5, trend: "down", badgeCount: 3, color: "#EF4444" },
];

const CHALLENGES = [
  { title: "Complete Profile", percent: 100, xp: 100, icon: CheckCircle, color: "#10B981", status: "Complete" },
  { title: "Attend 5 Meetings", percent: 80, xp: 150, icon: Users, color: "#3B82F6", status: "In Progress" },
  { title: "Submit Weekly Report", percent: 60, xp: 120, icon: Calendar, color: "#F59E0B", status: "In Progress" },
  { title: "Help a Colleague", percent: 30, xp: 80, icon: Target, color: "#8B5CF6", status: "In Progress" },
];

const REWARDS = [
  { name: "Extra PTO Day", cost: 5000, icon: Calendar, available: false, color: "#10B981" },
  { name: "Gift Card ₹1000", cost: 3000, icon: Gift, available: true, color: "#F59E0B" },
  { name: "Premium Parking", cost: 2500, icon: Star, available: true, color: "#3B82F6" },
  { name: "Early Leave Pass", cost: 1500, icon: Clock, available: true, color: "#8B5CF6" },
];


function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div style={{ 
      background: "var(--secondary)", 
      borderRadius: 12, 
      height: 12, 
      width: "100%",
      overflow: "hidden",
      border: "1px solid var(--border)",
    }}>
      <div
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
          height: "100%",
          borderRadius: 12,
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
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          animation: "shimmer 2s infinite",
        }} />
      </div>
    </div>
  );
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case "Legendary": return "#F59E0B";
    case "Epic": return "#8B5CF6";
    case "Rare": return "#3B82F6";
    case "Uncommon": return "#10B981";
    default: return "#6B7280";
  }
}

function getRankBadge(rank: number) {
  if (rank === 1) return { icon: Crown, color: "#F59E0B", label: "Champion" };
  if (rank <= 3) return { icon: Medal, color: "#C0C0C0", label: "Elite" };
  if (rank <= 10) return { icon: Star, color: "#CD7F32", label: "Rising Star" };
  return { icon: Trophy, color: "#6B7280", label: "Competitor" };
}

export function Gamification() {
  const [showModal, setShowModal] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);

  const rankBadge = getRankBadge(EMPLOYEE.rank);
  const xpPercentage = Math.round((EMPLOYEE.xp / EMPLOYEE.nextLevelXP) * 100);

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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .gamification-card {
          animation: fadeInUp 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gamification-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            padding: 12,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
          }}>
            <Trophy size={24} color="#fff" fill="#fff" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 800, 
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.5px",
            }}>
              Gamification Hub
            </h1>
            <p style={{ 
              color: "var(--muted-foreground)", 
              fontSize: 15, 
              margin: "4px 0 0 0",
              fontWeight: 500,
            }}>
              Track your progress, earn badges, and compete with colleagues
            </p>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <div 
          className="gamification-card"
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
              <Zap size={28} color="#F59E0B" fill="#F59E0B" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Total XP
            </div>
            <div style={{ 
              color: "#F59E0B", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {EMPLOYEE.xp.toLocaleString()}
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
              Level {EMPLOYEE.level}
            </div>
          </div>
        </div>

        <div 
          className="gamification-card"
          style={{ 
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)",
            border: "2px solid rgba(239, 68, 68, 0.3)",
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
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: "rgba(239, 68, 68, 0.15)", 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 2s infinite",
            }}>
              <Flame size={28} color="#EF4444" fill="#EF4444" />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Daily Streak
            </div>
            <div style={{ 
              color: "#EF4444", 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {EMPLOYEE.streak}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: "#EF4444",
              fontWeight: 600,
              background: "rgba(239, 68, 68, 0.1)",
              padding: "4px 12px",
              borderRadius: 20,
              display: "inline-block",
            }}>
              Days Active
            </div>
          </div>
        </div>

        <div 
          className="gamification-card"
          style={{ 
            background: `linear-gradient(135deg, ${getRarityColor("Epic")}15 0%, ${getRarityColor("Epic")}08 100%)`,
            border: `2px solid ${getRarityColor("Epic")}30`,
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
            background: `${getRarityColor("Epic")}15`,
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: `${getRarityColor("Epic")}15`, 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Award size={28} color={getRarityColor("Epic")} />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Badges Unlocked
            </div>
            <div style={{ 
              color: getRarityColor("Epic"), 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              {EMPLOYEE.unlockedBadges}/{EMPLOYEE.totalBadges}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: getRarityColor("Epic"),
              fontWeight: 600,
              background: `${getRarityColor("Epic")}15`,
              padding: "4px 12px",
              borderRadius: 20,
              display: "inline-block",
            }}>
              {Math.round((EMPLOYEE.unlockedBadges / EMPLOYEE.totalBadges) * 100)}% Complete
            </div>
          </div>
        </div>

        <div 
          className="gamification-card"
          style={{ 
            background: `linear-gradient(135deg, ${rankBadge.color}15 0%, ${rankBadge.color}08 100%)`,
            border: `2px solid ${rankBadge.color}30`,
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
            background: `${rankBadge.color}15`,
            borderRadius: "50%",
            filter: "blur(30px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ 
              background: `${rankBadge.color}15`, 
              width: 56, 
              height: 56,
              margin: "0 auto 12px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "bounce 2s infinite",
            }}>
              <rankBadge.icon size={28} color={rankBadge.color} fill={rankBadge.color} />
            </div>
            <div style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Global Rank
            </div>
            <div style={{ 
              color: rankBadge.color, 
              fontWeight: 800, 
              fontSize: 36,
              marginBottom: 4,
            }}>
              #{EMPLOYEE.rank}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: rankBadge.color,
              fontWeight: 600,
              background: `${rankBadge.color}15`,
              padding: "4px 12px",
              borderRadius: 20,
              display: "inline-block",
            }}>
              {rankBadge.label}
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress Card */}
      <div style={{ 
        background: "var(--card)", 
        border: "1px solid var(--border)", 
        borderRadius: 20, 
        padding: 32,
        marginBottom: 32,
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Sparkles size={22} color="#F59E0B" />
              <h2 style={{ 
                color: "var(--foreground)", 
                fontWeight: 800, 
                fontSize: 22,
                margin: 0,
              }}>
                Level Progress
              </h2>
            </div>
            <p style={{ 
              color: "var(--muted-foreground)", 
              fontSize: 14,
              margin: 0,
              fontWeight: 500,
            }}>
              {EMPLOYEE.nextLevelXP - EMPLOYEE.xp} XP needed to reach Level {EMPLOYEE.level + 1}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ 
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              color: "#fff", 
              border: "none", 
              borderRadius: 12, 
              padding: "14px 28px", 
              fontWeight: 700, 
              fontSize: 15, 
              cursor: "pointer", 
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)";
            }}
          >
            <Gift size={18} />
            Redeem Rewards
          </button>
        </div>
        
        <div style={{ 
          background: "var(--secondary)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                color: "#fff",
                borderRadius: 12,
                padding: "8px 16px",
                fontWeight: 800,
                fontSize: 18,
              }}>
                Level {EMPLOYEE.level}
              </div>
              <TrendingUp size={20} color="#10B981" />
            </div>
            <div style={{
              background: "var(--background)",
              color: "var(--foreground)",
              borderRadius: 12,
              padding: "8px 16px",
              fontWeight: 700,
              fontSize: 16,
              border: "2px dashed var(--border)",
            }}>
              Level {EMPLOYEE.level + 1}
            </div>
          </div>
          <ProgressBar value={EMPLOYEE.xp} max={EMPLOYEE.nextLevelXP} color="#F59E0B" />
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginTop: 12,
          }}>
            <span style={{ 
              fontSize: 13, 
              fontWeight: 700,
              color: "#F59E0B",
            }}>
              {EMPLOYEE.xp.toLocaleString()} XP
            </span>
            <span style={{ 
              fontSize: 13, 
              fontWeight: 700,
              color: "var(--muted-foreground)",
            }}>
              {xpPercentage}%
            </span>
            <span style={{ 
              fontSize: 13, 
              fontWeight: 700,
              color: "var(--muted-foreground)",
            }}>
              {EMPLOYEE.nextLevelXP.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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
            minWidth: 600,
            maxWidth: 700,
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}>
            <button 
              onClick={() => setShowModal(false)} 
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
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                padding: 12,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Gift size={24} color="#fff" />
              </div>
              <div>
                <h2 style={{ 
                  color: "var(--foreground)", 
                  fontWeight: 800, 
                  fontSize: 24, 
                  margin: 0,
                }}>
                  Redeem Rewards
                </h2>
                <p style={{ 
                  color: "var(--muted-foreground)", 
                  fontSize: 14, 
                  margin: "4px 0 0 0",
                }}>
                  You have {EMPLOYEE.xp.toLocaleString()} XP available
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {REWARDS.map((reward, i) => (
                <div 
                  key={i}
                  style={{ 
                    background: "var(--secondary)",
                    borderRadius: 14,
                    padding: 20,
                    border: reward.available ? `2px solid ${reward.color}30` : "2px solid var(--border)",
                    opacity: reward.available ? 1 : 0.6,
                    transition: "all 0.3s",
                    cursor: reward.available ? "pointer" : "not-allowed",
                  }}
                  onMouseEnter={(e) => {
                    if (reward.available) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 8px 20px ${reward.color}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      background: `${reward.color}15`,
                      padding: 10,
                      borderRadius: 10,
                    }}>
                      <reward.icon size={20} color={reward.color} />
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: 15, 
                        fontWeight: 700,
                        color: "var(--foreground)",
                      }}>
                        {reward.name}
                      </div>
                      <div style={{ 
                        fontSize: 13, 
                        fontWeight: 700,
                        color: reward.color,
                      }}>
                        {reward.cost.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                  {!reward.available && (
                    <div style={{
                      fontSize: 12,
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      background: "var(--background)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      display: "inline-block",
                    }}>
                      Insufficient XP
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
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
            Achievement Badges
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {BADGES.map((badge, i) => (
            <div 
              key={i} 
              style={{
                background: badge.unlocked ? "var(--secondary)" : "var(--background)",
                border: badge.unlocked ? `2px solid ${getRarityColor(badge.rarity)}` : "2px dashed var(--border)",
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
                opacity: badge.unlocked ? 1 : 0.5,
                boxShadow: badge.unlocked ? `0 4px 12px ${getRarityColor(badge.rarity)}20` : undefined,
                transition: "all 0.3s",
                cursor: badge.unlocked ? "pointer" : "default",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (badge.unlocked) {
                  e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${getRarityColor(badge.rarity)}40`;
                  setHoveredBadge(i);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = badge.unlocked ? `0 4px 12px ${getRarityColor(badge.rarity)}20` : "none";
                setHoveredBadge(null);
              }}
            >
              {badge.unlocked && (
                <div style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: getRarityColor(badge.rarity),
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 6,
                  textTransform: "uppercase",
                }}>
                  {badge.rarity}
                </div>
              )}
              <div style={{ fontSize: 48, marginBottom: 12 }}>{badge.emoji}</div>
              <div style={{ 
                color: badge.unlocked ? "var(--foreground)" : "var(--muted-foreground)", 
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 6,
              }}>
                {badge.label}
              </div>
              {hoveredBadge === i && badge.unlocked && (
                <div style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  marginTop: 8,
                  fontWeight: 500,
                }}>
                  {badge.description}
                </div>
              )}
              {badge.unlocked && (
                <div style={{
                  fontSize: 12,
                  color: getRarityColor(badge.rarity),
                  fontWeight: 700,
                  marginTop: 8,
                  background: `${getRarityColor(badge.rarity)}15`,
                  padding: "4px 10px",
                  borderRadius: 8,
                  display: "inline-block",
                }}>
                  +{badge.xp} XP
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 24, marginBottom: 32 }}>
        {/* Leaderboard */}
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
            <Trophy size={22} color="#F59E0B" />
            <h2 style={{ 
              color: "var(--foreground)", 
              fontWeight: 800, 
              fontSize: 20,
              margin: 0,
            }}>
              Leaderboard
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {LEADERBOARD.map((user, idx) => (
              <div 
                key={user.name} 
                style={{ 
                  background: idx === 0 ? "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)" : "var(--secondary)",
                  borderRadius: 14,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  border: idx === 0 ? "2px solid rgba(245, 158, 11, 0.3)" : "1px solid var(--border)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  background: idx === 0 ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : 
                              idx === 1 ? "linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)" :
                              idx === 2 ? "linear-gradient(135deg, #CD7F32 0%, #B87333 100%)" :
                              "var(--accent)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  flexShrink: 0,
                  boxShadow: idx < 3 ? "0 2px 8px rgba(0,0,0,0.2)" : undefined,
                }}>
                  {idx + 1}
                </div>
                <div style={{
                  background: user.color,
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
                  {user.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: "var(--foreground)", 
                    fontWeight: 700,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    {user.name}
                    {user.trend === "up" && <TrendingUp size={14} color="#10B981" />}
                    {user.trend === "down" && <TrendingUp size={14} color="#EF4444" style={{ transform: "rotate(180deg)" }} />}
                  </div>
                  <div style={{ 
                    color: "var(--muted-foreground)", 
                    fontSize: 12,
                    fontWeight: 600,
                    marginTop: 2,
                  }}>
                    Level {user.level} • {user.badgeCount} badges
                  </div>
                </div>
                <div style={{
                  background: idx === 0 ? "rgba(245, 158, 11, 0.15)" : "var(--background)",
                  color: idx === 0 ? "#F59E0B" : "var(--foreground)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 14,
                }}>
                  {user.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
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
            <Target size={22} color="#10B981" />
            <h2 style={{ 
              color: "var(--foreground)", 
              fontWeight: 800, 
              fontSize: 20,
              margin: 0,
            }}>
              Active Challenges
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {CHALLENGES.map((ch, i) => (
              <div 
                key={i}
                style={{ 
                  background: "var(--secondary)",
                  borderRadius: 14,
                  padding: 20,
                  border: "1px solid var(--border)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{
                    background: `${ch.color}15`,
                    padding: 10,
                    borderRadius: 10,
                  }}>
                    <ch.icon size={20} color={ch.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: "var(--foreground)", 
                      fontWeight: 700, 
                      fontSize: 15,
                    }}>
                      {ch.title}
                    </div>
                    <div style={{ 
                      color: "var(--muted-foreground)", 
                      fontSize: 12,
                      fontWeight: 600,
                      marginTop: 2,
                    }}>
                      {ch.status}
                    </div>
                  </div>
                  <div style={{
                    background: `${ch.color}15`,
                    color: ch.color,
                    padding: "4px 10px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                  }}>
                    +{ch.xp} XP
                  </div>
                </div>
                <ProgressBar value={ch.percent} max={100} color={ch.color} />
                <div style={{ 
                  color: ch.color,
                  fontSize: 13, 
                  fontWeight: 700,
                  marginTop: 8,
                }}>
                  {ch.percent}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
