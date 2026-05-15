import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, User, Zap, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { UserRole } from "../config/roles";

const ROLES = [
  {
    value: UserRole.SUPER_ADMIN,
    label: "Super Admin",
    description: "Full system access + user management",
    color: "#DC2626",
    bg: "#FEE2E2",
  },
  {
    value: UserRole.ADMIN,
    label: "Admin",
    description: "Full admin access across all modules",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    value: UserRole.HR,
    label: "HR",
    description: "Personnel records, hiring & employee reports",
    color: "#0EA5E9",
    bg: "#E0F2FE",
  },
  {
    value: UserRole.FINANCE,
    label: "Finance",
    description: "Financial dashboards, invoices & budgets",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    value: UserRole.MANAGER,
    label: "Manager",
    description: "Manage team, approve team leave & tasks",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    value: UserRole.EMPLOYEE,
    label: "Employee",
    description: "Own profile, attendance & leave",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
];

export function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState(UserRole.EMPLOYEE);
  const [error, setError] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Store new user in localStorage so they can log in
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const exists = users.find((u: { email: string }) => u.email === email);
    if (exists) {
      setError("An account with this email already exists.");
      return;
    }
    users.push({ fullName, email, password, role });
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userFullName", fullName);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userRole", role);
    navigate("/");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#E0F2FE",
      }}
    >
      <div
        className="relative z-10 w-full max-w-[420px] rounded-[32px] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col items-center mb-10">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
          >
            <Zap size={32} color="white" fill="white" />
          </div>
          <h1 style={{ color: "#022C22", fontSize: "30px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            NexusHR
          </h1>
          <p style={{ color: "#064E3B", fontSize: "14px", fontWeight: 600, marginTop: "6px", opacity: 0.85 }}>
            Create your account
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Full Name */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>
              Full Name
            </label>
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#059669" }} />
              <input
                type="text"
                required
                placeholder="John Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>
              Work Email Address
            </label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#059669" }} />
              <input
                type="email"
                required
                placeholder="john@nexushr.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>
              Password
            </label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#059669" }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-12 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#059669", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "10px" }}>
              <ShieldCheck size={15} style={{ color: "#059669" }} />
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "14px",
                    border: role === r.value ? `2px solid ${r.color}` : "1.5px solid var(--border)",
                    background: role === r.value ? r.bg : "var(--background)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    outline: "none",
                  }}
                >
                  <p style={{ fontSize: "12px", fontWeight: 800, color: role === r.value ? r.color : "#022C22", marginBottom: "2px" }}>
                    {r.label}
                  </p>
                  <p style={{ fontSize: "10.5px", fontWeight: 500, color: "#6B7280", lineHeight: 1.3 }}>
                    {r.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>
              Confirm Password
            </label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#059669" }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-12 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#059669", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#DC2626", textAlign: "center" }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full relative group overflow-hidden rounded-2xl py-4 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
              border: "none",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-[15px]">
              Create Account
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
            </span>
          </button>
        </form>

        {/* Link to login */}
        <div className="mt-6 text-center">
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#064E3B" }}>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate("/login"); }}
              className="hover:underline"
              style={{ fontWeight: 800, color: "#059669" }}
            >
              Sign In
            </a>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#064E3B", opacity: 0.7 }}>
            v2.0.4 · Enterprise Protection Active
          </p>
        </div>
      </div>
    </div>
  );
}


