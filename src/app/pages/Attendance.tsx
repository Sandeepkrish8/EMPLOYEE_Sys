import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, ChevronDown, X, Pencil, Trash2 } from "lucide-react";
import { attendanceCalendar, dailyLogs, employees } from "../data/mockData";
import { useAttendance } from "../context/AppContext";
import type { AttendanceRecord } from "../context/AppContext";

type AttendanceStatus = "Present" | "Absent" | "Leave" | "Holiday" | "Weekend";

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  Present: { bg: "var(--secondary)", color: "var(--primary)", dot: "var(--primary)", label: "Present" },
  Absent: { bg: "rgba(220, 38, 38, 0.1)", color: "#DC2626", dot: "#EF4444", label: "Absent" },
  Leave: { bg: "rgba(245, 158, 11, 0.1)", color: "#D97706", dot: "#F59E0B", label: "Leave" },
  Holiday: { bg: "rgba(20, 184, 166, 0.1)", color: "#0D9488", dot: "#14B8A6", label: "Holiday" },
  Weekend: { bg: "transparent", color: "var(--muted-foreground)", dot: "var(--muted-foreground)", label: "Weekend" },
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const MARKABLE_STATUSES: AttendanceStatus[] = ["Present", "Absent", "Leave", "Holiday"];

/* ─── Status Picker Popup ─────────────────── */
function StatusPicker({
  day, year, month, currentStatus, onSelect, onClose,
}: {
  day: number; year: number; month: number;
  currentStatus: AttendanceStatus;
  onSelect: (status: AttendanceStatus) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div
        className="rounded-2xl shadow-2xl overflow-hidden w-72 animate-in fade-in zoom-in-95 duration-200"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Mark Attendance
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {MONTH_NAMES[month]} {day}, {year}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800" style={{ color: "var(--muted-foreground)" }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {MARKABLE_STATUSES.map((status) => {
            const cfg = STATUS_COLORS[status];
            const isActive = currentStatus === status;
            return (
              <button
                key={status}
                onClick={() => onSelect(status)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  backgroundColor: isActive ? cfg.bg : "transparent",
                  color: isActive ? cfg.color : "var(--foreground)",
                  border: `1.5px solid ${isActive ? cfg.dot : "var(--border)"}`,
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
                {cfg.label}
                {isActive && <span className="ml-auto text-xs font-bold" style={{ color: cfg.color }}>Current</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Attendance() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].name);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [pickerDay, setPickerDay] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { attendance, markAttendance, deleteAttendance, updateAttendance } = useAttendance();

  // Local overrides for daily logs (key: index, value: log or null if deleted)
  type LogEntry = { date: string; checkIn: string; checkOut: string; status: string };
  const [logOverrides, setLogOverrides] = useState<Record<number, LogEntry | null>>({});
  const [editLogIdx, setEditLogIdx] = useState<number | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowEmployeeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const selectedEmp = employees.find((e) => e.name === selectedEmployee) || employees[0];

  // Build effective calendar: context attendance overrides static mock
  const contextCalendar: Record<number, AttendanceStatus> = {};
  attendance
    .filter((rec) => {
      const d = new Date(rec.date);
      return rec.employeeId === selectedEmp.id && d.getFullYear() === year && d.getMonth() === month;
    })
    .forEach((rec) => {
      const d = new Date(rec.date);
      contextCalendar[d.getDate()] = rec.status as AttendanceStatus;
    });

  // Only use static attendanceCalendar for April 2026 / first employee as baseline
  const isBaseMonth = year === 2026 && month === 3 && selectedEmp.id === employees[0].id;
  const effectiveCalendar = (day: number): AttendanceStatus => {
    if (contextCalendar[day]) return contextCalendar[day];
    if (isBaseMonth && attendanceCalendar[day]) return attendanceCalendar[day];
    // Determine weekend
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return "Weekend";
    return "Present";
  };

  const handleDayClick = (day: number) => {
    const status = effectiveCalendar(day);
    if (status === "Weekend") return;
    setPickerDay(day);
  };

  const handleStatusSelect = (status: AttendanceStatus) => {
    if (pickerDay === null) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(pickerDay).padStart(2, "0")}`;
    const record: AttendanceRecord = {
      id: `ATT-${selectedEmp.id}-${dateStr}`,
      employeeId: selectedEmp.id,
      date: dateStr,
      status,
    };
    markAttendance(record);
    setPickerDay(null);
  };

  const logStatusConfig: Record<string, { bg: string; color: string }> = {
    Present: { bg: "var(--secondary)", color: "var(--primary)" },
    Absent: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444" },
    Leave: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" },
    Holiday: { bg: "rgba(20, 184, 166, 0.1)", color: "#14B8A6" },
  };

  // Dynamic summary from effective calendar
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const summary = {
    totalWorkingDays: allDays.filter((d) => {
      const dow = new Date(year, month, d).getDay();
      return dow !== 0 && dow !== 6;
    }).length,
    present: allDays.filter((d) => effectiveCalendar(d) === "Present").length,
    absent: allDays.filter((d) => effectiveCalendar(d) === "Absent").length,
    leaves: allDays.filter((d) => effectiveCalendar(d) === "Leave").length,
    holidays: allDays.filter((d) => effectiveCalendar(d) === "Holiday").length,
  };

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Month navigator */}
        <div className="flex items-center gap-1 rounded-2xl px-2 py-2" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-xl transition-all"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)"; }}
          >
            <ChevronLeft size={15} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "var(--secondary)", minWidth: "130px", justifyContent: "center" }}>
            <CalendarDays size={15} color="var(--primary)" />
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>{monthLabel}</span>
          </div>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-xl transition-all"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)"; }}
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Employee selector */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowEmployeeDropdown((v) => !v)}
            className="flex items-center gap-2.5 rounded-2xl transition-all"
            style={{ backgroundColor: "var(--card)", border: `1px solid ${showEmployeeDropdown ? "var(--primary)" : "var(--border)"}`, boxShadow: showEmployeeDropdown ? "0 0 0 3px rgba(16,185,129,0.12), 0 2px 8px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.06)", padding: "6px 12px 6px 8px", cursor: "pointer" }}
          >
            <div style={{ padding: "2px", borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #059669)", flexShrink: 0 }}>
              <div style={{ borderRadius: "50%", overflow: "hidden", width: "28px", height: "28px", border: "2px solid var(--card)" }}>
                <img src={selectedEmp.avatar} alt={selectedEmployee} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>{selectedEmployee}</span>
            <ChevronDown size={14} color="var(--primary)" style={{ flexShrink: 0, transition: "transform 200ms ease", transform: showEmployeeDropdown ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>

          {showEmployeeDropdown && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: "220px", zIndex: 100, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase" }}>Select Employee</p>
              </div>
              <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                {employees.map((emp) => {
                  const isSelected = emp.name === selectedEmployee;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => { setSelectedEmployee(emp.name); setShowEmployeeDropdown(false); }}
                      className="w-full flex items-center gap-3 text-left transition-colors"
                      style={{ padding: "9px 14px", backgroundColor: isSelected ? "var(--secondary)" : "transparent", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                      onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--secondary)"; }}
                      onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                    >
                      <div style={{ padding: isSelected ? "1.5px" : "0", borderRadius: "50%", background: isSelected ? "linear-gradient(135deg,#10B981,#059669)" : "transparent", flexShrink: 0 }}>
                        <div style={{ borderRadius: "50%", overflow: "hidden", width: "30px", height: "30px", border: isSelected ? "1.5px solid var(--card)" : "none" }}>
                          <img src={emp.avatar} alt={emp.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: isSelected ? "var(--primary)" : "var(--foreground)", fontSize: "13px", fontWeight: isSelected ? 700 : 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.name}</p>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "11px", margin: 0 }}>{emp.role}</p>
                      </div>
                      {isSelected && (
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Calendar + Summary */}
        <div className="col-span-2 space-y-4">
          {/* Summary Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Working Days", value: summary.totalWorkingDays, color: "var(--foreground)", bg: "var(--secondary)" },
              { label: "Present", value: summary.present, color: "var(--primary)", bg: "var(--secondary)" },
              { label: "Absent", value: summary.absent, color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
              { label: "Leaves Taken", value: summary.leaves, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ backgroundColor: s.bg }}>
                  <span style={{ color: s.color, fontSize: "16px", fontWeight: 800 }}>{s.value}</span>
                </div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Monthly Attendance Calendar</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Click any weekday to mark attendance</p>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4">
                {Object.entries(STATUS_COLORS).filter(([k]) => k !== "Weekend").map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: val.dot }} />
                    <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{val.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--muted-foreground)", opacity: 0.3 }} />
                  <span style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Weekend</span>
                </div>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="text-center py-2" style={{ color: d === "Sun" || d === "Sat" ? "var(--muted-foreground)" : "var(--foreground)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const status = effectiveCalendar(day);
                const config = STATUS_COLORS[status];
                const isToday = month === 3 && year === 2026 && day === 6;
                const isHov = hoveredDay === day;
                const isWeekend = status === "Weekend";
                const isModified = contextCalendar[day] !== undefined;

                const hoverBgMap: Record<string, string> = {
                  Present: "rgba(16, 185, 129, 0.25)", Absent: "rgba(220, 38, 38, 0.22)",
                  Leave: "rgba(245, 158, 11, 0.22)", Holiday: "rgba(20, 184, 166, 0.22)",
                  Weekend: "rgba(107, 114, 128, 0.10)",
                };

                return (
                  <div
                    key={day}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => handleDayClick(day)}
                    className="rounded-xl flex flex-col items-center justify-center relative"
                    style={{
                      height: "56px",
                      transition: "background-color 150ms ease, border 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                      cursor: isWeekend ? "default" : "pointer",
                      backgroundColor: isToday ? "var(--primary)" : isHov ? hoverBgMap[status] : isWeekend ? "transparent" : config.bg,
                      border: isToday ? "2px solid var(--primary)" : isHov ? `2px solid ${config.dot}` : "2px solid transparent",
                      boxShadow: isHov && !isToday ? `0 4px 16px ${config.dot}66` : "none",
                      transform: isHov && !isToday && !isWeekend ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: isToday || isHov ? 800 : 600, color: isToday ? "white" : isHov ? config.dot : isWeekend ? "var(--muted-foreground)" : config.color, opacity: isWeekend && !isHov ? 0.4 : 1, transition: "color 150ms ease" }}>
                      {day}
                    </span>
                    {status !== "Weekend" && (
                      <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: isToday ? "rgba(255,255,255,0.8)" : config.dot, transform: isHov ? "scale(1.3)" : "scale(1)", transition: "transform 150ms ease" }} />
                    )}
                    {isModified && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#F59E0B" }} title="Modified" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Log */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", alignSelf: "flex-start" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Daily Log</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{monthLabel}</p>
          </div>
          <div className="grid px-5 py-2.5" style={{ gridTemplateColumns: "1fr 1fr 1fr 80px 60px", backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)" }}>
            {["Date", "In", "Out", "Status", ""].map((col) => (
              <span key={col} style={{ color: "var(--foreground)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.8 }}>{col}</span>
            ))}
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "460px" }}>
            {dailyLogs.map((rawLog, i) => {
              if (i in logOverrides && logOverrides[i] === null) return null;
              const log = (i in logOverrides ? logOverrides[i] : rawLog) as typeof rawLog;
              return (
                <div key={i} className="group grid px-5 py-3 items-center" style={{ gridTemplateColumns: "1fr 1fr 1fr 80px 60px", borderBottom: i < dailyLogs.length - 1 ? "1px solid var(--border)" : "none", backgroundColor: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                  {editLogIdx === i ? (
                    <>
                      <span style={{ color: "var(--foreground)", fontSize: "11px", fontWeight: 600 }}>{log.date.split(",")[0]}</span>
                      <input
                        id={`att-in-${i}`}
                        defaultValue={log.checkIn}
                        className="w-full rounded px-1 py-0.5 text-[11px] outline-none"
                        style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                      />
                      <input
                        id={`att-out-${i}`}
                        defaultValue={log.checkOut}
                        className="w-full rounded px-1 py-0.5 text-[11px] outline-none"
                        style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                      />
                      <span className="px-2 py-0.5 rounded-full text-center" style={{ backgroundColor: logStatusConfig[log.status]?.bg || "var(--secondary)", color: logStatusConfig[log.status]?.color || "var(--primary)", fontSize: "10px", fontWeight: 700, width: "fit-content" }}>
                        {log.status}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            const newIn = (document.getElementById(`att-in-${i}`) as HTMLInputElement).value;
                            const newOut = (document.getElementById(`att-out-${i}`) as HTMLInputElement).value;
                            setLogOverrides((prev) => ({ ...prev, [i]: { ...log, checkIn: newIn, checkOut: newOut } }));
                            setEditLogIdx(null);
                          }}
                          className="p-0.5 rounded" style={{ color: "var(--primary)", border: "1px solid var(--border)" }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </button>
                        <button onClick={() => setEditLogIdx(null)} className="p-0.5 rounded" style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                          <X size={10} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ color: "var(--foreground)", fontSize: "11px", fontWeight: 600 }}>{log.date.split(",")[0]}</span>
                      <span style={{ color: "var(--foreground)", fontSize: "11px", opacity: 0.8 }}>{log.checkIn}</span>
                      <span style={{ color: "var(--foreground)", fontSize: "11px", opacity: 0.8 }}>{log.checkOut}</span>
                      <span className="px-2 py-0.5 rounded-full text-center" style={{ backgroundColor: logStatusConfig[log.status]?.bg || "var(--secondary)", color: logStatusConfig[log.status]?.color || "var(--primary)", fontSize: "10px", fontWeight: 700, width: "fit-content" }}>
                        {log.status}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditLogIdx(i)} className="p-0.5 rounded" style={{ color: "var(--primary)", border: "1px solid var(--border)" }}>
                          <Pencil size={10} />
                        </button>
                        <button onClick={() => setLogOverrides((prev) => ({ ...prev, [i]: null }))} className="p-0.5 rounded" style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Avg. Hours/Day</span>
              <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>9h 06m</span>
            </div>
            <div className="rounded-full overflow-hidden mt-2" style={{ height: "4px", backgroundColor: "var(--border)" }}>
              <div className="rounded-full" style={{ width: "88%", height: "100%", backgroundColor: "var(--primary)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Picker */}
      {pickerDay !== null && (
        <StatusPicker
          day={pickerDay}
          year={year}
          month={month}
          currentStatus={effectiveCalendar(pickerDay)}
          onSelect={handleStatusSelect}
          onClose={() => setPickerDay(null)}
        />
      )}
    </div>
  );
}
