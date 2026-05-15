import { ReactNode } from "react";
import { Permission, getCurrentUserRole, hasPermission, hasAnyPermission } from "../config/roles";

interface CanProps {
  perform?: Permission;
  performAny?: Permission[];
  performAll?: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Can Component - Conditionally render content based on permissions
 * 
 * Usage:
 * <Can perform={Permission.EDIT_EMPLOYEES}>
 *   <button>Edit Employee</button>
 * </Can>
 * 
 * <Can performAny={[Permission.VIEW_EMPLOYEES, Permission.EDIT_EMPLOYEES]}>
 *   <EmployeeList />
 * </Can>
 * 
 * <Can perform={Permission.DELETE_EMPLOYEES} fallback={<span>No access</span>}>
 *   <button>Delete</button>
 * </Can>
 */
export function Can({ perform, performAny, performAll, children, fallback = null }: CanProps) {
  const role = getCurrentUserRole();

  if (!role) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (perform) {
    if (!hasPermission(role, perform)) {
      return <>{fallback}</>;
    }
  }

  // Check if user has ANY of the specified permissions
  if (performAny && performAny.length > 0) {
    if (!hasAnyPermission(role, performAny)) {
      return <>{fallback}</>;
    }
  }

  // Check if user has ALL of the specified permissions
  if (performAll && performAll.length > 0) {
    const hasAll = performAll.every(perm => hasPermission(role, perm));
    if (!hasAll) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Cannot Component - Opposite of Can, renders when user DOESN'T have permission
 */
interface CannotProps {
  perform?: Permission;
  performAny?: Permission[];
  children: ReactNode;
}

export function Cannot({ perform, performAny, children }: CannotProps) {
  const role = getCurrentUserRole();

  if (!role) {
    return <>{children}</>;
  }

  // Check single permission
  if (perform) {
    if (hasPermission(role, perform)) {
      return null;
    }
  }

  // Check if user has ANY of the specified permissions
  if (performAny && performAny.length > 0) {
    if (hasAnyPermission(role, performAny)) {
      return null;
    }
  }

  return <>{children}</>;
}
