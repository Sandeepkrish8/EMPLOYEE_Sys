import { useState, useRef } from "react";
import {
  Building2,
  User,
  Bell,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Save,
  Camera,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

const settingsTabs = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

/* ── reusable sub-components ── */

function Toggle({
  label,
  desc,
  defaultOn = false,
}: {
  label: string;
  desc: string;
  defaultOn?: boolean;
}) {
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
        {icon && (
          <span style={{ color: "var(--muted-foreground)", display: "flex" }}>{icon}</span>
        )}
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

/* ── main component ── */

export function Settings() {
  const [activeTab, setActiveTab] = useState("company");
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdatePassword = () => {
    setPasswordUpdated(true);
    setTimeout(() => setPasswordUpdated(false), 2500);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you absolutely sure you want to delete your account?")) {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000); // Simulate deletion delay
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="flex gap-5">
        {/* ── Sidebar tabs ── */}
        <div
          className="rounded-2xl p-3 shrink-0"
          style={{
            width: "200px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            alignSelf: "flex-start",
          }}
        >
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
              style={{
                color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
                backgroundColor: activeTab === tab.id ? "var(--secondary)" : "transparent",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 700 : 500,
                marginBottom: "2px",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--background)";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content panel ── */}
        <div className="flex-1">
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            {/* ── COMPANY ── */}
            {activeTab === "company" && (
              <div>
                <h3
                  style={{
                    color: "var(--foreground)",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  Company Information
                </h3>
                <p
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "13px",
                    marginBottom: "24px",
                  }}
                >
                  Update your organization details and preferences.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Company Name" value="NexusHR Technologies" />
                  <InputField label="Industry" value="Software & Technology" />
                  <InputField
                    label="Email"
                    value="hr@nexushr.com"
                    icon={<Mail size={14} />}
                  />
                  <InputField
                    label="Phone"
                    value="+1 (800) 123-4567"
                    icon={<Phone size={14} />}
                  />
                  <div className="col-span-2">
                    <InputField
                      label="Headquarters"
                      value="1000 Innovation Drive, San Francisco, CA 94105"
                      icon={<MapPin size={14} />}
                    />
                  </div>
                  <InputField
                    label="Website"
                    value="www.nexushr.com"
                    icon={<Globe size={14} />}
                  />
                  <InputField label="Founded Year" value="2018" />
                  <div className="col-span-2">
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
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:opacity-90"
                    style={{
                      background: saved
                        ? "linear-gradient(135deg, #22C55E, #16A34A)"
                        : "linear-gradient(135deg, #059669, #047857)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                    }}
                  >
                    <Save size={14} />
                    {saved ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {activeTab === "account" && (
              <div>
                <h3
                  style={{
                    color: "var(--foreground)",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  Account Settings
                </h3>
                <p
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "13px",
                    marginBottom: "24px",
                  }}
                >
                  Manage your personal profile information and preferences.
                </p>

                {/* Avatar row */}
                <div
                  className="flex items-center gap-4 mb-6 p-4 rounded-xl"
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center relative"
                    style={{
                      background: "linear-gradient(135deg, #059669, #14B8A6)",
                      boxShadow: "0 4px 16px rgba(5,150,105,0.3)",
                    }}
                  >
                    <span style={{ color: "white", fontSize: "20px", fontWeight: 800 }}>
                      RP
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: "var(--primary)", border: "2px solid var(--card)" }}
                    >
                      <Camera size={9} color="white" />
                    </button>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "var(--foreground)",
                        fontSize: "15px",
                        fontWeight: 700,
                      }}
                    >
                      Ryan Park
                    </p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>
                      HR Administrator
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
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
                  <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <InputField label="First Name" value="Ryan" />
                  <InputField label="Last Name" value="Park" />
                  <InputField
                    label="Email Address"
                    value="ryan.park@nexushr.com"
                    icon={<Mail size={14} />}
                  />
                  <InputField
                    label="Phone Number"
                    value="+1 (415) 823-9100"
                    icon={<Phone size={14} />}
                  />
                  <InputField
                    label="Job Title"
                    value="HR Administrator"
                    icon={<Briefcase size={14} />}
                  />
                  <InputField
                    label="Location"
                    value="San Francisco, CA"
                    icon={<MapPin size={14} />}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:opacity-90"
                    style={{
                      background: saved
                        ? "linear-gradient(135deg, #22C55E, #16A34A)"
                        : "linear-gradient(135deg, #059669, #047857)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                    }}
                  >
                    <Save size={14} />
                    {saved ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div>
                <h3
                  style={{
                    color: "var(--foreground)",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  Notification Preferences
                </h3>
                <p
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "13px",
                    marginBottom: "24px",
                  }}
                >
                  Control which alerts and updates you receive.
                </p>
                <Toggle
                  label="New Employee Onboarding"
                  desc="Get notified when a new employee joins"
                  defaultOn={true}
                />
                <Toggle
                  label="Leave Requests"
                  desc="Alerts for pending leave approvals"
                  defaultOn={true}
                />
                <Toggle
                  label="Payroll Processed"
                  desc="Confirmation when payroll is run"
                  defaultOn={true}
                />
                <Toggle
                  label="Performance Reviews"
                  desc="Reminders for upcoming review cycles"
                  defaultOn={false}
                />
                <Toggle
                  label="Recruitment Updates"
                  desc="Candidate stage changes and new applications"
                  defaultOn={true}
                />
                <Toggle
                  label="System Alerts"
                  desc="Critical system notifications and errors"
                  defaultOn={true}
                />
                <Toggle
                  label="Email Digest"
                  desc="Weekly summary sent to your email"
                  defaultOn={false}
                />
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl"
                    style={{
                      background: saved
                        ? "linear-gradient(135deg, #22C55E, #16A34A)"
                        : "linear-gradient(135deg, #059669, #047857)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                    }}
                  >
                    <Save size={14} />
                    {saved ? "Saved!" : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === "security" && (
              <div>
                <h3
                  style={{
                    color: "var(--foreground)",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  Security &amp; Privacy
                </h3>
                <p
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "13px",
                    marginBottom: "24px",
                  }}
                >
                  Manage your password, 2FA, and active sessions.
                </p>

                {/* Change Password */}
                <div
                  className="rounded-xl p-5 mb-5"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Key size={15} color="var(--primary)" />
                    <h4
                      style={{
                        color: "var(--foreground)",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      Change Password
                    </h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Current password */}
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
                        Current Password
                      </label>
                      <div
                        className="flex items-center gap-2.5 rounded-xl px-4"
                        style={{
                          border: "1px solid var(--border)",
                          height: "44px",
                          backgroundColor: "var(--card)",
                        }}
                      >
                        <Lock size={14} color="var(--muted-foreground)" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          style={{
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: "13px",
                            color: "var(--foreground)",
                            width: "100%",
                          }}
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={14} color="var(--muted-foreground)" />
                          ) : (
                            <Eye size={14} color="var(--muted-foreground)" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New password */}
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
                        New Password
                      </label>
                      <div
                        className="flex items-center gap-2.5 rounded-xl px-4"
                        style={{
                          border: "1px solid var(--border)",
                          height: "44px",
                          backgroundColor: "var(--card)",
                        }}
                      >
                        <Lock size={14} color="var(--muted-foreground)" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          style={{
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: "13px",
                            color: "var(--foreground)",
                            width: "100%",
                          }}
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          {showNewPassword ? (
                            <EyeOff size={14} color="var(--muted-foreground)" />
                          ) : (
                            <Eye size={14} color="var(--muted-foreground)" />
                          )}
                        </button>
                      </div>
                      {/* Strength bar */}
                      <div className="flex gap-1 mt-2 items-center">
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
                        <span
                          style={{
                            color: "#F59E0B",
                            fontSize: "10px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            marginLeft: "4px",
                          }}
                        >
                          Medium
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdatePassword}
                    className="mt-4 px-4 py-2 rounded-xl flex items-center gap-2"
                    style={{
                      background: passwordUpdated
                        ? "linear-gradient(135deg, #22C55E, #16A34A)"
                        : "linear-gradient(135deg, #059669, #047857)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                    }}
                  >
                    <Save size={13} /> {passwordUpdated ? "Password Updated!" : "Update Password"}
                  </button>
                </div>

                {/* Toggles */}
                <Toggle
                  label="Two-Factor Authentication"
                  desc="Require 2FA for all admin accounts"
                  defaultOn={true}
                />
                <Toggle
                  label="Single Sign-On (SSO)"
                  desc="Enable SSO via Google Workspace"
                  defaultOn={false}
                />
                <Toggle
                  label="Session Timeout"
                  desc="Auto-logout after 30 minutes of inactivity"
                  defaultOn={true}
                />
                <Toggle
                  label="IP Restriction"
                  desc="Only allow access from approved IPs"
                  defaultOn={false}
                />
                <Toggle
                  label="Audit Logging"
                  desc="Track all admin actions for compliance"
                  defaultOn={true}
                />

                {/* Danger Zone */}
                <div
                  className="rounded-xl p-4 mt-5"
                  style={{
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    backgroundColor: "rgba(239, 68, 68, 0.04)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={15} color="#EF4444" />
                    <p
                      style={{ color: "#EF4444", fontSize: "13px", fontWeight: 700 }}
                    >
                      Danger Zone
                    </p>
                  </div>
                  <p
                    style={{
                      color: "var(--muted-foreground)",
                      fontSize: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
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
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
