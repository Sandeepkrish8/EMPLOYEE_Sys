import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Employees } from "./pages/Employees";
import { EmployeeProfile } from "./pages/EmployeeProfile";
import { Attendance } from "./pages/Attendance";
import { Payroll } from "./pages/Payroll";
import { Recruitment } from "./pages/Recruitment";
import { Performance } from "./pages/Performance";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { LeaveManagement } from "./pages/LeaveManagement";
import { Departments } from "./pages/Departments";
import { UserProfile } from "./pages/UserProfile";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import SmartSearch from "./pages/SmartSearch";
import { ShiftSchedule } from "./pages/ShiftSchedule";
import { OnboardingWizard } from "./pages/OnboardingWizard";
import { NotFound } from "./pages/NotFound";
import { Help } from "./pages/Help";
import { Training } from "./pages/Training";
import { Documents } from "./pages/Documents";
import NotificationsHistory from "./pages/Notifications";
import { PerformanceLeaderboard } from "./pages/PerformanceLeaderboard";
import { Gamification } from "./pages/Gamification";
import { IncrementAppraisal } from "./pages/IncrementAppraisal";
import { WellnessReport } from "./pages/WellnessReport";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Permission, UserRole } from "./config/roles";
import { AdminPanel } from "./pages/AdminPanel";
import { FinancePanel } from "./pages/FinancePanel";
import { HRPanel } from "./pages/HRPanel";
import { EmployeePortal } from "./pages/EmployeePortal";
import { Expenses } from "./pages/Expenses";
import { BudgetOverview } from "./pages/BudgetOverview";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/onboarding", Component: OnboardingWizard },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      // Dashboard - accessible to all authenticated users
      { index: true, Component: Dashboard },
      
      // Profile - accessible to all (own profile)
      { 
        path: "profile", 
        element: (
          <ProtectedRoute requiredPermission={Permission.VIEW_OWN_PROFILE}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      
      // Smart Search - accessible to all
      { path: "smart-search", Component: SmartSearch },
      
      // Notifications - accessible to all
      { path: "notifications", Component: NotificationsHistory },
      
      // Help - accessible to all
      { path: "help", Component: Help },
      
      // HR & Admin Only Routes
      {
        path: "employees",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_EMPLOYEES]}
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR]}
          >
            <Employees />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees/:id",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_EMPLOYEES]}
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR]}
          >
            <EmployeeProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "departments",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_DEPARTMENTS]}
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.FINANCE]}
          >
            <Departments />
          </ProtectedRoute>
        ),
      },
      {
        path: "attendance",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_ATTENDANCE, Permission.VIEW_OWN_ATTENDANCE]}
          >
            <Attendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "payroll",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_PAYROLL, Permission.VIEW_OWN_PAYROLL]}
          >
            <Payroll />
          </ProtectedRoute>
        ),
      },
      {
        path: "recruitment",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_RECRUITMENT]}
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR]}
          >
            <Recruitment />
          </ProtectedRoute>
        ),
      },
      {
        path: "performance",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_PERFORMANCE, Permission.VIEW_OWN_PERFORMANCE]}
          >
            <Performance />
          </ProtectedRoute>
        ),
      },
      {
        path: "performance-leaderboard",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_PERFORMANCE, Permission.VIEW_OWN_PERFORMANCE]}
          >
            <PerformanceLeaderboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_REPORTS]}
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.FINANCE]}
          >
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.MANAGE_SETTINGS, Permission.VIEW_SETTINGS]}
          >
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "leave",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_LEAVES, Permission.CREATE_OWN_LEAVE]}
          >
            <LeaveManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "schedule",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_SCHEDULE, Permission.VIEW_OWN_SCHEDULE]}
          >
            <ShiftSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "training",
        element: (
          <ProtectedRoute requiredPermission={Permission.VIEW_TRAINING}>
            <Training />
          </ProtectedRoute>
        ),
      },
      {
        path: "documents",
        element: (
          <ProtectedRoute requiredPermission={Permission.VIEW_DOCUMENTS}>
            <Documents />
          </ProtectedRoute>
        ),
      },
      {
        path: "gamification",
        element: (
          <ProtectedRoute requiredPermission={Permission.VIEW_GAMIFICATION}>
            <Gamification />
          </ProtectedRoute>
        ),
      },
      {
        path: "increment-appraisal",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_INCREMENT]}
          >
            <IncrementAppraisal />
          </ProtectedRoute>
        ),
      },
      {
        path: "wellness-report",
        element: (
          <ProtectedRoute 
            requiredPermissions={[Permission.VIEW_WELLNESS]}
          >
            <WellnessReport />
          </ProtectedRoute>
        ),
      },

      // Role-specific panels
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: "finance",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.FINANCE]}>
            <FinancePanel />
          </ProtectedRoute>
        ),
      },
      {
        path: "hr",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR]}>
            <HRPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee",
        element: <EmployeePortal />,
      },
      {
        path: "expenses",
        element: (
          <ProtectedRoute requiredPermissions={[Permission.VIEW_EXPENSE_REPORTS, Permission.MANAGE_EXPENSE_REPORTS, Permission.SUBMIT_EXPENSES, Permission.VIEW_OWN_EXPENSES]}>
            <Expenses />
          </ProtectedRoute>
        ),
      },
      {
        path: "budget",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FINANCE]}>
            <BudgetOverview />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", Component: NotFound },
]);