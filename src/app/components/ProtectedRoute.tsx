import { Navigate, useNavigate } from "react-router";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { UserRole, Permission, getCurrentUserRole, hasPermission, hasAnyPermission, getRoleLabel } from "../config/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  allowedRoles?: UserRole[];
  requireAll?: boolean;
  fallbackPath?: string;
  /** When true, render an inline Access Denied screen instead of redirecting */
  showDenied?: boolean;
}

// ── Access Denied Screen ───────────────────────────────────────────────────
function AccessDeniedScreen() {
  const navigate = useNavigate();
  const role = getCurrentUserRole();
  const roleLabel = role ? getRoleLabel(role) : "Unknown";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{ background: "linear-gradient(135deg, #FEE2E2, #FECACA)" }}
      >
        <ShieldX size={40} color="#DC2626" />
      </div>

      {/* Title */}
      <h1 style={{ color: "var(--foreground)", fontSize: "26px", fontWeight: 800, marginBottom: "8px" }}>
        Access Denied
      </h1>
      <p style={{ color: "var(--muted-foreground)", fontSize: "14px", maxWidth: "360px", lineHeight: 1.6, marginBottom: "8px" }}>
        You don't have permission to view this page.
      </p>

      {/* Role badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
        style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
      >
        <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
          Current role:
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: "#DC2626", color: "#fff" }}
        >
          {roleLabel}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:opacity-80"
          style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "14px", fontWeight: 600 }}
        >
          <ArrowLeft size={15} /> Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:opacity-80"
          style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", fontSize: "14px", fontWeight: 600, border: "none" }}
        >
          <Home size={15} /> Dashboard
        </button>
      </div>
    </div>
  );
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions,
  allowedRoles,
  requireAll = false,
  fallbackPath = "/",
  showDenied = true,
}: ProtectedRouteProps) {
  const currentRole = getCurrentUserRole();

  // Not logged in → login page
  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  const deny = () => showDenied ? <AccessDeniedScreen /> : <Navigate to={fallbackPath} replace />;

  // Role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentRole)) return deny();
  }

  // Single permission
  if (requiredPermission) {
    if (!hasPermission(currentRole, requiredPermission)) return deny();
  }

  // Multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      if (!requiredPermissions.every(p => hasPermission(currentRole, p))) return deny();
    } else {
      if (!hasAnyPermission(currentRole, requiredPermissions)) return deny();
    }
  }

  return <>{children}</>;
}

/**
 * Hook to check permissions in components
 */
export function usePermissions() {
  const role = getCurrentUserRole();

  return {
    role,
    hasPermission: (permission: Permission) => {
      if (!role) return false;
      return hasPermission(role, permission);
    },
    hasAnyPermission: (permissions: Permission[]) => {
      if (!role) return false;
      return hasAnyPermission(role, permissions);
    },
    hasAllPermissions: (permissions: Permission[]) => {
      if (!role) return false;
      return permissions.every(perm => hasPermission(role, perm));
    },
    isSuperAdmin: role === UserRole.SUPER_ADMIN,
    isAdmin:      role === UserRole.ADMIN,
    isHR:         role === UserRole.HR,
    isFinance:    role === UserRole.FINANCE,
    isManager:    role === UserRole.MANAGER,
    isEmployee:   role === UserRole.EMPLOYEE,
  };
}
