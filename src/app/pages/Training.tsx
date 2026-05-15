import { useState } from "react";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  Play,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Star,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { trainingCourses, certifications } from "../data/mockData";

type FilterTab = "All" | "In Progress" | "Completed" | "Not Started";

const FILTER_TABS: FilterTab[] = ["All", "In Progress", "Completed", "Not Started"];

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: "#ECFDF5", color: "#059669" },
  Intermediate: { bg: "#FFFBEB", color: "#D97706" },
  Advanced: { bg: "#FEF2F2", color: "#DC2626" },
};

const STATUS_META: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  "In Progress": { icon: Loader2, color: "#F59E0B", label: "In Progress" },
  "Completed": { icon: CheckCircle2, color: "#10B981", label: "Completed" },
  "Not Started": { icon: Play, color: "#6366F1", label: "Not Started" },
};

export function Training() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const filtered = trainingCourses.filter((c) =>
    activeTab === "All" ? true : c.status === activeTab
  );

  const totalCourses = trainingCourses.length;
  const completed = trainingCourses.filter((c) => c.status === "Completed").length;
  const inProgress = trainingCourses.filter((c) => c.status === "In Progress").length;
  const totalEnrolled = trainingCourses.reduce((acc, c) => acc + c.enrolled, 0);

  const stats = [
    {
      label: "Total Courses",
      value: String(totalCourses),
      icon: BookOpen,
      iconBg: "linear-gradient(135deg,#10B981,#059669)",
      sub: "Available this quarter",
    },
    {
      label: "Completed",
      value: String(completed),
      icon: CheckCircle2,
      iconBg: "linear-gradient(135deg,#22C55E,#16A34A)",
      sub: `${Math.round((completed / totalCourses) * 100)}% completion rate`,
    },
    {
      label: "In Progress",
      value: String(inProgress),
      icon: TrendingUp,
      iconBg: "linear-gradient(135deg,#F59E0B,#D97706)",
      sub: "Currently active",
    },
    {
      label: "Total Enrolled",
      value: String(totalEnrolled),
      icon: Users,
      iconBg: "linear-gradient(135deg,#6366F1,#4F46E5)",
      sub: "Across all courses",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold" style={{ color: "var(--foreground)", fontSize: "22px" }}>
            Training & Development
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "2px" }}>
            Track learning progress, courses, and certifications.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
          style={{
            background: "linear-gradient(135deg,#10B981,#059669)",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
          }}
        >
          <BookOpen size={15} />
          Browse Catalog
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 transition-all"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: "40px", height: "40px", background: s.iconBg, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
              >
                <s.icon size={18} color="white" />
              </div>
            </div>
            <p style={{ color: "var(--foreground)", fontSize: "26px", fontWeight: 700, lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>
              {s.label}
            </p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === tab ? "linear-gradient(135deg,#10B981,#059669)" : "var(--card)",
              color: activeTab === tab ? "white" : "var(--muted-foreground)",
              border: activeTab === tab ? "none" : "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            {tab}
            <span
              className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
              style={{
                background: activeTab === tab ? "rgba(255,255,255,0.25)" : "var(--background)",
                color: activeTab === tab ? "white" : "var(--muted-foreground)",
              }}
            >
              {tab === "All"
                ? trainingCourses.length
                : trainingCourses.filter((c) => c.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Course Cards Grid ── */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <BookOpen size={36} style={{ color: "var(--muted-foreground)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--foreground)", fontWeight: 600 }}>No courses in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course) => {
            const levelStyle = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner;
            const statusMeta = STATUS_META[course.status];
            const StatusIcon = statusMeta.icon;

            return (
              <div
                key={course.id}
                className="rounded-2xl overflow-hidden transition-all group"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Course color banner */}
                <div
                  className="h-2"
                  style={{ background: `linear-gradient(90deg, ${course.accentColor}, ${course.accentColor}88)` }}
                />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: course.bgColor }}
                    >
                      <BookOpen size={18} color={course.accentColor} />
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: levelStyle.bg, color: levelStyle.color }}
                    >
                      {course.level}
                    </span>
                  </div>

                  <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "4px", lineHeight: "1.4" }}>
                    {course.title}
                  </h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "12px", lineHeight: "1.5", marginBottom: "12px" }}>
                    {course.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
                      <Clock size={12} />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
                      <Users size={12} />
                      {course.enrolled} enrolled
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium ml-auto"
                      style={{ background: "var(--background)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                    >
                      {course.category}
                    </span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg,${course.accentColor},${course.accentColor}bb)` }}
                    >
                      <span style={{ color: "white", fontSize: "9px", fontWeight: 700 }}>
                        {course.instructor.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
                      {course.instructor}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Progress</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: course.accentColor }}>{course.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--background)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%`, background: `linear-gradient(90deg,${course.accentColor},${course.accentColor}bb)` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: course.status === "Completed" ? "var(--background)" : `linear-gradient(135deg,${course.accentColor},${course.accentColor}cc)`,
                      color: course.status === "Completed" ? course.accentColor : "white",
                      border: course.status === "Completed" ? `1.5px solid ${course.accentColor}44` : "none",
                      cursor: "pointer",
                    }}
                  >
                    <StatusIcon size={14} color={course.status === "Completed" ? course.accentColor : "white"} />
                    {course.status === "Completed" ? "View Certificate" : course.status === "In Progress" ? "Continue" : "Start Course"}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Certifications ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award size={20} style={{ color: "#F59E0B" }} />
          <h2 className="font-bold" style={{ color: "var(--foreground)", fontSize: "18px" }}>
            Certifications
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${cert.color}18` }}
              >
                <Star size={18} color={cert.color} fill={cert.color} />
              </div>
              <div className="min-w-0">
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, lineHeight: "1.3" }}>
                  {cert.title}
                </p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>
                  {cert.employee}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
                    Issued: {cert.issueDate}
                  </span>
                  <span style={{ fontSize: "10px", color: cert.color, fontWeight: 600 }}>
                    Exp: {cert.expiry}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
