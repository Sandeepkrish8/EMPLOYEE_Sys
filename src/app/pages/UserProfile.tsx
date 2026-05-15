import { useState, useRef } from "react";
import {
  User,
  Settings,
  Building2,
  Globe,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit3,
  Save,
  X,
  Bell,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  Github,
  Award,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

const profileTabs = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

const settingsSections = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Privacy", icon: Shield },
];

const skills = ["HR Strategy", "Talent Acquisition", "Payroll Management", "Employee Relations", "Performance Management", "HRIS Systems"];

const activityLog = [
  { action: "Updated payroll for March 2026", time: "2 hours ago", type: "payroll" },
  { action: "Approved leave request from Emily Chen", time: "5 hours ago", type: "leave" },
  { action: "Added new employee: Marcus Williams", time: "Yesterday", type: "employee" },
  { action: "Generated Q1 Performance Report", time: "2 days ago", type: "report" },
  { action: "Scheduled interview with candidate", time: "3 days ago", type: "recruitment" },
];

const stats = [
  { label: "Employees Managed", value: "247", icon: Users, color: "#059669" },
  { label: "Years Experience", value: "8", icon: TrendingUp, color: "#14B8A6" },
  { label: "Tasks Completed", value: "1,284", icon: CheckCircle2, color: "#22C55E" },
  { label: "Avg Response Time", value: "1.2h", icon: Clock, color: "#F59E0B" },
];

function Toggle({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div>
        <p style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{label}</p>
        <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className="rounded-full transition-all"
        style={{
          width: "44px",
          height: "24px",
          backgroundColor: on ? "var(--primary)" : "var(--border)",
          position: "relative",
          flexShrink: 0,
          border: "none",
          cursor: "pointer",
        }}
      >
        <div
          className="absolute top-1 rounded-full bg-white transition-all"
          style={{
            width: "16px",
            height: "16px",
            left: on ? "24px" : "4px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
  icon,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          color: "var(--primary)",
          fontSize: "11px",
          fontWeight: 700,
          display: "block",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 rounded-xl px-4"
        style={{
          border: "1px solid var(--border)",
          height: "44px",
          backgroundColor: "var(--background)",
        }}
      >
        {icon && <span style={{ color: "var(--muted-foreground)", display: "flex" }}>{icon}</span>}
        <input
          type={type}
          defaultValue={value}
          disabled={disabled}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "13px",
            color: "var(--foreground)",
            WebkitTextFillColor: "var(--foreground)",
            opacity: 1,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

export function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [activeSettingsSection, setActiveSettingsSection] = useState("company");
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarGradient] = useState("linear-gradient(135deg, #059669, #14B8A6)");
  const [activeSkills, setActiveSkills] = useState(skills);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
       setActiveSkills([...activeSkills, newSkill.trim()]);
       setNewSkill("");
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setActiveSkills(activeSkills.filter(s => s !== skillToRemove));
  }

  const handleSave = () => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const activityTypeColor: Record<string, string> = {
    payroll: "#059669",
    leave: "#14B8A6",
    employee: "#22C55E",
    report: "#F59E0B",
    recruitment: "#0EA5E9",
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Banner + Avatar wrapper — relative so avatar can overlap banner edge without clipping */}
      <div style={{ position: "relative", marginBottom: "52px" }}>
        {/* Green gradient banner */}
        <div
          className="rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #047857 40%, #14B8A6 100%)",
            height: "160px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles — contained within banner */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-60px",
              left: "200px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          {/* Tabs in top-right of banner */}
          <div className="absolute top-4 right-5 flex gap-1">
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  border: activeTab === tab.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar — positioned OUTSIDE the banner div, overlapping its bottom edge */}
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "28px",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: avatarGradient,
                border: "4px solid var(--card)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
            >
              <span style={{ color: "white", fontSize: "24px", fontWeight: 800 }}>RP</span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex items-center justify-center rounded-full"
              style={{
                width: "24px",
                height: "24px",
                background: "linear-gradient(135deg, #059669, #047857)",
                border: "2px solid var(--card)",
                cursor: "pointer",
              }}
            >
              <Camera size={11} color="white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} />
          </div>
        </div>
      </div>

      {/* Profile Name Row */}
      <div className="flex items-center justify-between mb-6" style={{ paddingLeft: "152px" }}>
        <div>
          <h2 style={{ color: "var(--foreground)", fontSize: "22px", fontWeight: 800, lineHeight: 1.2 }}>
            Ryan Park
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "2px" }}>
            HR Administrator &nbsp;|&nbsp; NexusHR Technologies
            HR Administrator &nbsp;·&nbsp; NexusHR Technologies
            HR Administrator &nbsp;|&nbsp; NexusHR Technologies
          </p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}
            >
              <CheckCircle2 size={14} color="#22C55E" />
              <span style={{ color: "#22C55E", fontSize: "13px", fontWeight: 600 }}>Saved!</span>
            </div>
          )}
          {activeTab === "profile" && (
            isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--muted-foreground)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #059669, #047857)",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                  }}
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                }}
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            )
          )}
        </div>
      </div>

      {/* ── MY PROFILE TAB ── */}
      {activeTab === "profile" && (
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${s.color}18` }}
                  >
                    <s.icon size={16} color={s.color} />
                  </div>
                  <p style={{ color: "var(--foreground)", fontSize: "22px", fontWeight: 800 }}>{s.value}</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "2px" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Personal Info Card */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(5, 150, 105, 0.12)" }}
                >
                  <User size={14} color="var(--primary)" />
                </div>
                <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Personal Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" value="Ryan" disabled={!isEditing} />
                <InputField label="Last Name" value="Park" disabled={!isEditing} />
                <InputField label="Email Address" value="ryan.park@nexushr.com" icon={<Mail size={14} />} disabled={!isEditing} />
                <InputField label="Phone Number" value="+1 (415) 823-9100" icon={<Phone size={14} />} disabled={!isEditing} />
                <InputField label="Location" value="San Francisco, CA" icon={<MapPin size={14} />} disabled={!isEditing} />
                <InputField label="Date Joined" value="March 12, 2018" icon={<Calendar size={14} />} disabled />
              </div>
            </div>

            {/* Professional Info */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(20, 184, 166, 0.12)" }}
                >
                  <Briefcase size={14} color="#14B8A6" />
                </div>
                <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Professional Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField label="Job Title" value="HR Administrator" icon={<Briefcase size={14} />} disabled={!isEditing} />
                <InputField label="Department" value="Human Resources" disabled={!isEditing} />
                <InputField label="Employee ID" value="EMP-0001" disabled />
                <InputField label="Reports To" value="Sarah Mitchell, VP HR" disabled={!isEditing} />
              </div>

              {/* Bio */}
              <div className="mb-4">
                <label
                  style={{
                    color: "var(--primary)",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Bio
                </label>
                <textarea
                  disabled={!isEditing}
                  defaultValue="Experienced HR professional with 8+ years managing full-cycle human resources for fast-growing tech organizations. Passionate about building strong employee cultures, optimizing HR processes, and leveraging data-driven decisions."
                  style={{
                    width: "100%",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                    WebkitTextFillColor: "var(--foreground)",
                    backgroundColor: "var(--background)",
                    outline: "none",
                    resize: "none",
                    height: "80px",
                    fontFamily: "inherit",
                    opacity: 1,
                  }}
                />
              </div>

              {/* Skills & Expertise */}
              <div>
                <label
                  style={{
                    color: "var(--primary)",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Skills & Expertise
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {activeSkills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(5, 150, 105, 0.1)",
                        color: "var(--primary)",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "1px solid rgba(5, 150, 105, 0.2)",
                      }}
                    >
                      {skill}
                      {isEditing && (
                        <button 
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors flex items-center justify-center"
                          style={{ color: "var(--primary)", cursor: "pointer", border: "none", background: "transparent" }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      WebkitTextFillColor: "var(--foreground)",
                    }}
                  />
                )}
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <InputField label="LinkedIn" value="linkedin.com/in/ryanpark" icon={<Linkedin size={14} />} disabled={!isEditing} />
                <InputField label="Twitter" value="@ryanpark_hr" icon={<Twitter size={14} />} disabled={!isEditing} />
                <InputField label="GitHub" value="github.com/ryanpark" icon={<Github size={14} />} disabled={!isEditing} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* Role Badge */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #059669, #14B8A6)" }}
                >
                  <Award size={18} color="white" />
                </div>
                <div>
                  <p style={{ color: "var(--foreground)", fontWeight: 700, fontSize: "13px" }}>HR Administrator</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>Full Access</p>
                </div>
              </div>
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.2)" }}
              >
                <p style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Access Level: Admin
                </p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "11px", lineHeight: 1.5 }}>
                  Full read/write access to all modules including payroll, recruitment, and settings.
                </p>
              </div>
            </div>

            {/* Website */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
                Online Presence
              </h3>
              {[
                { icon: Globe, label: "Website", value: "ryanpark.hr.dev" },
                { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/ryanpark" },
              ].map((link) => (
                <div key={link.label} className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(5, 150, 105, 0.1)" }}
                  >
                    <link.icon size={13} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {link.label}
                    </p>
                    <p style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 500 }}>{link.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <h3 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
                Recent Activity
              </h3>
              <div className="flex flex-col gap-3">
                {activityLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: activityTypeColor[log.type] || "var(--primary)" }}
                    />
                    <div>
                      <p style={{ color: "var(--foreground)", fontSize: "12px", lineHeight: 1.4 }}>{log.action}</p>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "10px", marginTop: "2px" }}>{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === "settings" && (
        <div className="flex gap-5">
          {/* Settings sidebar */}
          <div
            className="rounded-2xl p-3 shrink-0"
            style={{
              width: "200px",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              alignSelf: "flex-start",
            }}
          >
            {settingsSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSettingsSection(sec.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
                style={{
                  color: activeSettingsSection === sec.id ? "var(--primary)" : "var(--muted-foreground)",
                  backgroundColor: activeSettingsSection === sec.id ? "var(--secondary)" : "transparent",
                  fontSize: "13px",
                  fontWeight: activeSettingsSection === sec.id ? 700 : 500,
                  marginBottom: "2px",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (activeSettingsSection !== sec.id)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--background)";
                }}
                onMouseLeave={(e) => {
                  if (activeSettingsSection !== sec.id)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <sec.icon size={14} />
                {sec.label}
              </button>
            ))}
          </div>

          {/* Settings content */}
          <div className="flex-1">
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              {/* Company Settings */}
              {activeSettingsSection === "company" && (
                <div>
                  <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                    Company Information
                  </h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                    Update your organization details and preferences.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Company Name" value="NexusHR Technologies" />
                    <InputField label="Industry" value="Software & Technology" />
                    <InputField label="Email" value="hr@nexushr.com" icon={<Mail size={14} />} />
                    <InputField label="Phone" value="+1 (800) 123-4567" icon={<Phone size={14} />} />
                    <div className="col-span-2">
                      <InputField label="Headquarters" value="1000 Innovation Drive, San Francisco, CA 94105" icon={<MapPin size={14} />} />
                    </div>
                    <InputField label="Website" value="www.nexushr.com" icon={<Globe size={14} />} />
                    <InputField label="Founded Year" value="2018" />
                    <div className="col-span-2">
                      <label style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Company Description
                      </label>
                      <textarea
                        defaultValue="NexusHR is a leading enterprise HR management platform empowering organizations to manage their most valuable assets — their people."
                        style={{
                          width: "100%",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "var(--foreground)",
                          backgroundColor: "var(--background)",
                          outline: "none",
                          resize: "none",
                          height: "80px",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #059669, #047857)",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                      }}
                    >
                      <Save size={14} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeSettingsSection === "account" && (
                <div>
                  <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                    Account Settings
                  </h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                    Manage your personal profile information and preferences.
                  </p>

                  {/* Avatar row */}
                  <div
                    className="flex items-center gap-4 mb-6 p-4 rounded-xl"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center relative"
                      style={{ background: "linear-gradient(135deg, #059669, #14B8A6)", boxShadow: "0 4px 16px rgba(5,150,105,0.3)" }}
                    >
                      <span style={{ color: "white", fontSize: "20px", fontWeight: 800 }}>RP</span>
                      <div
                        className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "var(--primary)", border: "2px solid var(--card)" }}
                      >
                        <Camera size={9} color="white" />
                      </div>
                    </div>
                    <div>
                      <p style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Ryan Park</p>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>HR Administrator</p>
                    </div>
                    <button
                      className="ml-auto px-4 py-2 rounded-xl"
                      style={{
                        backgroundColor: "rgba(5, 150, 105, 0.1)",
                        color: "var(--primary)",
                        fontSize: "13px",
                        fontWeight: 600,
                        border: "1px solid rgba(5, 150, 105, 0.2)",
                        cursor: "pointer",
                      }}
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputField label="First Name" value="Ryan" />
                    <InputField label="Last Name" value="Park" />
                    <InputField label="Email Address" value="ryan.park@nexushr.com" icon={<Mail size={14} />} />
                    <InputField label="Phone Number" value="+1 (415) 823-9100" icon={<Phone size={14} />} />
                    <InputField label="Job Title" value="HR Administrator" icon={<Briefcase size={14} />} />
                    <InputField label="Location" value="San Francisco, CA" icon={<MapPin size={14} />} />
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #059669, #047857)",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                      }}
                    >
                      <Save size={14} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSettingsSection === "notifications" && (
                <div>
                  <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                    Notification Preferences
                  </h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                    Control which alerts and updates you receive.
                  </p>
                  <Toggle label="New Employee Onboarding" desc="Get notified when a new employee joins" defaultOn={true} />
                  <Toggle label="Leave Requests" desc="Alerts for pending leave approvals" defaultOn={true} />
                  <Toggle label="Payroll Processed" desc="Confirmation when payroll is run" defaultOn={true} />
                  <Toggle label="Performance Reviews" desc="Reminders for upcoming review cycles" defaultOn={false} />
                  <Toggle label="Recruitment Updates" desc="Candidate stage changes and new applications" defaultOn={true} />
                  <Toggle label="System Alerts" desc="Critical system notifications and errors" defaultOn={true} />
                  <Toggle label="Email Digest" desc="Weekly summary sent to your email" defaultOn={false} />
                  <div className="flex justify-end mt-6">
                    <button
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, #059669, #047857)",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                      }}
                    >
                      <Save size={14} />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSettingsSection === "security" && (
                <div>
                  <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                    Security & Privacy
                  </h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "24px" }}>
                    Manage your password, 2FA, and active sessions.
                  </p>

                  {/* Change Password */}
                  <div
                    className="rounded-xl p-5 mb-5"
                    style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Key size={15} color="var(--primary)" />
                      <h4 style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 700 }}>Change Password</h4>
                    </div>
                    <div className="flex flex-col gap-3">
                      {/* Current password */}
                      <div>
                        <label style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Current Password
                        </label>
                        <div
                          className="flex items-center gap-2.5 rounded-xl px-4"
                          style={{ border: "1px solid var(--border)", height: "44px", backgroundColor: "var(--card)" }}
                        >
                          <Lock size={14} color="var(--muted-foreground)" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            style={{ border: "none", outline: "none", background: "transparent", fontSize: "13px", color: "var(--foreground)", width: "100%" }}
                          />
                          <button onClick={() => setShowPassword(!showPassword)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}>
                            {showPassword ? <EyeOff size={14} color="var(--muted-foreground)" /> : <Eye size={14} color="var(--muted-foreground)" />}
                          </button>
                        </div>
                      </div>
                      {/* New password */}
                      <div>
                        <label style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          New Password
                        </label>
                        <div
                          className="flex items-center gap-2.5 rounded-xl px-4"
                          style={{ border: "1px solid var(--border)", height: "44px", backgroundColor: "var(--card)" }}
                        >
                          <Lock size={14} color="var(--muted-foreground)" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            style={{ border: "none", outline: "none", background: "transparent", fontSize: "13px", color: "var(--foreground)", width: "100%" }}
                          />
                          <button onClick={() => setShowNewPassword(!showNewPassword)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}>
                            {showNewPassword ? <EyeOff size={14} color="var(--muted-foreground)" /> : <Eye size={14} color="var(--muted-foreground)" />}
                          </button>
                        </div>
                        {/* Strength indicator */}
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4].map((n) => (
                            <div
                              key={n}
                              className="flex-1 rounded-full"
                              style={{
                                height: "3px",
                                backgroundColor: n <= 2 ? "#F59E0B" : "var(--border)",
                              }}
                            />
                          ))}
                          <span style={{ color: "#F59E0B", fontSize: "10px", fontWeight: 600, whiteSpace: "nowrap" }}>Medium</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="mt-4 px-4 py-2 rounded-xl flex items-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #059669, #047857)",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                      }}
                    >
                      <Save size={13} /> Update Password
                    </button>
                  </div>

                  {/* 2FA & Session toggles */}
                  <Toggle label="Two-Factor Authentication" desc="Require 2FA for all admin accounts" defaultOn={true} />
                  <Toggle label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" defaultOn={true} />
                  <Toggle label="Audit Logging" desc="Track all admin actions for compliance" defaultOn={true} />
                  <Toggle label="IP Restriction" desc="Only allow access from approved IPs" defaultOn={false} />

                  {/* Danger zone */}
                  <div
                    className="rounded-xl p-4 mt-5"
                    style={{ border: "1px solid rgba(239, 68, 68, 0.3)", backgroundColor: "rgba(239, 68, 68, 0.04)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={15} color="#EF4444" />
                      <p style={{ color: "#EF4444", fontSize: "13px", fontWeight: 700 }}>Danger Zone</p>
                    </div>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "12px" }}>
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      className="px-4 py-2 rounded-xl"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#EF4444",
                        fontSize: "13px",
                        fontWeight: 600,
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        cursor: "pointer",
                      }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
