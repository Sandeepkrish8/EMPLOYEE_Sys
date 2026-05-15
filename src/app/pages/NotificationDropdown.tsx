import React from "react";
import { useNavigate } from "react-router-dom";
import {
  notifications,
  notificationRouteMap,
  categoryColors,
  NotificationType,
} from "./Notifications";

interface Props {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: Props) {
  const navigate = useNavigate();
  const preview = notifications.slice(0, 3);

  function handleClick(type: NotificationType) {
    onClose();
    navigate(notificationRouteMap[type]);
  }

  function handleViewAll() {
    onClose();
    navigate("/notifications");
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        right: 0,
        width: 340,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        zIndex: 999,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>
          Notifications
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            background: "#dcfce7",
            color: "#16a34a",
            padding: "2px 10px",
            borderRadius: 20,
          }}
        >
          {notifications.filter((n) => n.unread).length} new
        </span>
      </div>

      {/* Items */}
      {preview.map((n) => (
        <div
          key={n.id}
          onClick={() => handleClick(n.type)}
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #f8fafc",
            cursor: "pointer",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            transition: "background 0.15s",
            background: n.unread ? "#fafffe" : "#fff",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#f0fdf4")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = n.unread ? "#fafffe" : "#fff")
          }
        >
          {/* Colored dot */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: n.unread ? categoryColors[n.type] : "#cbd5e1",
              flexShrink: 0,
              marginTop: 5,
            }}
          />
          <div style={{ flex: 1 }}>
            {/* Category tag */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color: categoryColors[n.type],
                marginBottom: 2,
              }}
            >
              {n.category}
            </div>
            <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>
              {n.text}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
              {n.time}
            </div>
          </div>
          <span style={{ color: "#cbd5e1", fontSize: 18, alignSelf: "center" }}>
            ›
          </span>
        </div>
      ))}

      {/* Footer - View All */}
      <div
        onClick={handleViewAll}
        style={{
          padding: "14px 20px",
          textAlign: "center",
          color: "#16a34a",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#f0fdf4")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#fff")
        }
      >
        View All Notifications →
      </div>
    </div>
  );
}
