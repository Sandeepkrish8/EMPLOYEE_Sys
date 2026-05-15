# Role-Based Access Control (RBAC) Guide

## Overview

The application implements a comprehensive Role-Based Access Control (RBAC) system that restricts access to features and data based on user roles and permissions.

## User Roles

The system supports four primary roles with hierarchical permissions:

### 1. **Super Admin**
- **Highest authority** with complete system control
- Full access to all features and functionalities
- **Unique capabilities:**
  - Can create, update, and delete all users (Admins, Managers, Employees)
  - Can assign roles and permissions
  - Can manage company-wide settings
- Can view all dashboards, reports, and analytics
- Can approve/reject leave requests
- Can manage all employees, departments, payroll, and settings

### 2. **Admin / HR Manager**
- **Second-highest authority** with full HR operations access
- Can manage employee records and departments
- Can handle recruitment, payroll, and leave approvals
- Can view and manage attendance and schedules
- Can generate reports and analytics
- Can manage training and documents
- Can manage increment/appraisal and wellness programs
- Can manage all company settings
- **Cannot** create/delete users or assign roles (reserved for Super Admin)

### 3. **Manager**
- **Team-level authority** with limited scope to assigned team members
- Can view and manage employees under their team only
- Can assign tasks or projects to team members
- Can approve/reject leave requests of team members
- Can view team performance reports and attendance
- Can view their own profile, attendance, payroll, and performance
- **Cannot** access employees outside their team
- **Cannot** access company-wide HR features (recruitment, reports, etc.)
- **Cannot** modify system settings

### 4. **Employee (User)**
- **Basic access** to personal information only
- Can view and update their own profile
- Can apply for leave
- Can view leave status and history
- Can view assigned tasks and performance
- Can view their own:
  - Profile
  - Attendance records
  - Payroll/salary information
  - Performance metrics
  - Schedule
- Can access training materials and documents
- Can participate in gamification
- Can view wellness reports
- **Cannot** access or modify other employees' data
- **Cannot** access HR-specific modules (recruitment, reports, etc.)

## Permission System

The system uses fine-grained permissions to control access. Permissions are categorized by functionality:

### User & Role Management (Super Admin Only)
- `CREATE_USERS` - Create new user accounts
- `EDIT_USERS` - Modify user accounts
- `DELETE_USERS` - Remove user accounts
- `ASSIGN_ROLES` - Assign or change user roles
- `MANAGE_PERMISSIONS` - Modify permission settings
- `VIEW_ALL_USERS` - View all system users

### Employee Management
- `VIEW_EMPLOYEES` - View all employee list and details (Admin, Super Admin)
- `CREATE_EMPLOYEES` - Add new employees (Admin, Super Admin)
- `EDIT_EMPLOYEES` - Modify employee information (Admin, Super Admin)
- `DELETE_EMPLOYEES` - Remove employees (Admin, Super Admin)
- `VIEW_TEAM_EMPLOYEES` - View team members only (Manager)
- `EDIT_TEAM_EMPLOYEES` - Edit team member details (Manager)

### Attendance
- `VIEW_ATTENDANCE` - View all attendance records (Admin, Super Admin)
- `MANAGE_ATTENDANCE` - Modify attendance records (Admin, Super Admin)
- `VIEW_TEAM_ATTENDANCE` - View team attendance (Manager)
- `VIEW_OWN_ATTENDANCE` - View own attendance (All roles)

### Payroll
- `VIEW_PAYROLL` - View all payroll data (Admin, Super Admin)
- `MANAGE_PAYROLL` - Process payroll (Admin, Super Admin)
- `VIEW_OWN_PAYROLL` - View own salary (All roles)

### Leave Management
- `VIEW_LEAVES` - View all leave requests (Admin, Super Admin)
- `APPROVE_LEAVES` - Approve/reject all leaves (Admin, Super Admin)
- `APPROVE_TEAM_LEAVES` - Approve/reject team leaves (Manager)
- `CREATE_OWN_LEAVE` - Create leave request (All roles)

### Performance
- `VIEW_PERFORMANCE` - View all performance data (Admin, Super Admin)
- `MANAGE_PERFORMANCE` - Manage all reviews (Admin, Super Admin)
- `VIEW_TEAM_PERFORMANCE` - View team performance (Manager)
- `MANAGE_TEAM_PERFORMANCE` - Manage team reviews (Manager)
- `VIEW_OWN_PERFORMANCE` - View own performance (All roles)

### Reports
- `VIEW_REPORTS` - View all company reports (Admin, Super Admin)
- `GENERATE_REPORTS` - Generate company reports (Admin, Super Admin)
- `VIEW_TEAM_REPORTS` - View team reports (Manager)

### Task & Project Management
- `VIEW_TASKS` - View all tasks (Admin, Super Admin, Manager)
- `CREATE_TASKS` - Create tasks (Admin, Super Admin, Manager)
- `ASSIGN_TASKS` - Assign tasks to employees (Admin, Super Admin, Manager)
- `MANAGE_TASKS` - Manage tasks (Admin, Super Admin, Manager)
- `VIEW_OWN_TASKS` - View assigned tasks (All roles)

And many more permissions for departments, recruitment, settings, training, documents, wellness, etc.

## Implementation

### 1. Protected Routes

Routes are protected using the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Permission, UserRole } from "./config/roles";

// Protect by permission
<ProtectedRoute requiredPermission={Permission.VIEW_EMPLOYEES}>
  <Employees />
</ProtectedRoute>

// Protect by multiple permissions (user needs at least one)
<ProtectedRoute 
  requiredPermissions={[
    Permission.VIEW_PAYROLL, 
    Permission.VIEW_OWN_PAYROLL
  ]}
>
  <Payroll />
</ProtectedRoute>

// Allow all employees or team view (for Managers)
<ProtectedRoute 
  requiredPermissions={[
    Permission.VIEW_EMPLOYEES, 
    Permission.VIEW_TEAM_EMPLOYEES
  ]}
>
  <EmployeeView />
</ProtectedRoute>

// Protect by role (Super Admin only)
<ProtectedRoute 
  allowedRoles={[UserRole.SUPER_ADMIN]}
>
  <UserManagement />
</ProtectedRoute>

// Protect by role (Admin and Super Admin)
<ProtectedRoute 
  allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
>
  <Recruitment />
</ProtectedRoute>

// Protect by both role and permission
<ProtectedRoute 
  requiredPermission={Permission.VIEW_EMPLOYEES}
  allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
>
  <AllEmployees />
</ProtectedRoute>

// Require all permissions (user must have ALL)
<ProtectedRoute 
  requiredPermissions={[Permission.EDIT_EMPLOYEES, Permission.DELETE_EMPLOYEES]}
  requireAll={true}
>
  <EmployeeAdmin />
</ProtectedRoute>
```

### 2. Conditional UI Rendering

Use the `Can` component to show/hide UI elements based on permissions:

```tsx
import { Can, Cannot } from "./components/Can";
import { Permission } from "./config/roles";

// Show button only if user has permission
<Can perform={Permission.EDIT_EMPLOYEES}>
  <button>Edit All Employees</button>
</Can>

// Show button for team editing (Managers)
<Can perform={Permission.EDIT_TEAM_EMPLOYEES}>
  <button>Edit Team Member</button>
</Can>

// Show if user has any of the permissions
<Can performAny={[Permission.VIEW_EMPLOYEES, Permission.VIEW_TEAM_EMPLOYEES]}>
  <EmployeeList />
</Can>

// Different actions based on permissions
<div>
  <Can perform={Permission.APPROVE_LEAVES}>
    <button>Approve All Leaves</button>
  </Can>
  <Can perform={Permission.APPROVE_TEAM_LEAVES}>
    <button>Approve Team Leaves</button>
  </Can>
</div>

// Show if user has all permissions
<Can performAll={[Permission.EDIT_EMPLOYEES, Permission.DELETE_EMPLOYEES]}>
  <button>Modify Employee</button>
</Can>

// Show fallback content if no permission
<Can 
  perform={Permission.DELETE_EMPLOYEES} 
  fallback={<span>You don't have permission to delete</span>}
>
  <button>Delete</button>
</Can>

// Show only if user DOESN'T have permission
<Cannot perform={Permission.MANAGE_SETTINGS}>
  <p>Contact admin to change settings</p>
</Cannot>
```

### 3. Using Hooks in Components

Use the `usePermissions` hook to check permissions programmatically:

```tsx
import { usePermissions } from "./components/ProtectedRoute";
import { Permission } from "./config/roles";

function EmployeeList() {
  const { 
    hasPermission, 
    isSuperAdmin, 
    isAdmin, 
    isManager, 
    isEmployee 
  } = usePermissions();

  const canEditAll = hasPermission(Permission.EDIT_EMPLOYEES);
  const canEditTeam = hasPermission(Permission.EDIT_TEAM_EMPLOYEES);
  const canDeleteEmployees = hasPermission(Permission.DELETE_EMPLOYEES);
  const canAssignRoles = hasPermission(Permission.ASSIGN_ROLES);

  return (
    <div>
      {isSuperAdmin && <UserManagementPanel />}
      {isAdmin && <HRTools />}
      {isManager && <TeamManagement />}
      {isEmployee && <EmployeeView />}
      
      {canEditAll && <button>Edit All Employees</button>}
      {canEditTeam && <button>Edit Team</button>}
      {canDeleteEmployees && <button>Delete</button>}
      {canAssignRoles && <button>Assign Roles</button>}
    </div>
  );
}
```

### 4. Helper Functions

Use helper functions directly in your code:

```tsx
import { 
  getCurrentUserRole, 
  hasPermission, 
  hasAnyPermission,
  currentUserHasPermission 
} from "./config/roles";
import { UserRole, Permission } from "./config/roles";

// Get current user's role
const role = getCurrentUserRole(); 
// Returns UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, or UserRole.EMPLOYEE

// Check if a specific role has a permission
if (hasPermission(UserRole.MANAGER, Permission.APPROVE_TEAM_LEAVES)) {
  // Manager can approve team leaves
}

if (hasPermission(UserRole.ADMIN, Permission.APPROVE_LEAVES)) {
  // Admin can approve all leaves
}

// Check if current user has permission
if (currentUserHasPermission(Permission.EDIT_EMPLOYEES)) {
  // Current user can edit employees
}

// Check if role has any of the permissions
if (hasAnyPermission(role, [Permission.VIEW_EMPLOYEES, Permission.EDIT_EMPLOYEES])) {
  // User has at least one of these permissions
}
```

## Sidebar Navigation

The sidebar automatically filters menu items based on user permissions. Users only see menu items they have access to:

- **Admin**: Sees all menu items
- **HR**: Sees all HR-related items (employees, recruitment, payroll, reports, etc.)
- **Employee**: Sees only employee-relevant items (profile, own attendance, documents, training, etc.)

## Testing Different Roles

To test different roles:

1. **Sign up** with different roles from the Signup page
2. **Log in** with credentials for each role
3. **Observe** different navigation items and accessible pages

### Default Test Accounts

You can create test accounts with these roles:

```javascript
// Admin Account
Email: admin@nexushr.com
Role: Admin

// HR Account
Email: hr@nexushr.com
Role: HR Manager

// Employee Account
Email: employee@nexushr.com
Role: Employee
```

## Role Mapping

The system supports legacy role names for backward compatibility:

- `admin` → `UserRole.ADMIN`
- `hr_manager`, `hr`, `recruiter` → `UserRole.HR`
- `employee` → `UserRole.EMPLOYEE`

## Session Storage

User authentication and role information is stored in `sessionStorage`:

- `isLoggedIn`: Boolean indicating login status
- `userRole`: User's role (admin, hr, or employee)
- `userFullName`: User's full name
- `userEmail`: User's email address

## Best Practices

1. **Always protect sensitive routes** with `ProtectedRoute`
2. **Use the `Can` component** for conditional UI rendering
3. **Check permissions** before performing sensitive operations
4. **Don't rely solely on UI hiding** - always validate permissions on the backend
5. **Use specific permissions** rather than just checking roles
6. **Test with all role types** to ensure proper access control

## Extending the System

### Adding New Permissions

1. Add the permission to the `Permission` enum in `src/app/config/roles.ts`
2. Add the permission to relevant role arrays in `RolePermissions`
3. Use the permission in `ProtectedRoute` or `Can` components

```typescript
// In roles.ts
export enum Permission {
  // ... existing permissions
  NEW_FEATURE_ACCESS = 'new_feature_access',
}

// In RolePermissions
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // ... existing permissions
    Permission.NEW_FEATURE_ACCESS,
  ],
  // ... other roles
};
```

### Adding New Routes

When adding new routes, always wrap them with `ProtectedRoute`:

```tsx
{
  path: "new-feature",
  element: (
    <ProtectedRoute 
      requiredPermission={Permission.NEW_FEATURE_ACCESS}
      allowedRoles={[UserRole.ADMIN]}
    >
      <NewFeature />
    </ProtectedRoute>
  ),
}
```

### Adding Sidebar Items

Add new navigation items to the `navItems` array in `Sidebar.tsx`:

```tsx
{
  icon: YourIcon,
  label: "New Feature",
  path: "/new-feature",
  permissions: [Permission.NEW_FEATURE_ACCESS],
  roles: [UserRole.ADMIN, UserRole.HR],
}
```

## Security Considerations

⚠️ **Important**: This is a frontend-only access control system. For production applications:

1. **Always implement backend validation** - Never trust frontend-only access control
2. **Validate permissions on the server** for all API requests
3. **Use secure authentication** (JWT, OAuth, etc.) instead of sessionStorage
4. **Implement audit logging** for sensitive operations
5. **Regularly review and update permissions** as requirements change

## Troubleshooting

### User can't access a page they should have access to

1. Check if the user's role is correctly set in sessionStorage
2. Verify the permission is included in the role's permission array
3. Check if the route protection matches the intended logic

### Navigation item not showing

1. Verify permissions are correctly specified in the `navItems` array
2. Check if the role has the required permissions
3. Ensure the permission check logic in Sidebar is correct

### Access denied when it shouldn't be

1. Check the `ProtectedRoute` configuration for that route
2. Verify role mapping in `getCurrentUserRole()` function
3. Check for typos in permission names

---

**Last Updated**: December 2024
**Version**: 1.0.0
