import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Chatbot } from "./Chatbot";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/employees": "Employee Directory",
  "/departments": "Departments",
  "/leave": "Leave Management",
  "/attendance": "Attendance Tracker",
  "/payroll": "Payroll Management",
  "/recruitment": "Recruitment Pipeline",
  "/performance": "Performance Reviews",
  "/reports": "Reports & Analytics",
  "/settings": "System Settings",
  "/profile": "My Profile",
  "/admin": "Admin Panel",
  "/finance": "Finance Panel",
  "/hr": "HR Panel",
  "/employee": "My Portal",
  "/expenses": "Expense Management",
  "/budget": "Budget Overview",
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const location = useLocation();

  if (!sessionStorage.getItem("isLoggedIn")) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const basePath = "/" + location.pathname.split("/")[1];
  const isEmployeeProfile = location.pathname.startsWith("/employees/") && location.pathname !== "/employees";
  const title = isEmployeeProfile ? "Employee Profile" : (pageTitles[basePath] || "NexusHR EMS");

  const sidebarWidth = isMobile ? 0 : (collapsed ? 72 : 260);

  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh", color: "var(--foreground)" }}>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={isMobile ? false : collapsed}
        onToggle={() => isMobile ? setMobileOpen(false) : setCollapsed(!collapsed)}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
      />
      <Topbar
        title={title}
        sidebarWidth={sidebarWidth}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isMobile={isMobile}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
      />
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: `${sidebarWidth}px`,
          paddingTop: "64px",
          minHeight: "100vh",
        }}
      >
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
