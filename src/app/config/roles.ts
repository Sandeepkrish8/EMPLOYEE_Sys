// Role-Based Access Control Configuration

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  HR = 'hr',
  FINANCE = 'finance',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export enum Permission {
  // User & Role Management (Super Admin only)
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  ASSIGN_ROLES = 'assign_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  VIEW_ALL_USERS = 'view_all_users',
  
  // Employee Management
  VIEW_EMPLOYEES = 'view_employees',
  CREATE_EMPLOYEES = 'create_employees',
  EDIT_EMPLOYEES = 'edit_employees',
  DELETE_EMPLOYEES = 'delete_employees',
  VIEW_TEAM_EMPLOYEES = 'view_team_employees', // Manager can view their team
  EDIT_TEAM_EMPLOYEES = 'edit_team_employees', // Manager can edit their team members
  
  // Department Management
  VIEW_DEPARTMENTS = 'view_departments',
  MANAGE_DEPARTMENTS = 'manage_departments',
  
  // Attendance
  VIEW_ATTENDANCE = 'view_attendance',
  MANAGE_ATTENDANCE = 'manage_attendance',
  VIEW_TEAM_ATTENDANCE = 'view_team_attendance', // Manager can view team attendance
  VIEW_OWN_ATTENDANCE = 'view_own_attendance',
  
  // Leave Management
  VIEW_LEAVES = 'view_leaves',
  APPROVE_LEAVES = 'approve_leaves',
  APPROVE_TEAM_LEAVES = 'approve_team_leaves', // Manager can approve team leaves
  CREATE_OWN_LEAVE = 'create_own_leave',
  
  // Payroll
  VIEW_PAYROLL = 'view_payroll',
  MANAGE_PAYROLL = 'manage_payroll',
  VIEW_OWN_PAYROLL = 'view_own_payroll',
  
  // Recruitment
  VIEW_RECRUITMENT = 'view_recruitment',
  MANAGE_RECRUITMENT = 'manage_recruitment',
  
  // Performance
  VIEW_PERFORMANCE = 'view_performance',
  MANAGE_PERFORMANCE = 'manage_performance',
  VIEW_TEAM_PERFORMANCE = 'view_team_performance', // Manager can view team performance
  MANAGE_TEAM_PERFORMANCE = 'manage_team_performance', // Manager can manage team performance
  VIEW_OWN_PERFORMANCE = 'view_own_performance',
  
  // Reports
  VIEW_REPORTS = 'view_reports',
  GENERATE_REPORTS = 'generate_reports',
  VIEW_TEAM_REPORTS = 'view_team_reports', // Manager can view team reports
  
  // Settings
  VIEW_SETTINGS = 'view_settings',
  MANAGE_SETTINGS = 'manage_settings',
  
  // Schedule
  VIEW_SCHEDULE = 'view_schedule',
  MANAGE_SCHEDULE = 'manage_schedule',
  VIEW_OWN_SCHEDULE = 'view_own_schedule',
  
  // Training
  VIEW_TRAINING = 'view_training',
  MANAGE_TRAINING = 'manage_training',
  
  // Documents
  VIEW_DOCUMENTS = 'view_documents',
  MANAGE_DOCUMENTS = 'manage_documents',
  
  // Profile
  VIEW_OWN_PROFILE = 'view_own_profile',
  EDIT_OWN_PROFILE = 'edit_own_profile',
  
  // Gamification & Wellness
  VIEW_GAMIFICATION = 'view_gamification',
  VIEW_WELLNESS = 'view_wellness',
  MANAGE_WELLNESS = 'manage_wellness',
  
  // Increment & Appraisal
  VIEW_INCREMENT = 'view_increment',
  MANAGE_INCREMENT = 'manage_increment',
  
  // Task & Project Management
  VIEW_TASKS = 'view_tasks',
  CREATE_TASKS = 'create_tasks',
  ASSIGN_TASKS = 'assign_tasks',
  MANAGE_TASKS = 'manage_tasks',
  VIEW_OWN_TASKS = 'view_own_tasks',

  // Finance-specific
  VIEW_FINANCIAL_DASHBOARD = 'view_financial_dashboard',
  VIEW_INVOICES = 'view_invoices',
  MANAGE_INVOICES = 'manage_invoices',
  VIEW_BUDGETS = 'view_budgets',
  MANAGE_BUDGETS = 'manage_budgets',
  VIEW_EXPENSE_REPORTS = 'view_expense_reports',
  MANAGE_EXPENSE_REPORTS = 'manage_expense_reports',

  // Expenses (employee-facing)
  SUBMIT_EXPENSES = 'submit_expenses',
  VIEW_OWN_EXPENSES = 'view_own_expenses',
}

// Define permissions for each role
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Super Admin has ALL permissions including user/role management
    ...Object.values(Permission),
  ],
  
  [UserRole.ADMIN]: [
    // Admin/HR has full access except user/role management (reserved for Super Admin)
    // Employee Management
    Permission.VIEW_EMPLOYEES,
    Permission.CREATE_EMPLOYEES,
    Permission.EDIT_EMPLOYEES,
    Permission.DELETE_EMPLOYEES,
    
    // Department Management
    Permission.VIEW_DEPARTMENTS,
    Permission.MANAGE_DEPARTMENTS,
    
    // Attendance
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,
    
    // Leave Management
    Permission.VIEW_LEAVES,
    Permission.APPROVE_LEAVES,
    Permission.CREATE_OWN_LEAVE,
    
    // Payroll
    Permission.VIEW_PAYROLL,
    Permission.MANAGE_PAYROLL,
    Permission.VIEW_OWN_PAYROLL,
    
    // Recruitment
    Permission.VIEW_RECRUITMENT,
    Permission.MANAGE_RECRUITMENT,
    
    // Performance
    Permission.VIEW_PERFORMANCE,
    Permission.MANAGE_PERFORMANCE,
    
    // Reports
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    
    // Settings
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    
    // Schedule
    Permission.VIEW_SCHEDULE,
    Permission.MANAGE_SCHEDULE,
    
    // Training
    Permission.VIEW_TRAINING,
    Permission.MANAGE_TRAINING,
    
    // Documents
    Permission.VIEW_DOCUMENTS,
    Permission.MANAGE_DOCUMENTS,
    
    // Profile
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    
    // Gamification & Wellness
    Permission.VIEW_GAMIFICATION,
    Permission.VIEW_WELLNESS,
    Permission.MANAGE_WELLNESS,
    
    // Increment & Appraisal
    Permission.VIEW_INCREMENT,
    Permission.MANAGE_INCREMENT,
    
    // Tasks
    Permission.VIEW_TASKS,
    Permission.CREATE_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.MANAGE_TASKS,

    // Expenses
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_OWN_EXPENSES,
    Permission.VIEW_EXPENSE_REPORTS,
    Permission.MANAGE_EXPENSE_REPORTS,
    Permission.VIEW_BUDGETS,
    Permission.MANAGE_BUDGETS,
  ],
  
  [UserRole.MANAGER]: [
    // Manager can manage their team members and approve team-specific requests
    // Team Employee Management
    Permission.VIEW_TEAM_EMPLOYEES,
    Permission.EDIT_TEAM_EMPLOYEES,
    
    // Team Attendance
    Permission.VIEW_TEAM_ATTENDANCE,
    Permission.VIEW_OWN_ATTENDANCE,
    
    // Team Leave Management
    Permission.APPROVE_TEAM_LEAVES,
    Permission.CREATE_OWN_LEAVE,
    
    // Team Performance
    Permission.VIEW_TEAM_PERFORMANCE,
    Permission.MANAGE_TEAM_PERFORMANCE,
    Permission.VIEW_OWN_PERFORMANCE,
    
    // Team Reports
    Permission.VIEW_TEAM_REPORTS,
    
    // Schedule
    Permission.VIEW_SCHEDULE,
    Permission.VIEW_OWN_SCHEDULE,
    
    // Training
    Permission.VIEW_TRAINING,
    
    // Documents
    Permission.VIEW_DOCUMENTS,
    
    // Profile
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    
    // Gamification & Wellness
    Permission.VIEW_GAMIFICATION,
    Permission.VIEW_WELLNESS,
    
    // Tasks - Managers can create and assign tasks to their team
    Permission.VIEW_TASKS,
    Permission.CREATE_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.MANAGE_TASKS,
    Permission.VIEW_OWN_TASKS,
    
    // Payroll - Own only
    Permission.VIEW_OWN_PAYROLL,
    
    // Increment
    Permission.VIEW_INCREMENT,

    // Expenses
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_OWN_EXPENSES,
  ],
  // HR: personnel, hiring, reports — NO company financial data
  [UserRole.HR]: [
    // Employee Management
    Permission.VIEW_EMPLOYEES,
    Permission.CREATE_EMPLOYEES,
    Permission.EDIT_EMPLOYEES,
    Permission.DELETE_EMPLOYEES,

    // Department Management
    Permission.VIEW_DEPARTMENTS,
    Permission.MANAGE_DEPARTMENTS,

    // Attendance
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,

    // Leave Management
    Permission.VIEW_LEAVES,
    Permission.APPROVE_LEAVES,
    Permission.CREATE_OWN_LEAVE,

    // Recruitment
    Permission.VIEW_RECRUITMENT,
    Permission.MANAGE_RECRUITMENT,

    // Performance
    Permission.VIEW_PERFORMANCE,
    Permission.MANAGE_PERFORMANCE,

    // Reports (non-financial)
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,

    // Settings
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,

    // Schedule
    Permission.VIEW_SCHEDULE,
    Permission.MANAGE_SCHEDULE,

    // Training
    Permission.VIEW_TRAINING,
    Permission.MANAGE_TRAINING,

    // Documents
    Permission.VIEW_DOCUMENTS,
    Permission.MANAGE_DOCUMENTS,

    // Profile
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,

    // Gamification & Wellness
    Permission.VIEW_GAMIFICATION,
    Permission.VIEW_WELLNESS,
    Permission.MANAGE_WELLNESS,

    // Increment & Appraisal
    Permission.VIEW_INCREMENT,
    Permission.MANAGE_INCREMENT,

    // Tasks
    Permission.VIEW_TASKS,
    Permission.CREATE_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.MANAGE_TASKS,

    // Own payroll only — HR cannot view company-wide financial data
    Permission.VIEW_OWN_PAYROLL,

    // Expenses
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_OWN_EXPENSES,
  ],

  // Finance: financial data — NO detailed personnel/HR records
  [UserRole.FINANCE]: [
    // Payroll (company-wide)
    Permission.VIEW_PAYROLL,
    Permission.MANAGE_PAYROLL,
    Permission.VIEW_OWN_PAYROLL,

    // Finance-specific
    Permission.VIEW_FINANCIAL_DASHBOARD,
    Permission.VIEW_INVOICES,
    Permission.MANAGE_INVOICES,
    Permission.VIEW_BUDGETS,
    Permission.MANAGE_BUDGETS,
    Permission.VIEW_EXPENSE_REPORTS,
    Permission.MANAGE_EXPENSE_REPORTS,
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_OWN_EXPENSES,

    // Reports (financial)
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,

    // Departments (budget visibility only)
    Permission.VIEW_DEPARTMENTS,

    // Profile
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,

    // Training, Documents, Wellness (self-service)
    Permission.VIEW_TRAINING,
    Permission.VIEW_DOCUMENTS,
    Permission.VIEW_WELLNESS,

    // Schedule & Attendance (own only)
    Permission.VIEW_OWN_SCHEDULE,
    Permission.VIEW_OWN_ATTENDANCE,

    // Leave (own)
    Permission.CREATE_OWN_LEAVE,

    // Tasks (own)
    Permission.VIEW_OWN_TASKS,
  ],

  [UserRole.EMPLOYEE]: [
    // Attendance - Own only
    Permission.VIEW_OWN_ATTENDANCE,
    
    // Leave - Own only
    Permission.CREATE_OWN_LEAVE,
    
    // Payroll - Own only
    Permission.VIEW_OWN_PAYROLL,
    
    // Performance - Own only
    Permission.VIEW_OWN_PERFORMANCE,
    
    // Schedule - Own only
    Permission.VIEW_OWN_SCHEDULE,
    
    // Training
    Permission.VIEW_TRAINING,
    
    // Documents
    Permission.VIEW_DOCUMENTS,
    
    // Profile
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    
    // Gamification
    Permission.VIEW_GAMIFICATION,
    
    // Wellness
    Permission.VIEW_WELLNESS,
    
    // Tasks - View own tasks
    Permission.VIEW_OWN_TASKS,
    
    // Increment
    Permission.VIEW_INCREMENT,

    // Expenses
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_OWN_EXPENSES,

    // Expenses
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_OWN_EXPENSES,
  ],
};

// Helper function to check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return RolePermissions[role]?.includes(permission) ?? false;
}

// Helper function to check if a role has any of the specified permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Helper function to check if a role has all of the specified permissions
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

// Get current user role from session storage
export function getCurrentUserRole(): UserRole | null {
  const roleStr = sessionStorage.getItem('userRole');
  if (!roleStr) return null;
  
  // Map legacy roles to new role system
  const roleMap: Record<string, UserRole> = {
    'super_admin': UserRole.SUPER_ADMIN,
    'admin': UserRole.ADMIN,
    'hr': UserRole.HR,
    'finance': UserRole.FINANCE,
    'hr_manager': UserRole.ADMIN, // Legacy: map to Admin
    'recruiter': UserRole.ADMIN,  // Legacy: map to Admin
    'manager': UserRole.MANAGER,
    'employee': UserRole.EMPLOYEE,
  };
  
  return roleMap[roleStr] || UserRole.EMPLOYEE;
}

// Check if current user has permission
export function currentUserHasPermission(permission: Permission): boolean {
  const role = getCurrentUserRole();
  if (!role) return false;
  return hasPermission(role, permission);
}

// Check if current user has any of the permissions
export function currentUserHasAnyPermission(permissions: Permission[]): boolean {
  const role = getCurrentUserRole();
  if (!role) return false;
  return hasAnyPermission(role, permissions);
}

// Get user role label
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Administrator',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.HR]: 'HR Manager',
    [UserRole.FINANCE]: 'Finance',
    [UserRole.MANAGER]: 'Manager',
    [UserRole.EMPLOYEE]: 'Employee',
  };
  return labels[role] || 'Unknown';
}
