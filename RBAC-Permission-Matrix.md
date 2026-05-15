# RBAC Permission Matrix

## Role Hierarchy

```
Super Admin (Highest Authority)
    │
    ├── Admin / HR Manager
    │      │
    │      └── Manager
    │             │
    │             └── Employee (Basic User)
```

## Complete Permission Matrix

| Permission Category | Permission | Super Admin | Admin/HR | Manager | Employee |
|-------------------|------------|:-----------:|:--------:|:-------:|:--------:|
| **User & Role Management** |
| | CREATE_USERS | ✅ | ❌ | ❌ | ❌ |
| | EDIT_USERS | ✅ | ❌ | ❌ | ❌ |
| | DELETE_USERS | ✅ | ❌ | ❌ | ❌ |
| | ASSIGN_ROLES | ✅ | ❌ | ❌ | ❌ |
| | MANAGE_PERMISSIONS | ✅ | ❌ | ❌ | ❌ |
| | VIEW_ALL_USERS | ✅ | ❌ | ❌ | ❌ |
| **Employee Management** |
| | VIEW_EMPLOYEES | ✅ | ✅ | ❌ | ❌ |
| | CREATE_EMPLOYEES | ✅ | ✅ | ❌ | ❌ |
| | EDIT_EMPLOYEES | ✅ | ✅ | ❌ | ❌ |
| | DELETE_EMPLOYEES | ✅ | ✅ | ❌ | ❌ |
| | VIEW_TEAM_EMPLOYEES | ✅ | ✅ | ✅ | ❌ |
| | EDIT_TEAM_EMPLOYEES | ✅ | ✅ | ✅ | ❌ |
| **Department Management** |
| | VIEW_DEPARTMENTS | ✅ | ✅ | ❌ | ❌ |
| | MANAGE_DEPARTMENTS | ✅ | ✅ | ❌ | ❌ |
| **Attendance** |
| | VIEW_ATTENDANCE | ✅ | ✅ | ❌ | ❌ |
| | MANAGE_ATTENDANCE | ✅ | ✅ | ❌ | ❌ |
| | VIEW_TEAM_ATTENDANCE | ✅ | ✅ | ✅ | ❌ |
| | VIEW_OWN_ATTENDANCE | ✅ | ✅ | ✅ | ✅ |
| **Leave Management** |
| | VIEW_LEAVES | ✅ | ✅ | ❌ | ❌ |
| | APPROVE_LEAVES | ✅ | ✅ | ❌ | ❌ |
| | APPROVE_TEAM_LEAVES | ✅ | ✅ | ✅ | ❌ |
| | CREATE_OWN_LEAVE | ✅ | ✅ | ✅ | ✅ |
| **Payroll** |
| | VIEW_PAYROLL | ✅ | ✅ | ❌ | ❌ |
| | MANAGE_PAYROLL | ✅ | ✅ | ❌ | ❌ |
| | VIEW_OWN_PAYROLL | ✅ | ✅ | ✅ | ✅ |
| **Recruitment** |
| | VIEW_RECRUITMENT | ✅ | ✅ | ❌ | ❌ |
| | MANAGE_RECRUITMENT | ✅ | ✅ | ❌ | ❌ |
| **Performance** |
| | VIEW_PERFORMANCE | ✅ | ✅ | ❌ | ❌ |
| | MANAGE_PERFORMANCE | ✅ | ✅ | ❌ | ❌ |
| | VIEW_TEAM_PERFORMANCE | ✅ | ✅ | ✅ | ❌ |
| | MANAGE_TEAM_PERFORMANCE | ✅ | ✅ | ✅ | ❌ |
| | VIEW_OWN_PERFORMANCE | ✅ | ✅ | ✅ | ✅ |
| **Reports** |
| | VIEW_REPORTS | ✅ | ✅ | ❌ | ❌ |
| | GENERATE_REPORTS | ✅ | ✅ | ❌ | ❌ |
| | VIEW_TEAM_REPORTS | ✅ | ✅ | ✅ | ❌ |
| **Settings** |
| | VIEW_SETTINGS | ✅ | ✅ | ❌ | ❌ |
| | MANAGE_SETTINGS | ✅ | ✅ | ❌ | ❌ |
| **Schedule** |
| | VIEW_SCHEDULE | ✅ | ✅ | ✅ | ❌ |
| | MANAGE_SCHEDULE | ✅ | ✅ | ❌ | ❌ |
| | VIEW_OWN_SCHEDULE | ✅ | ✅ | ✅ | ✅ |
| **Training** |
| | VIEW_TRAINING | ✅ | ✅ | ✅ | ✅ |
| | MANAGE_TRAINING | ✅ | ✅ | ❌ | ❌ |
| **Documents** |
| | VIEW_DOCUMENTS | ✅ | ✅ | ✅ | ✅ |
| | MANAGE_DOCUMENTS | ✅ | ✅ | ❌ | ❌ |
| **Profile** |
| | VIEW_OWN_PROFILE | ✅ | ✅ | ✅ | ✅ |
| | EDIT_OWN_PROFILE | ✅ | ✅ | ✅ | ✅ |
| **Gamification & Wellness** |
| | VIEW_GAMIFICATION | ✅ | ✅ | ✅ | ✅ |
| | VIEW_WELLNESS | ✅ | ✅ | ✅ | ✅ |
| | MANAGE_WELLNESS | ✅ | ✅ | ❌ | ❌ |
| **Increment & Appraisal** |
| | VIEW_INCREMENT | ✅ | ✅ | ✅ | ✅ |
| | MANAGE_INCREMENT | ✅ | ✅ | ❌ | ❌ |
| **Task & Project Management** |
| | VIEW_TASKS | ✅ | ✅ | ✅ | ❌ |
| | CREATE_TASKS | ✅ | ✅ | ✅ | ❌ |
| | ASSIGN_TASKS | ✅ | ✅ | ✅ | ❌ |
| | MANAGE_TASKS | ✅ | ✅ | ✅ | ❌ |
| | VIEW_OWN_TASKS | ✅ | ✅ | ✅ | ✅ |

## Role Capabilities Summary

### 🔴 Super Admin
**Total Permissions:** ALL (60+)

**Unique Capabilities:**
- ✅ Create, edit, and delete user accounts
- ✅ Assign and modify user roles
- ✅ Manage system-wide permissions
- ✅ Full access to all features
- ✅ View all users in the system

**Use Case:** System administrators, IT managers, C-level executives

---

### 🟣 Admin / HR Manager
**Total Permissions:** 55+

**Unique Capabilities:**
- ✅ Full employee lifecycle management
- ✅ Complete HR operations (recruitment, payroll, performance)
- ✅ Company-wide reporting and analytics
- ✅ Department and organizational structure management
- ✅ System settings configuration
- ❌ Cannot manage users or assign roles

**Use Case:** HR managers, department heads, senior administrators

---

### 🟢 Manager
**Total Permissions:** 30+

**Scope:** Limited to assigned team members

**Unique Capabilities:**
- ✅ View and manage team members only
- ✅ Approve team leave requests
- ✅ View team performance and reports
- ✅ Create and assign tasks to team
- ✅ Manage team attendance and performance reviews
- ❌ Cannot access employees outside their team
- ❌ Cannot access company-wide HR features
- ❌ Cannot manage payroll or recruitment

**Use Case:** Team leads, project managers, supervisors

---

### 🔵 Employee (User)
**Total Permissions:** 15+

**Scope:** Personal information only

**Capabilities:**
- ✅ View and edit own profile
- ✅ View own attendance, payroll, performance
- ✅ Apply for leave and view leave history
- ✅ View assigned tasks
- ✅ Access training and documents
- ✅ Participate in gamification
- ❌ Cannot access other employees' data
- ❌ Cannot access management or HR features

**Use Case:** Regular employees, individual contributors

---

## Permission Inheritance

```
Super Admin
    ├── Inherits: ALL permissions (60+)
    └── Exclusive: User & Role Management

Admin / HR
    ├── Inherits: Most permissions except user management
    └── Exclusive: Company-wide HR operations

Manager
    ├── Inherits: Team-scoped permissions
    └── Exclusive: Team management, task assignment

Employee
    ├── Inherits: Basic user permissions
    └── Exclusive: Own profile and leave requests
```

## Implementation Notes

1. **Permission Checks**: All permissions are checked at both route and component levels
2. **Team Scope**: Manager permissions are filtered by team assignment (to be implemented in business logic)
3. **Fallback**: Users without permissions are redirected or shown appropriate error messages
4. **Flexibility**: Permissions can be easily modified in `roles.ts` configuration file

## Security Best Practices

1. ✅ Always check permissions on both frontend and backend
2. ✅ Never expose sensitive data to unauthorized users
3. ✅ Log permission-related actions for audit trails
4. ✅ Regularly review and update role permissions
5. ✅ Use principle of least privilege (give minimum necessary access)
6. ✅ Validate user roles on every protected action
