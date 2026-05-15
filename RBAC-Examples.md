# RBAC Implementation Examples

This guide provides practical examples of how to implement Role-Based Access Control (RBAC) in various components of the EMS application.

## Table of Contents
1. [Route Protection Examples](#route-protection-examples)
2. [Component-Level Examples](#component-level-examples)
3. [Team-Scoped Access for Managers](#team-scoped-access-for-managers)
4. [User Management (Super Admin)](#user-management-super-admin)
5. [Leave Approval System](#leave-approval-system)

---

## Route Protection Examples

### Example 1: Employees Page (Multi-Role Access)

```tsx
// src/app/routes.tsx
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Permission } from "./config/roles";

{
  path: "employees",
  element: (
    <ProtectedRoute 
      requiredPermissions={[
        Permission.VIEW_EMPLOYEES,      // For Admin/Super Admin
        Permission.VIEW_TEAM_EMPLOYEES  // For Managers
      ]}
    >
      <Employees />
    </ProtectedRoute>
  ),
}
```

Inside the Employees component, you can differentiate between full access and team access:

```tsx
// src/app/pages/Employees.tsx
import { usePermissions } from "../components/ProtectedRoute";
import { Permission } from "../config/roles";

export function Employees() {
  const { hasPermission } = usePermissions();
  
  const canViewAll = hasPermission(Permission.VIEW_EMPLOYEES);
  const canViewTeam = hasPermission(Permission.VIEW_TEAM_EMPLOYEES);
  
  // Fetch appropriate data based on permissions
  const employees = canViewAll 
    ? fetchAllEmployees()
    : fetchTeamEmployees(); // Only team members for managers
  
  return (
    <div>
      <h1>
        {canViewAll ? "All Employees" : "My Team"}
      </h1>
      <EmployeeTable 
        employees={employees}
        canEdit={canViewAll}
        canEditTeam={canViewTeam}
      />
    </div>
  );
}
```

### Example 2: User Management (Super Admin Only)

```tsx
// src/app/routes.tsx
{
  path: "user-management",
  element: (
    <ProtectedRoute 
      allowedRoles={[UserRole.SUPER_ADMIN]}
    >
      <UserManagement />
    </ProtectedRoute>
  ),
}
```

---

## Component-Level Examples

### Example 3: Employee Card with Conditional Actions

```tsx
import { Can } from "../components/Can";
import { Permission } from "../config/roles";

interface EmployeeCardProps {
  employee: Employee;
  isTeamMember: boolean;
}

export function EmployeeCard({ employee, isTeamMember }: EmployeeCardProps) {
  return (
    <div className="employee-card">
      <h3>{employee.name}</h3>
      <p>{employee.position}</p>
      
      {/* Show edit for full access (Admin/Super Admin) */}
      <Can perform={Permission.EDIT_EMPLOYEES}>
        <button onClick={() => editEmployee(employee.id)}>
          Edit Employee
        </button>
      </Can>
      
      {/* Show edit for team members (Manager) */}
      <Can perform={Permission.EDIT_TEAM_EMPLOYEES}>
        {isTeamMember && (
          <button onClick={() => editTeamMember(employee.id)}>
            Edit Team Member
          </button>
        )}
      </Can>
      
      {/* Delete only for Super Admin and Admin */}
      <Can perform={Permission.DELETE_EMPLOYEES}>
        <button onClick={() => deleteEmployee(employee.id)}>
          Delete
        </button>
      </Can>
    </div>
  );
}
```

### Example 4: Settings Page with Multiple Permission Levels

```tsx
import { Can } from "../components/Can";
import { usePermissions } from "../components/ProtectedRoute";
import { Permission } from "../config/roles";

export function Settings() {
  const { isSuperAdmin, isAdmin } = usePermissions();
  
  return (
    <div>
      <h1>Settings</h1>
      
      {/* Super Admin only sections */}
      {isSuperAdmin && (
        <section>
          <h2>User Management</h2>
          <button>Create New User</button>
          <button>Assign Roles</button>
          <button>Manage Permissions</button>
        </section>
      )}
      
      {/* Admin and Super Admin sections */}
      <Can perform={Permission.MANAGE_SETTINGS}>
        <section>
          <h2>Company Settings</h2>
          <button>Configure Departments</button>
          <button>Set Working Hours</button>
          <button>Manage Holidays</button>
        </section>
      </Can>
      
      {/* View only for everyone */}
      <section>
        <h2>My Preferences</h2>
        <button>Change Password</button>
        <button>Update Profile</button>
      </section>
    </div>
  );
}
```

---

## Team-Scoped Access for Managers

### Example 5: Team Dashboard

```tsx
import { usePermissions } from "../components/ProtectedRoute";
import { Permission } from "../config/roles";
import { useState, useEffect } from "react";

export function TeamDashboard() {
  const { hasPermission, isManager } = usePermissions();
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [teamLeaves, setTeamLeaves] = useState<Leave[]>([]);
  
  useEffect(() => {
    // Fetch team data (backend should filter by manager's team)
    if (hasPermission(Permission.VIEW_TEAM_EMPLOYEES)) {
      fetchTeamMembers().then(setTeamMembers);
      fetchTeamLeaveRequests().then(setTeamLeaves);
    }
  }, []);
  
  return (
    <div className="team-dashboard">
      <h1>Team Management</h1>
      
      {/* Team Members Section */}
      <section>
        <h2>My Team Members ({teamMembers.length})</h2>
        <div className="team-grid">
          {teamMembers.map(member => (
            <TeamMemberCard 
              key={member.id} 
              member={member}
              canEdit={hasPermission(Permission.EDIT_TEAM_EMPLOYEES)}
            />
          ))}
        </div>
      </section>
      
      {/* Pending Leave Approvals */}
      <Can perform={Permission.APPROVE_TEAM_LEAVES}>
        <section>
          <h2>Pending Leave Requests</h2>
          {teamLeaves.map(leave => (
            <LeaveRequestCard 
              key={leave.id}
              leave={leave}
              onApprove={() => approveLeave(leave.id)}
              onReject={() => rejectLeave(leave.id)}
            />
          ))}
        </section>
      </Can>
      
      {/* Team Performance */}
      <Can perform={Permission.VIEW_TEAM_PERFORMANCE}>
        <section>
          <h2>Team Performance</h2>
          <TeamPerformanceChart members={teamMembers} />
        </section>
      </Can>
      
      {/* Task Assignment */}
      <Can perform={Permission.ASSIGN_TASKS}>
        <section>
          <h2>Task Management</h2>
          <button onClick={() => openTaskModal()}>
            Assign New Task
          </button>
          <TaskList teamMembers={teamMembers} />
        </section>
      </Can>
    </div>
  );
}
```

### Example 6: Backend API Integration (Team Filtering)

```tsx
// Example API service for managers
export async function fetchTeamEmployees(): Promise<Employee[]> {
  const currentUser = getCurrentUser();
  
  // Backend should filter employees by manager_id
  const response = await fetch('/api/employees/team', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'User-Role': currentUser.role,
      'User-ID': currentUser.id
    }
  });
  
  return response.json();
}

// Example: Approve team leave
export async function approveTeamLeave(leaveId: string): Promise<void> {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(Permission.APPROVE_TEAM_LEAVES)) {
    throw new Error('Insufficient permissions');
  }
  
  await fetch(`/api/leaves/${leaveId}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    }
  });
}
```

---

## User Management (Super Admin)

### Example 7: User Management Page

```tsx
import { useState } from "react";
import { UserRole, Permission } from "../config/roles";
import { Can } from "../components/Can";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  return (
    <div>
      <h1>User Management</h1>
      
      <Can perform={Permission.CREATE_USERS}>
        <button onClick={() => setShowCreateModal(true)}>
          Create New User
        </button>
      </Can>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>
                <Can perform={Permission.ASSIGN_ROLES}>
                  <select 
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                    <option value={UserRole.ADMIN}>Admin / HR</option>
                    <option value={UserRole.MANAGER}>Manager</option>
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                  </select>
                </Can>
                
                <Can 
                  perform={Permission.ASSIGN_ROLES}
                  fallback={<span>{getRoleLabel(user.role)}</span>}
                />
              </td>
              <td>
                <Can perform={Permission.EDIT_USERS}>
                  <button onClick={() => editUser(user.id)}>Edit</button>
                </Can>
                
                <Can perform={Permission.DELETE_USERS}>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </Can>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Leave Approval System

### Example 8: Multi-Level Leave Approval

```tsx
import { Can } from "../components/Can";
import { Permission } from "../config/roles";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  isTeamMember: boolean; // For managers
}

export function LeaveApprovals() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  
  return (
    <div>
      <h1>Leave Approvals</h1>
      
      {/* Admin/Super Admin can see all leaves */}
      <Can perform={Permission.APPROVE_LEAVES}>
        <h2>All Company Leave Requests</h2>
        {leaves.map(leave => (
          <LeaveCard 
            key={leave.id}
            leave={leave}
            onApprove={() => approveLeave(leave.id)}
            onReject={() => rejectLeave(leave.id)}
          />
        ))}
      </Can>
      
      {/* Manager can see only team leaves */}
      <Can perform={Permission.APPROVE_TEAM_LEAVES}>
        <h2>Team Leave Requests</h2>
        {leaves
          .filter(leave => leave.isTeamMember)
          .map(leave => (
            <LeaveCard 
              key={leave.id}
              leave={leave}
              onApprove={() => approveTeamLeave(leave.id)}
              onReject={() => rejectTeamLeave(leave.id)}
            />
          ))}
      </Can>
    </div>
  );
}
```

---

## Best Practices

### 1. **Always Check Permissions on Both Client and Server**

```tsx
// Client-side check
const { hasPermission } = usePermissions();
if (hasPermission(Permission.DELETE_EMPLOYEES)) {
  // Show delete button
}

// Server-side check (example Express.js)
app.delete('/api/employees/:id', authenticateUser, (req, res) => {
  if (!hasPermission(req.user.role, Permission.DELETE_EMPLOYEES)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Proceed with deletion
});
```

### 2. **Use Fallback UI for Better UX**

```tsx
<Can 
  perform={Permission.EDIT_EMPLOYEES}
  fallback={<p className="text-muted">Contact admin to edit employees</p>}
>
  <EditEmployeeForm />
</Can>
```

### 3. **Combine Multiple Permission Checks**

```tsx
<Can 
  performAny={[
    Permission.VIEW_EMPLOYEES,
    Permission.VIEW_TEAM_EMPLOYEES
  ]}
>
  <EmployeeList />
</Can>
```

### 4. **Team Scope Filtering in Backend**

```javascript
// Backend example (Node.js/Express)
router.get('/employees', authenticateUser, async (req, res) => {
  const { role, id: managerId } = req.user;
  
  let employees;
  
  if (hasPermission(role, Permission.VIEW_EMPLOYEES)) {
    // Admin/Super Admin: view all
    employees = await Employee.findAll();
  } else if (hasPermission(role, Permission.VIEW_TEAM_EMPLOYEES)) {
    // Manager: view only team members
    employees = await Employee.findAll({
      where: { managerId }
    });
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(employees);
});
```

---

## Testing Your RBAC Implementation

### 1. Create test accounts with different roles
```bash
# Super Admin
Email: superadmin@test.com
Role: Super Admin

# Admin
Email: admin@test.com
Role: Admin / HR

# Manager
Email: manager@test.com
Role: Manager

# Employee
Email: employee@test.com
Role: Employee
```

### 2. Test permission boundaries
- ✅ Verify Super Admin can access user management
- ✅ Verify Admin cannot access user management
- ✅ Verify Manager can only see their team
- ✅ Verify Employee can only see their own data

### 3. Test route protection
- Try accessing protected routes with insufficient permissions
- Verify proper redirects and error messages

---

## Summary

The RBAC system provides:
- ✅ Fine-grained permission control
- ✅ Easy-to-use components (Can, ProtectedRoute)
- ✅ Flexible hooks (usePermissions)
- ✅ Team-scoped access for Managers
- ✅ Hierarchical role structure
- ✅ Clear separation of concerns

Always remember: **Client-side checks are for UX, server-side checks are for security!**
