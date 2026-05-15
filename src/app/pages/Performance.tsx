import { useState } from "react";
import { useNavigate } from "react-router";
import { TrendingUp, Star, Award, Target, ArrowUpRight, Pencil, Check, X, Plus } from "lucide-react";
import { useEmployees } from "../context/AppContext";
import type { Employee } from "../context/AppContext";

/* ─── Add Review Modal ─────────────────────────────────── */
function AddReviewModal({ employees: empList, onClose, onSave }: { employees: Employee[]; onClose: () => void; onSave: (emp: Employee, score: number) => void }) {
  const [selectedId, setSelectedId] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const emp = empList.find((e) => e.id === selectedId);
    if (!emp) { setError("Please select an employee"); return; }
    const s = parseInt(score);
    if (!score || isNaN(s) || s < 0 || s > 100) { setError("Score must be between 0 and 100"); return; }
    onSave(emp, s);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>Add Performance Review</h3>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && <div className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>{error}</div>}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Employee</label>
            <select className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setError(""); }}>
              <option value="">Select employee...</option>
              {empList.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Performance Score (0–100)</label>
            <input type="number" min={0} max={100} className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              placeholder="e.g. 87" value={score} onChange={(e) => { setScore(e.target.value); setError(""); }} />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ border: "1px solid var(--border)", color: "var(--foreground)", backgroundColor: "var(--background)" }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>Save Review</button>
        </div>
      </div>
    </div>
  );
}
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { employees, performanceData } from "../data/mockData";

const radarData = [
  { subject: "Productivity", A: 88, fullMark: 100 },
  { subject: "Quality", A: 92, fullMark: 100 },
  { subject: "Teamwork", A: 85, fullMark: 100 },
  { subject: "Innovation", A: 78, fullMark: 100 },
  { subject: "Leadership", A: 80, fullMark: 100 },
  { subject: "Punctuality", A: 95, fullMark: 100 },
];

const quarterlyData = [
  { name: "Engineering", Q1: 88, Q2: 92 },
  { name: "Marketing", Q1: 82, Q2: 85 },
  { name: "Design", Q1: 90, Q2: 94 },
  { name: "Finance", Q1: 84, Q2: 87 },
  { name: "HR", Q1: 88, Q2: 90 },
  { name: "Sales", Q1: 79, Q2: 83 },
];

export function Performance() {
  const navigate = useNavigate();
  const { employees: contextEmployees, updateEmployee } = useEmployees();
  const employeeList = contextEmployees.length > 0 ? contextEmployees : employees;
  const topPerformers = [...employeeList].sort((a, b) => b.performance - a.performance).slice(0, 5);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<string>("");
  const [showAddReview, setShowAddReview] = useState(false);

  return (
    <div style={{ maxWidth: "1360px" }}>
      {showAddReview && <AddReviewModal employees={employeeList} onClose={() => setShowAddReview(false)} onSave={(emp, score) => updateEmployee({ ...emp, performance: score })} />}
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg. Score", value: "88.4%", sub: "+4.2% vs last quarter", color: "#059669", bg: "var(--secondary)", icon: TrendingUp },
          { label: "Top Performers", value: "52", sub: "Score ≥ 90%", color: "#22C55E", bg: "var(--secondary)", icon: Star },
          { label: "Need Improvement", value: "18", sub: "Score < 70%", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: Target },
          { label: "Reviews Done", value: "248/248", sub: "Q1 2026 complete", color: "#14B8A6", bg: "rgba(20, 184, 166, 0.1)", icon: Award },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: "40px", height: "40px", backgroundColor: card.bg }}
              >
                <card.icon size={18} color={card.color} />
              </div>
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", fontWeight: 500 }}>{card.label}</p>
            <p style={{ color: card.color, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              {card.value}
            </p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Department Comparison */}
        <div
          className="col-span-2 rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
            Q1 vs Q2 2026 — Department Comparison
          </h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "20px" }}>
            Average performance scores by department
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={quarterlyData} barCategoryGap="25%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--foreground)",
                  fontSize: "12px",
                }}
              />
              <Bar key="bar-q1" dataKey="Q1" name="Q1 2026" fill="var(--border)" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar key="bar-q2" dataKey="Q2" name="Q2 2026" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
            Company Competency
          </h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "8px" }}>Overall team assessment</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Radar
                key="radar-score"
                name="Score"
                dataKey="A"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Top Performers — Q1 2026</h3>
          <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddReview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-opacity hover:opacity-75"
            style={{ color: "white", backgroundColor: "var(--primary)", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            <Plus size={12} /> Add Review
          </button>
          <button
            onClick={() => navigate("/employees")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-opacity hover:opacity-75"
            style={{ color: "var(--primary)", backgroundColor: "var(--secondary)", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            View All <ArrowUpRight size={12} />
          </button>
          </div>
        </div>
        <div className="space-y-3">
          {topPerformers.map((emp, i) => (
            <div key={emp.id} className="group flex items-center gap-4">
              <span
                className="flex items-center justify-center rounded-full w-7 h-7 shrink-0"
                style={{ backgroundColor: i === 0 ? "#FEF3C7" : i === 1 ? "#ECFDF5" : "#FEF2F2", color: i === 0 ? "#D97706" : i === 1 ? "#059669" : "#B91C1C", fontSize: "12px", fontWeight: 800 }}
              >
                {i + 1}
              </span>
              <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover shrink-0" style={{ border: "2px solid var(--border)" }} />
              <div className="flex-1">
                <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{emp.name}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{emp.designation}</p>
              </div>
              <div className="flex items-center gap-3">
                {editingId === emp.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-16 px-2 py-1 rounded-lg border text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-transparent"
                      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        const score = Math.min(100, Math.max(0, parseInt(editScore) || 0));
                        updateEmployee({ ...emp, performance: score });
                        setEditingId(null);
                      }}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                      style={{ color: "#10B981" }}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ width: "120px" }}>
                      <div className="rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "var(--secondary)" }}>
                        <div className="rounded-full" style={{ width: `${emp.performance}%`, height: "100%", background: emp.performance >= 95 ? "linear-gradient(90deg, #22C55E, #16A34A)" : emp.performance >= 90 ? "linear-gradient(90deg, #059669, #047857)" : "linear-gradient(90deg, #F59E0B, #D97706)" }} />
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full" style={{ backgroundColor: emp.performance >= 95 ? "#F0FDF4" : emp.performance >= 90 ? "#ECFDF5" : "#FFFBEB", color: emp.performance >= 95 ? "#16A34A" : emp.performance >= 90 ? "#047857" : "#D97706", fontSize: "12px", fontWeight: 800 }}>
                      {emp.performance}%
                    </span>
                    <button
                      onClick={() => { setEditingId(emp.id); setEditScore(String(emp.performance)); }}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                      style={{ color: "var(--muted-foreground)" }}
                      title="Edit score"
                    >
                      <Pencil size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
