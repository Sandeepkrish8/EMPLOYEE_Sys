import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, Settings, LogOut, User } from "lucide-react";

// ✅ All notification logic is self-contained — no external imports needed
const NOTIFICATIONS = [
  { id: 1, type: "leave",       category: "Leave Request", text: "Emily Chen submitted a leave request for Aug 12–15",              time: "5 mins ago", unread: true  },
  { id: 2, type: "payroll",     category: "Payroll",       text: "Payroll for March 2026 successfully processed for 248 employees", time: "1 hour ago",  unread: true  },
  { id: 3, type: "recruitment", category: "Recruitment",   text: "New candidate application received for Senior Frontend Developer", time: "2 hours ago", unread: true  },
  { id: 4, type: "system",      category: "System",        text: "Quarterly Performance Review window is now open",                 time: "Yesterday",   unread: false },
];

// ✅ These match your routes.tsx exactly
const ROUTES: Record<string, string> = {
  leave:       "/leave",
  payroll:     "/payroll",
  recruitment: "/recruitment",
  performance: "/performance",
  attendance:  "/attendance",
  system:      "/",
};

const COLORS: Record<string, string> = {
  leave:       "#16a34a",
  payroll:     "#3b82f6",
  recruitment: "#8b5cf6",
  system:      "#f59e0b",
  performance: "#ef4444",
  attendance:  "#06b6d4",
};
import { Search, Bell, ChevronDown, Settings, LogOut, User, Moon, Sun } from "lucide-react";

export function Navbar({ title }: { title?: string }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  // ✅ Navigate first, then close — fixes the unmount race condition
  function handleNotificationClick(type: string) {
    const route = ROUTES[type] ?? "/";
    navigate(route);
    setShowNotifications(false);
  }

  function handleViewAll() {
    navigate("/notifications");
    setShowNotifications(false);
  }

  const notifications = [
    { id: 1, text: "Leave request from Sarah Johnson pending", time: "2h ago", unread: true },
    { id: 2, text: "Payroll processing complete for March", time: "5h ago", unread: true },
    { id: 3, text: "New candidate applied for UX Designer", time: "1d ago", unread: false },
    { id: 4, text: "Performance review deadline tomorrow", time: "1d ago", unread: false },
  ];
  const navigate = useNavigate();

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  // ✅ Navigate first, then close — fixes the unmount race condition
  function handleNotificationClick(type: string) {
    const route = ROUTES[type] ?? "/";
    navigate(route);
    setShowNotifications(false);
  }

  function handleViewAll() {
    navigate("/notifications");
    setShowNotifications(false);
  }

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-3.5"
      style={{
        left: "260px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left - Title */}
      {/* Left */}
      {/* Left - Title */}
      <div className="flex items-center gap-3">
        <h1 style={{ color: "#1E293B", fontFamily: "Inter, sans-serif" }} className="text-lg font-semibold">
          {title || "Dashboard"}
        </h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: "16px", height: "16px", color: "#94A3B8" }} />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ width: "16px", height: "16px", color: "#94A3B8" }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: "16px", height: "16px", color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search employees, departments..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#1E293B", fontFamily: "Inter, sans-serif" }}
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#1E293B",
              fontFamily: "Inter, sans-serif",
            }}
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#1E293B", fontFamily: "Inter, sans-serif" }}
            onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Bell Button */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications((v) => !v); setShowProfile(false); }}
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}

        {/* Bell Button */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications((v) => !v); setShowProfile(false); }}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: "#64748B" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1F5F9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <Bell style={{ width: "20px", height: "20px" }} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#EF4444" }} />
            )}
          </button>

          {/* ✅ Dropdown — fully inline, no separate component */}
          {showNotifications && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50"
              style={{ width: 340, backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Notifications</span>
                <span style={{ fontSize: 12, fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "2px 10px", borderRadius: 20 }}>
                  {unreadCount} new
                </span>
              </div>

              {/* Items */}
              {NOTIFICATIONS.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.type)}
                  style={{
                    padding: "13px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    backgroundColor: n.unread ? "#fafffe" : "#fff",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f0fdf4")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = n.unread ? "#fafffe" : "#fff")}
                >
                  {/* Colored dot */}
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS[n.type] ?? "#94a3b8", flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: COLORS[n.type], marginBottom: 2 }}>
                      {n.category}
                    </div>
                    <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{n.time}</div>
                  </div>
                  <span style={{ color: "#cbd5e1", fontSize: 18, alignSelf: "center" }}>›</span>
                </div>
              ))}

              {/* View All */}
              <div
                onClick={handleViewAll}
                style={{ padding: "13px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f0fdf4")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#fff")}
              >
                View All Notifications →
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#EF4444" }}
            />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#EF4444" }} />
            )}
          </button>

          {/* ✅ Dropdown — fully inline, no separate component */}
          {showNotifications && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50"
              style={{ width: 340, backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Notifications</span>
                <span style={{ fontSize: 12, fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "2px 10px", borderRadius: 20 }}>
                  {unreadCount} new
                </span>
              </div>
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="px-4 py-3 border-b transition-colors cursor-pointer"
                    style={{
                      borderColor: "#F1F5F9",
                      backgroundColor: n.unread ? "#F8FAFC" : "#FFFFFF",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1F5F9")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = n.unread ? "#F8FAFC" : "#FFFFFF")}
                  >
                    <p style={{ color: "#1E293B" }} className="text-sm">{n.text}</p>
                    <p style={{ color: "#94A3B8" }} className="text-xs mt-0.5">{n.time}</p>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 text-center">
                <button style={{ color: "#2563EB" }} className="text-sm font-medium">
                  View all notifications
                </button>

              {/* Items */}
              {NOTIFICATIONS.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.type)}
                  style={{
                    padding: "13px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    backgroundColor: n.unread ? "#fafffe" : "#fff",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f0fdf4")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = n.unread ? "#fafffe" : "#fff")}
                >
                  {/* Colored dot */}
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS[n.type] ?? "#94a3b8", flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: COLORS[n.type], marginBottom: 2 }}>
                      {n.category}
                    </div>
                    <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{n.time}</div>
                  </div>
                  <span style={{ color: "#cbd5e1", fontSize: 18, alignSelf: "center" }}>›</span>
                </div>
              ))}

              {/* View All */}
              <div
                onClick={handleViewAll}
                style={{ padding: "13px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f0fdf4")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#fff")}
              >
                View All Notifications →
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ backgroundColor: "#E2E8F0" }} />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile((v) => !v); setShowNotifications(false); }}
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            onClick={() => { setShowProfile((v) => !v); setShowNotifications(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg transition-colors"
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1F5F9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <img
              src="https://images.unsplash.com/photo-1584940121258-c2553b66a739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: "2px solid #E2E8F0" }}
            />
            <div className="text-left hidden sm:block">
              <p style={{ color: "#1E293B" }} className="text-sm font-medium leading-tight">Robert Chen</p>
              <p style={{ color: "#94A3B8" }} className="text-xs">VP Engineering</p>
            </div>
            <ChevronDown style={{ width: "14px", height: "14px", color: "#94A3B8" }} />
          </button>

          {showProfile && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
                <p style={{ color: "#1E293B" }} className="text-sm font-semibold">Robert Chen</p>
                <p style={{ color: "#94A3B8" }} className="text-xs">robert.chen@company.com</p>
              </div>

              {[
                { icon: User,     label: "My Profile", path: "/profile"  },
                { icon: Settings, label: "Settings",   path: "/settings" },
              ].map(({ icon: Icon, label, path }) => (
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              }}
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
                <p style={{ color: "#1E293B" }} className="text-sm font-semibold">Robert Chen</p>
                <p style={{ color: "#94A3B8" }} className="text-xs">robert.chen@company.com</p>
              </div>

              {[
                { icon: User, label: "My Profile" },
                { icon: Settings, label: "Settings" },
              ].map(({ icon: Icon, label }) => (
                { icon: User,     label: "My Profile", path: "/profile"  },
                { icon: Settings, label: "Settings",   path: "/settings" },
              ].map(({ icon: Icon, label, path }) => (
                <button
                  key={label}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "#374151" }}
                  onClick={() => { setShowProfile(false); navigate(path); }}
                  onClick={() => { setShowProfile(false); navigate(path); }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <Icon style={{ width: "15px", height: "15px", color: "#64748B" }} />
                  {label}
                </button>
              ))}

              <div style={{ borderTop: "1px solid #E2E8F0" }}>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "#EF4444" }}
                  onClick={() => { sessionStorage.removeItem("isLoggedIn"); navigate("/login"); }}
              <div className="border-t" style={{ borderColor: "#E2E8F0" }}>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "#EF4444" }}

              <div style={{ borderTop: "1px solid #E2E8F0" }}>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "#EF4444" }}
                  onClick={() => { sessionStorage.removeItem("isLoggedIn"); navigate("/login"); }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FFF5F5")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <LogOut style={{ width: "15px", height: "15px" }} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
