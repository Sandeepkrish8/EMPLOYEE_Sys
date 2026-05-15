/**
 * EXAMPLE: How to use RBAC in a page component
 * 
 * This file demonstrates various ways to implement role-based
 * access control in your page components.
 */

import { usePermissions } from "../components/ProtectedRoute";
import { Can, Cannot } from "../components/Can";
import { Permission } from "../config/roles";

export function ExampleRBACPage() {
  // Use the hook to get permission checking functions
  const { 
    hasPermission, 
    hasAnyPermission,
    isAdmin, 
    isHR, 
    isEmployee,
    role 
  } = usePermissions();

  // Check permissions programmatically
  const canEditEmployees = hasPermission(Permission.EDIT_EMPLOYEES);
  const canDeleteEmployees = hasPermission(Permission.DELETE_EMPLOYEES);
  const canManagePayroll = hasPermission(Permission.MANAGE_PAYROLL);

  // Check if user has any of multiple permissions
  const canAccessHRFeatures = hasAnyPermission([
    Permission.VIEW_EMPLOYEES,
    Permission.MANAGE_RECRUITMENT,
    Permission.VIEW_REPORTS
  ]);

  const handleEdit = () => {
    // Always check permission before performing action
    if (!canEditEmployees) {
      alert("You don't have permission to edit employees");
      return;
    }
    // Perform edit action
    console.log("Editing employee...");
  };

  const handleDelete = () => {
    if (!canDeleteEmployees) {
      alert("You don't have permission to delete employees");
      return;
    }
    // Perform delete action
    console.log("Deleting employee...");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">RBAC Example Page</h1>

      {/* Example 1: Using role checks */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Role-Based Rendering</h2>
        
        {isAdmin && (
          <div className="p-4 bg-purple-50 rounded-lg mb-2">
            <p className="font-semibold text-purple-900">Admin View</p>
            <p className="text-purple-700">You have full access to all features</p>
          </div>
        )}

        {isHR && (
          <div className="p-4 bg-green-50 rounded-lg mb-2">
            <p className="font-semibold text-green-900">HR Manager View</p>
            <p className="text-green-700">You can manage employees and HR operations</p>
          </div>
        )}

        {isEmployee && (
          <div className="p-4 bg-blue-50 rounded-lg mb-2">
            <p className="font-semibold text-blue-900">Employee View</p>
            <p className="text-blue-700">You can view your own information</p>
          </div>
        )}

        <p className="text-sm text-gray-600 mt-2">Current role: {role}</p>
      </section>

      {/* Example 2: Using Can component */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Permission-Based Rendering (Can Component)</h2>
        
        <div className="space-y-2">
          {/* Show button only if user has permission */}
          <Can perform={Permission.EDIT_EMPLOYEES}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Edit Employee
            </button>
          </Can>

          {/* Show with fallback content */}
          <Can 
            perform={Permission.DELETE_EMPLOYEES}
            fallback={
              <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
                Delete (No Permission)
              </button>
            }
          >
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Delete Employee
            </button>
          </Can>

          {/* Show if user has ANY of the specified permissions */}
          <Can performAny={[Permission.VIEW_EMPLOYEES, Permission.EDIT_EMPLOYEES]}>
            <div className="p-4 bg-yellow-50 rounded">
              <p className="text-yellow-900">You have access to employee management features</p>
            </div>
          </Can>

          {/* Show if user has ALL specified permissions */}
          <Can performAll={[Permission.EDIT_EMPLOYEES, Permission.DELETE_EMPLOYEES]}>
            <div className="p-4 bg-orange-50 rounded">
              <p className="text-orange-900">You have full employee management permissions</p>
            </div>
          </Can>
        </div>
      </section>

      {/* Example 3: Using Cannot component */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Inverse Permission Check (Cannot Component)</h2>
        
        <Cannot perform={Permission.MANAGE_SETTINGS}>
          <div className="p-4 bg-red-50 rounded border border-red-200">
            <p className="text-red-900 font-semibold">Restricted Access</p>
            <p className="text-red-700">
              You don't have permission to manage settings. Please contact your administrator.
            </p>
          </div>
        </Cannot>

        <Cannot performAny={[Permission.VIEW_EMPLOYEES, Permission.MANAGE_RECRUITMENT]}>
          <div className="p-4 bg-gray-50 rounded mt-2">
            <p className="text-gray-700">
              HR features are not available for your role.
            </p>
          </div>
        </Cannot>
      </section>

      {/* Example 4: Conditional logic in event handlers */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Permission Checks in Functions</h2>
        
        <div className="space-x-2">
          <button 
            onClick={handleEdit}
            className={`px-4 py-2 rounded ${
              canEditEmployees 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Edit (Check Inside Handler)
          </button>

          <button 
            onClick={handleDelete}
            className={`px-4 py-2 rounded ${
              canDeleteEmployees 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Delete (Check Inside Handler)
          </button>
        </div>
      </section>

      {/* Example 5: Complex permission logic */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Complex Permission Logic</h2>
        
        {canAccessHRFeatures ? (
          <div className="p-4 bg-green-50 rounded">
            <p className="text-green-900 font-semibold">HR Features Available</p>
            <ul className="mt-2 space-y-1 text-green-700">
              {hasPermission(Permission.VIEW_EMPLOYEES) && (
                <li>✓ View Employees</li>
              )}
              {hasPermission(Permission.MANAGE_RECRUITMENT) && (
                <li>✓ Manage Recruitment</li>
              )}
              {hasPermission(Permission.VIEW_REPORTS) && (
                <li>✓ View Reports</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-700">
              You don't have access to HR features.
            </p>
          </div>
        )}
      </section>

      {/* Example 6: Dynamic UI based on multiple permissions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Dynamic UI Example</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Employee card with dynamic actions */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">John Doe</h3>
            <p className="text-sm text-gray-600 mb-3">Software Engineer</p>
            
            <div className="flex gap-2">
              {/* View button - available to all who can see employees */}
              <Can performAny={[Permission.VIEW_EMPLOYEES, Permission.VIEW_OWN_PROFILE]}>
                <button className="text-blue-500 hover:text-blue-700 text-sm">
                  View
                </button>
              </Can>

              {/* Edit button - only for HR and Admin */}
              <Can perform={Permission.EDIT_EMPLOYEES}>
                <button className="text-yellow-500 hover:text-yellow-700 text-sm">
                  Edit
                </button>
              </Can>

              {/* Delete button - only for Admin usually */}
              <Can perform={Permission.DELETE_EMPLOYEES}>
                <button className="text-red-500 hover:text-red-700 text-sm">
                  Delete
                </button>
              </Can>
            </div>
          </div>
        </div>
      </section>

      {/* Example 7: Payroll access example */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Conditional Content (Payroll Example)</h2>
        
        <Can performAny={[Permission.VIEW_PAYROLL, Permission.VIEW_OWN_PAYROLL]}>
          <div className="p-4 border rounded-lg">
            {hasPermission(Permission.VIEW_PAYROLL) ? (
              <>
                <h3 className="font-semibold mb-2">All Employee Payroll</h3>
                <p className="text-sm text-gray-600">
                  You can view payroll for all employees (HR/Admin view)
                </p>
                {/* Show all payroll data */}
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-2">My Payroll</h3>
                <p className="text-sm text-gray-600">
                  You can only view your own payroll information
                </p>
                {/* Show only own payroll */}
              </>
            )}
          </div>
        </Can>
      </section>
    </div>
  );
}

/**
 * Key Takeaways:
 * 
 * 1. Use usePermissions() hook for programmatic checks
 * 2. Use <Can> component for declarative UI rendering
 * 3. Use <Cannot> component for inverse checks
 * 4. Always validate permissions before performing actions
 * 5. Provide appropriate fallback UI for restricted features
 * 6. Consider using both role and permission checks for complex scenarios
 * 7. Remember: Frontend checks are for UX only - always validate on backend!
 */
