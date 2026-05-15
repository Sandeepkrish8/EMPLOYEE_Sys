import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, ArrowLeft, Zap } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--background)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #10B981, #059669)",
          }}
        >
          <Zap size={20} color="white" fill="white" />
        </div>
        <div>
          <span style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700 }}>NexusHR</span>
          <span
            className="block"
            style={{ color: "var(--primary)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px" }}
          >
            EMS PLATFORM
          </span>
        </div>
      </div>

      {/* Floating animated blob */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-8 select-none"
        aria-hidden="true"
      >
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)", transform: "scale(1.4)" }}
        />
        {/* 404 text */}
        <h1
          className="relative font-black leading-none"
          style={{
            fontSize: "clamp(120px, 20vw, 200px)",
            background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #14B8A6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-10 max-w-md"
      >
        <h2
          className="mb-3 font-bold"
          style={{ color: "var(--foreground)", fontSize: "clamp(20px, 3vw, 28px)" }}
        >
          Page Not Found
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "15px", lineHeight: "1.6" }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to somewhere familiar.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
        >
          <Home size={16} />
          Go to Dashboard
        </button>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
          style={{
            background: "var(--card)",
            color: "var(--foreground)",
            fontSize: "14px",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--card)"; }}
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
        style={{ color: "var(--muted-foreground)", fontSize: "12px" }}
      >
        Error code: 404 — Resource not found
      </motion.p>
    </div>
  );
}
