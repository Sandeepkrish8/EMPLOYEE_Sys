import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Bell, Search, ChevronDown, Settings, LogOut, User, Sun, Moon, X, UserSearch, ArrowRight, Menu } from "lucide-react";
import { employees } from "../data/mockData";

interface TopbarProps {
  title: string;
  sidebarWidth: number;
  isDark: boolean;
  onToggleTheme: () => void;
  isMobile?: boolean;
  onMobileMenuToggle?: () => void;
}

const NOTIFICATIONS = [
  { id: 1, text: "Emily Chen submitted a leave request", fullText: "Emily Chen submitted a leave request for Aug 12–15", time: "5 mins ago", color: "#14B8A6", type: "leave", category: "Leave Request", date: "April 6, 2026", unread: true },
  { id: 2, text: "Payroll successfully processed", fullText: "Payroll for March 2026 successfully processed for 248 employees", time: "1 hour ago", color: "#059669", type: "payroll", category: "Payroll", date: "April 6, 2026", unread: true },
  { id: 3, text: "New candidate application received", fullText: "New candidate application received for Senior Frontend Developer", time: "2 hours ago", color: "#0EA5E9", type: "recruitment", category: "Recruitment", date: "April 6, 2026", unread: true },
  { id: 4, text: "Quarterly Performance Review window is now open", fullText: "Quarterly Performance Review window is now open", time: "1 day ago", color: "#F59E0B", type: "system", category: "System", date: "April 5, 2026", unread: false },
  { id: 5, text: "System maintenance scheduled for this weekend", fullText: "System maintenance scheduled for weekend downtime", time: "2 days ago", color: "#EF4444", type: "system", category: "System", date: "April 4, 2026", unread: false },
  { id: 6, text: "Ryan Park updated company policies document", fullText: "Ryan Park updated company policies document", time: "3 days ago", color: "#8B5CF6", type: "documents", category: "Document", date: "April 3, 2026", unread: false },
];

const ROUTE_MAP: Record<string, string> = {
  leave: "/leave",
  payroll: "/payroll",
  recruitment: "/recruitment",
  performance: "/performance",
  attendance: "/attendance",
  documents: "/documents",
  system: "/",
};

const PAGE_LABEL: Record<string, string> = {
  leave: "Leave Management",
  payroll: "Payroll",
  recruitment: "Recruitment",
  performance: "Performance",
  attendance: "Attendance",
  documents: "Documents",
  system: "Dashboard",
};

export function Topbar({ title, sidebarWidth, isDark, onToggleTheme, isMobile = false, onMobileMenuToggle }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(NOTIFICATIONS.filter(n => n.unread).length);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = searchQuery.trim() === ""
    ? []
    : employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  function handleNotificationClick(type: string) {
    const route = ROUTE_MAP[type] ?? "/";
    navigate(route);
    setShowNotifications(false);
    setShowAllNotifications(false);
  }

  return (
    <div
      className="fixed top-0 right-0 flex items-center h-16 z-40 transition-all duration-300"
      style={{
        left: `${sidebarWidth}px`,
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        paddingLeft: isMobile ? "12px" : "24px",
        paddingRight: isMobile ? "12px" : "24px",
        gap: isMobile ? "8px" : "16px",
      }}
    >
      {isMobile && (
        <button onClick={onMobileMenuToggle} className="flex items-center justify-center rounded-xl transition-colors shrink-0"
          style={{ width: "38px", height: "38px", backgroundColor: "var(--background)", border: "1px solid var(--border)", cursor: "pointer" }}>
          <Menu size={18} color="var(--foreground)" />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <h1 style={{ color: "var(--foreground)", fontSize: isMobile ? "15px" : "18px", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {title}
        </h1>
        {!isMobile && <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>Monday, April 6, 2026</p>}
      </div>

      {!isMobile && (
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2 rounded-xl px-3 transition-all duration-200"
            style={{ backgroundColor: "var(--background)", border: `1px solid ${showSearchResults && searchQuery ? "var(--primary)" : "var(--border)"}`, height: "38px", width: "280px" }}>
            <Search size={15} color={searchQuery ? "var(--primary)" : "var(--muted-foreground)"} />
            <input type="text" placeholder="Quick search..." value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
              onFocus={() => setShowSearchResults(true)}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "13px", color: "var(--foreground)", width: "100%" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1 rounded-full">
                <X size={12} color="var(--muted-foreground)" />
              </button>
            )}
          </div>
          {showSearchResults && searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 mt-2 rounded-xl shadow-xl z-50 overflow-hidden"
              style={{ width: "320px", backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>EMPLOYEES</span>
              </div>
              {filteredEmployees.length > 0 ? (
                <div>
                  {filteredEmployees.map((emp) => (
                    <div key={emp.id} onClick={() => { navigate(`/employees/${emp.id}`); setShowSearchResults(false); setSearchQuery(""); }}
                      className="px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer"
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border" style={{ borderColor: "var(--border)" }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>{emp.name}</p>
                        <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>{emp.role} • {emp.department}</p>
                      </div>
                      <ArrowRight size={14} color="var(--muted-foreground)" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <UserSearch size={20} style={{ color: "var(--muted-foreground)", margin: "0 auto 8px" }} />
                  <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>No employees found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button onClick={onToggleTheme} className="flex items-center justify-center rounded-xl transition-colors"
        style={{ width: "38px", height: "38px", backgroundColor: "var(--background)", border: "1px solid var(--border)", cursor: "pointer" }}>
        {isDark ? <Sun size={16} color="var(--primary)" /> : <Moon size={16} color="var(--primary)" />}
      </button>

      <div className="relative">
        <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }}
          className="relative flex items-center justify-center rounded-xl transition-colors"
          style={{ width: "38px", height: "38px", backgroundColor: showNotifications ? "var(--accent)" : "var(--background)", border: "1px solid var(--border)", cursor: "pointer" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}>
          <Bell size={16} color="var(--primary)" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full"
              style={{ width: "16px", height: "16px", backgroundColor: "#EF4444", fontSize: "9px", fontWeight: 700, color: "white" }}>
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50 shadow-lg"
              style={{ width: "320px", backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Notifications</span>
                <button onClick={() => setUnreadCount(0)} style={{ color: "var(--primary)", fontSize: "12px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600 }}>
                  Mark all as read
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {NOTIFICATIONS.slice(0, 3).map((n) => (
                  <div key={n.id} className="px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onClick={() => handleNotificationClick(n.type)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: n.color }} />
                    <div className="flex-1">
                      <p style={{ color: "var(--foreground)", fontSize: "13px", lineHeight: 1.4 }}>{n.text}</p>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{n.time}</p>
                    </div>
                    <ArrowRight size={13} style={{ color: "var(--muted-foreground)", flexShrink: 0, marginTop: 4 }} />
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 text-center border-t cursor-pointer transition-colors"
                style={{ borderColor: "var(--border)" }}
                onClick={() => { setShowNotifications(false); setShowAllNotifications(true); }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <span style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>View All Notifications →</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors"
          style={{ border: "1px solid var(--border)", backgroundColor: showDropdown ? "var(--accent)" : "var(--background)", cursor: "pointer" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent)")}
          onMouseLeave={(e) => { if (!showDropdown) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--background)"; }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #059669, #14B8A6)" }}>
            <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>RP</span>
          </div>
          <div className="text-left hidden md:block">
            <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, lineHeight: 1.2 }}>Ryan Park</p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", lineHeight: 1.2 }}>Admin</p>
          </div>
          <ChevronDown size={14} color="var(--muted-foreground)" style={{ transition: "transform 0.2s", transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)" }} />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50 shadow-lg"
              style={{ width: "180px", backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              {[{ icon: User, label: "My Profile", path: "/profile" }, { icon: Settings, label: "Settings", path: "/settings" }].map((item) => (
                <button key={item.label} onClick={() => { setShowDropdown(false); navigate(item.path); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                  style={{ color: "var(--foreground)", fontSize: "13px" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}>
                  <item.icon size={14} color="var(--primary)" />
                  {item.label}
                </button>
              ))}
              <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "4px 0" }} />
              <button onClick={() => { sessionStorage.removeItem("isLoggedIn"); setShowDropdown(false); navigate("/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                style={{ color: "#EF4444", fontSize: "13px" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.1)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}>
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      {showAllNotifications && (
        <div className="fixed inset-y-0 right-0 z-50 flex transition-all duration-300" style={{ left: `${sidebarWidth}px`, backgroundColor: "var(--background)" }}>
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="flex items-center gap-4">
                <h2 style={{ color: "var(--foreground)", fontSize: "24px", fontWeight: 800 }}>Notifications History</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
                  {NOTIFICATIONS.filter(n => n.unread).length} Unread
                </span>
              </div>
              <button onClick={() => setShowAllNotifications(false)} className="p-2 rounded-xl transition-colors" style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}>
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
              <div className="space-y-4">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flex gap-4 p-5 rounded-2xl"
                    style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)", boxShadow: n.unread ? `0 1px 6px ${n.color}22` : "none" }}>
                    <div className="w-3 h-3 rounded-full mt-2 shrink-0" style={{ backgroundColor: n.unread ? n.color : "var(--muted-foreground)" }} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span style={{ color: n.color, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>{n.category}</span>
                          <p style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 600, marginTop: "4px" }}>{n.fullText}</p>
                          <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "6px" }}>{n.time}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>{n.date}</span>
                          <button onClick={() => handleNotificationClick(n.type)}
                            style={{ padding: "6px 14px", borderRadius: "8px", border: `1.5px solid ${n.color}`, background: "transparent", color: n.color, fontWeight: 700, fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = n.color; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = n.color; }}>
                            View {PAGE_LABEL[n.type]} →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}