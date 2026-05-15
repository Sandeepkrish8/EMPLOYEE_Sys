import React from "react";
import { useNavigate } from "react-router";

export type NotificationType = "leave" | "payroll" | "recruitment" | "system" | "performance" | "attendance";

export interface Notification {
  id: number;
  type: NotificationType;
  category: string;
  text: string;
  time: string;
  date?: string;
  unread: boolean;
}

export const notificationRouteMap: Record<NotificationType, string> = {
  leave:       "/leave",
  payroll:     "/payroll",
  recruitment: "/recruitment",
  performance: "/performance",
  attendance:  "/attendance",
  system:      "/",
};

export const notifications: Notification[] = [
  { id: 1, type: "leave",       category: "Leave Request", text: "Emily Chen submitted a leave request for Aug 12–15",              time: "5 mins ago",  date: "April 6, 2026", unread: true  },
  { id: 2, type: "payroll",     category: "Payroll",       text: "Payroll for March 2026 successfully processed for 248 employees", time: "1 hour ago",   date: "April 6, 2026", unread: true  },
  { id: 3, type: "recruitment", category: "Recruitment",   text: "New candidate application received for Senior Frontend Developer", time: "2 hours ago",  date: "April 6, 2026", unread: true  },
  { id: 4, type: "system",      category: "System",        text: "Quarterly Performance Review window is now open",                 time: "Yesterday",    date: "April 5, 2026", unread: false },
];

export const categoryColors: Record<NotificationType, string> = {
  leave:       "#16a34a",
  payroll:     "#3b82f6",
  recruitment: "#8b5cf6",
  system:      "#f59e0b",
  performance: "#ef4444",
  attendance:  "#06b6d4",
};

const pageLabelMap: Record<NotificationType, string> = {
  leave:       "Leave Management",
  payroll:     "Payroll",
  recruitment: "Recruitment",
  performance: "Performance",
  attendance:  "Attendance",
  system:      "Dashboard",
};

export default function NotificationsHistory() {
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => n.unread).length;

  function handleClick(type: NotificationType) {
    navigate(notificationRouteMap[type]);
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>
          Notifications History
        </h2>
        {unreadCount > 0 && (
          <span style={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: 13, padding: "3px 12px", borderRadius: 20 }}>
            {unreadCount} Unread
          </span>
        )}
      </div>

      {/* Notification Cards */}
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "18px 22px",
            marginBottom: 14,
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            boxShadow: n.unread ? "0 1px 6px #16a34a18" : "none",
          }}
        >
          {/* Colored dot */}
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.unread ? categoryColors[n.type] : "#cbd5e1", flexShrink: 0, marginTop: 6 }} />

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: categoryColors[n.type] }}>
                {n.category}
              </span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{n.date}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>{n.text}</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>{n.time}</div>
          </div>

          {/* ✅ View Button */}
              <button
                style={{
                  flexShrink: 0,
                  alignSelf: "center",
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: `1.5px solid ${categoryColors[n.type]}`,
                  background: "transparent",
                  color: categoryColors[n.type],
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                onClick={() => handleClick(n.type)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = categoryColors[n.type];
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = categoryColors[n.type];
                }}
              >
                View {pageLabelMap[n.type]} →
              </button>
        </div>
      ))}
    </div>
  );
}
