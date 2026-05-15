import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { UserRole } from "../config/roles";

const ROLE_REDIRECT: Record<string, string> = {
  [UserRole.SUPER_ADMIN]: "/",
  [UserRole.ADMIN]: "/",
  [UserRole.HR]: "/",
  [UserRole.FINANCE]: "/",
  [UserRole.MANAGER]: "/",
  [UserRole.EMPLOYEE]: "/profile",
  // Legacy role mappings
  hr_manager: "/",
  recruiter: "/recruitment",
};

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  [UserRole.SUPER_ADMIN]: { label: "Super Admin", color: "#DC2626", bg: "#FEE2E2" },
  [UserRole.ADMIN]: { label: "Admin", color: "#7C3AED", bg: "#F5F3FF" },
  [UserRole.HR]: { label: "HR", color: "#0EA5E9", bg: "#E0F2FE" },
  [UserRole.FINANCE]: { label: "Finance", color: "#F59E0B", bg: "#FEF3C7" },
  [UserRole.MANAGER]: { label: "Manager", color: "#059669", bg: "#ECFDF5" },
  [UserRole.EMPLOYEE]: { label: "Employee", color: "#2563EB", bg: "#EFF6FF" },
  // Legacy role mappings
  hr_manager: { label: "Admin", color: "#7C3AED", bg: "#F5F3FF" },
  recruiter: { label: "Admin", color: "#7C3AED", bg: "#F5F3FF" },
};

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [detectedRole, setDetectedRole] = useState("");

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const users: { email: string; role: string }[] = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const match = users.find((u) => u.email === val);
    setDetectedRole(match?.role ?? "");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const users: { fullName: string; email: string; password: string; role: string }[] =
      JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) { setError("Invalid email or password."); return; }
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userFullName", user.fullName);
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("userRole", user.role);
    navigate(ROLE_REDIRECT[user.role] ?? "/");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset link sent to " + resetEmail);
    setIsForgotPassword(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: "url('/login-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "#E0F2FE" }}>
      <div className="relative z-10 w-full max-w-[420px] rounded-[32px] p-10 shadow-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 25px 50px rgba(0,0,0,0.05)" }}>
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
            <Zap size={32} color="white" fill="white" />
          </div>
          <h1 style={{ color: "#022C22", fontSize: "30px", fontWeight: 800, letterSpacing: "-0.5px" }}>NexusHR</h1>
          <p style={{ color: "#064E3B", fontSize: "14px", fontWeight: 600, marginTop: "6px", opacity: 0.85 }}>Enterprise Management System</p>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#064E3B", marginBottom: "16px" }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>Work Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#059669" }} />
                <input type="email" required placeholder="admin@nexushr.com" value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none"
                  style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
              </div>
            </div>
            <button type="submit" className="w-full rounded-2xl py-4 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 10px 25px rgba(16,185,129,0.4)", border: "none" }}>
              <span className="flex items-center justify-center gap-2 text-white font-bold text-[15px]">
                Send Reset Link <ArrowRight size={18} />
              </span>
            </button>
            <div className="text-center pt-2">
              <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(false); }}
                style={{ fontSize: "13px", fontWeight: 800, color: "#059669" }}>Back to Login</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>Work Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#059669" }} />
                <input type="email" required placeholder="admin@nexushr.com" value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none"
                  style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
              </div>
              {detectedRole && ROLE_LABELS[detectedRole] && (
                <div className="flex items-center gap-1.5 mt-2 ml-1">
                  <ShieldCheck size={13} style={{ color: ROLE_LABELS[detectedRole].color }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: ROLE_LABELS[detectedRole].color, background: ROLE_LABELS[detectedRole].bg, padding: "2px 10px", borderRadius: "20px" }}>
                    {ROLE_LABELS[detectedRole].label}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#022C22", marginBottom: "8px" }}>Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#059669" }} />
                <input type="password" required placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none"
                  style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: "#10B981" }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#022C22" }}>Remember me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }}
                style={{ fontSize: "13px", fontWeight: 800, color: "#059669" }}>Forgot Password?</a>
            </div>
            {error && <p style={{ fontSize: "13px", fontWeight: 600, color: "#DC2626", textAlign: "center" }}>{error}</p>}
            <button type="submit" className="w-full rounded-2xl py-4 mt-2 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 10px 25px rgba(16,185,129,0.4)", border: "none" }}>
              <span className="flex items-center justify-center gap-2 text-white font-bold text-[15px]">
                Login <ArrowRight size={18} />
              </span>
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#064E3B" }}>
            New to NexusHR?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}
              style={{ fontWeight: 800, color: "#059669" }}>Create an Account</a>
          </p>
        </div>
        <div className="mt-4 text-center">
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#064E3B", opacity: 0.7 }}>v2.0.4 · Enterprise Protection Active</p>
        </div>
      </div>
    </div>
  );
}