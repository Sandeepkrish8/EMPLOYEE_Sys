import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Users,
  Mail,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Zap,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "Departments", icon: Building2 },
  { id: 3, label: "Invite Team", icon: Mail },
  { id: 4, label: "Done!", icon: CheckCircle2 },
];

const PRESET_DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Legal",
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Media",
  "Real Estate",
  "Consulting",
  "Other",
];

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [errors1, setErrors1] = useState<Record<string, string>>({});

  // Step 2
  const [departments, setDepartments] = useState<string[]>(["Engineering", "HR", "Finance"]);
  const [deptInput, setDeptInput] = useState("");

  // Step 3
  const [invites, setInvites] = useState<string[]>(["", ""]);
  const [errors3, setErrors3] = useState<string[]>([]);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = "Company name is required";
    if (!industry) e.industry = "Please select an industry";
    if (!companySize) e.companySize = "Please select company size";
    setErrors1(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errs = invites.map((email) => {
      if (!email.trim()) return "";
      return emailRegex.test(email) ? "" : "Invalid email";
    });
    setErrors3(errs);
    return errs.every((e) => e === "");
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 3) {
      fireConfetti();
    }
    setStep((s) => (s + 1) as Step);
  };

  const fireConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };
    confetti({ ...defaults, particleCount: count, spread: 80, colors: ["#10B981", "#059669", "#34D399", "#6EE7B7", "#D1FAE5"] });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: count / 2, spread: 120, colors: ["#14B8A6", "#0D9488", "#5EEAD4"] });
    }, 250);
  };

  const addDept = () => {
    const val = deptInput.trim();
    if (val && !departments.includes(val)) {
      setDepartments([...departments, val]);
    }
    setDeptInput("");
  };

  const removeDept = (d: string) => setDepartments(departments.filter((x) => x !== d));
  const togglePreset = (d: string) => {
    if (departments.includes(d)) removeDept(d);
    else setDepartments([...departments, d]);
  };

  const addInviteRow = () => setInvites([...invites, ""]);
  const removeInviteRow = (i: number) => setInvites(invites.filter((_, idx) => idx !== i));
  const updateInvite = (i: number, val: string) => {
    const next = [...invites];
    next[i] = val;
    setInvites(next);
  };

  const validInvites = invites.filter((e) => e.trim());

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "var(--background)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#10B981,#059669)" }}
        >
          <Zap size={20} color="white" fill="white" />
        </div>
        <div>
          <span style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700 }}>NexusHR</span>
          <span className="block" style={{ color: "var(--primary)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px" }}>
            EMS PLATFORM
          </span>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-0 mb-8 w-full max-w-lg">
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: done || active ? "linear-gradient(135deg,#10B981,#059669)" : "var(--card)",
                    border: done || active ? "none" : "2px solid var(--border)",
                    boxShadow: active ? "0 0 0 4px rgba(16,185,129,0.2)" : "none",
                  }}
                >
                  {done ? (
                    <CheckCircle2 size={16} color="white" />
                  ) : (
                    <span style={{ color: active ? "white" : "var(--muted-foreground)", fontSize: "13px", fontWeight: 700 }}>
                      {s.id}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "11px", color: active ? "var(--primary)" : "var(--muted-foreground)", fontWeight: active ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 mb-5 rounded transition-all duration-300"
                  style={{ background: step > s.id ? "#10B981" : "var(--border)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Card Header */}
        <div
          className="px-8 py-6"
          style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 100%)", borderBottom: "1px solid var(--border)" }}
        >
          <h2 style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
            {step === 1 && "Set up your company"}
            {step === 2 && "Configure departments"}
            {step === 3 && "Invite your team"}
            {step === 4 && "You're all set! 🎉"}
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>
            {step === 1 && "Tell us about your organization so we can personalize NexusHR for you."}
            {step === 2 && "Select or add the departments in your company."}
            {step === 3 && "Send email invites to get your team onboard quickly."}
            {step === 4 && "Your workspace is ready. Here's a summary of what you set up."}
          </p>
        </div>

        {/* Card Body */}
        <div className="px-8 py-6 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >

              {/* ── Step 1: Company Setup ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
                      Company Name *
                    </label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                      style={{
                        background: "var(--background)",
                        border: errors1.companyName ? "1.5px solid #EF4444" : "1.5px solid var(--border)",
                        color: "var(--foreground)",
                        fontSize: "14px",
                      }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#10B981"; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors1.companyName ? "#EF4444" : "var(--border)"; }}
                    />
                    {errors1.companyName && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>{errors1.companyName}</p>}
                  </div>

                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
                      Industry *
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl outline-none transition-all appearance-none"
                      style={{
                        background: "var(--background)",
                        border: errors1.industry ? "1.5px solid #EF4444" : "1.5px solid var(--border)",
                        color: industry ? "var(--foreground)" : "var(--muted-foreground)",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    {errors1.industry && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>{errors1.industry}</p>}
                  </div>

                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
                      Company Size *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMPANY_SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setCompanySize(size)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            background: companySize === size ? "linear-gradient(135deg,#10B981,#059669)" : "var(--background)",
                            color: companySize === size ? "white" : "var(--foreground)",
                            border: companySize === size ? "none" : "1.5px solid var(--border)",
                            cursor: "pointer",
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {errors1.companySize && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>{errors1.companySize}</p>}
                  </div>
                </div>
              )}

              {/* ── Step 2: Departments ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "10px" }}>
                      Click to toggle preset departments:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {PRESET_DEPARTMENTS.map((d) => {
                        const selected = departments.includes(d);
                        return (
                          <button
                            key={d}
                            onClick={() => togglePreset(d)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                            style={{
                              background: selected ? "linear-gradient(135deg,#10B981,#059669)" : "var(--background)",
                              color: selected ? "white" : "var(--foreground)",
                              border: selected ? "none" : "1.5px solid var(--border)",
                              cursor: "pointer",
                            }}
                          >
                            {selected ? <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} /> {d}</span> : d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "8px" }}>
                      Custom departments:
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={deptInput}
                        onChange={(e) => setDeptInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addDept()}
                        placeholder="Add custom department..."
                        className="flex-1 px-3 py-2 rounded-xl outline-none"
                        style={{ background: "var(--background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "14px" }}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#10B981"; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
                      />
                      <button
                        onClick={addDept}
                        className="px-3 py-2 rounded-xl font-semibold"
                        style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "white", border: "none", cursor: "pointer" }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {departments.filter((d) => !PRESET_DEPARTMENTS.includes(d)).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {departments.filter((d) => !PRESET_DEPARTMENTS.includes(d)).map((d) => (
                          <span
                            key={d}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
                            style={{ background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}
                          >
                            {d}
                            <button onClick={() => removeDept(d)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                              <X size={12} color="#059669" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                    <Users size={12} style={{ display: "inline", marginRight: "4px" }} />
                    {departments.length} department{departments.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}

              {/* ── Step 3: Invite Team ── */}
              {step === 3 && (
                <div className="space-y-3">
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    Enter email addresses of team members to invite. You can skip this step.
                  </p>
                  {invites.map((email, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => updateInvite(i, e.target.value)}
                          placeholder={`colleague${i + 1}@company.com`}
                          className="w-full px-3 py-2.5 rounded-xl outline-none"
                          style={{
                            background: "var(--background)",
                            border: errors3[i] ? "1.5px solid #EF4444" : "1.5px solid var(--border)",
                            color: "var(--foreground)",
                            fontSize: "14px",
                          }}
                          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#10B981"; }}
                          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors3[i] ? "#EF4444" : "var(--border)"; }}
                        />
                        {errors3[i] && <p style={{ color: "#EF4444", fontSize: "11px", marginTop: "2px" }}>{errors3[i]}</p>}
                      </div>
                      {invites.length > 1 && (
                        <button
                          onClick={() => removeInviteRow(i)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ background: "var(--background)", border: "1.5px solid var(--border)", cursor: "pointer", color: "var(--muted-foreground)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addInviteRow}
                    className="flex items-center gap-2 mt-1"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontSize: "13px", fontWeight: 600 }}
                  >
                    <Plus size={14} />
                    Add another email
                  </button>
                </div>
              )}

              {/* ── Step 4: Done ── */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center py-2">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}
                    >
                      <CheckCircle2 size={32} color="white" />
                    </div>
                  </div>

                  <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Company</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{companyName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Industry</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{industry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Company size</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{companySize} employees</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Departments</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{departments.length} configured</span>
                    </div>
                    {validInvites.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Invites sent</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)" }}>{validInvites.length} team members</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card Footer */}
        <div
          className="px-8 py-5 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}
        >
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium transition-all"
              style={{ background: "var(--background)", color: "var(--foreground)", border: "1.5px solid var(--border)", cursor: "pointer", fontSize: "14px" }}
            >
              <ChevronLeft size={15} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg,#10B981,#059669)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
              }}
            >
              {step === 3 ? "Finish Setup" : "Continue"}
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={() => { sessionStorage.setItem("isLoggedIn", "true"); navigate("/"); }}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg,#10B981,#059669)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
              }}
            >
              Go to Dashboard
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-6" style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
        Step {step} of 4
      </p>
    </div>
  );
}
