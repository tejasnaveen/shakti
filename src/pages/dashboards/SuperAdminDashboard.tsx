import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Building, Users, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, User } from '../../services/api';
import UserManagementTable from '../../components/UserManagementTable';
import CreateUserModal from '../../components/CreateUserModal';
import EditUserModal from '../../components/EditUserModal';
import Toast from '../../components/Toast';

const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [companyAdmins, setCompanyAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('company-management');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [availableAdmins, setAvailableAdmins] = useState<User[]>([]);

  useEffect(() => {
    loadCompanyAdmins();
    loadAvailableAdmins();
  }, []);

  const loadCompanyAdmins = async () => {
    try {
      const users = await apiService.getUsersByRole('CompanyAdmin');
      setCompanyAdmins(users);
    } catch (error) {
      setToast({ message: 'Failed to load company admins', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableAdmins = async () => {
    try {
      const users = await apiService.getUsersByRole('CompanyAdmin');
      setAvailableAdmins(users);
    } catch (error) {
      console.error('Failed to load available admins');
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCompany(true);
    
    try {
      await apiService.createCompany(companyName);
      setToast({ message: 'Company created successfully', type: 'success' });
      setCompanyName('');
      setSelectedAdmin('');
      setShowCreateCompanyModal(false);
    } catch (error) {
      setToast({ message: 'Failed to create company', type: 'error' });
    } finally {
      setCreatingCompany(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await apiService.deleteUser(id);
      setToast({ message: 'User deleted successfully', type: 'success' });
      loadCompanyAdmins();
    } catch (error) {
      setToast({ message: 'Failed to delete user', type: 'error' });
    }
  };

  const handleResetPassword = async (id: number) => {
    try {
      const result = await apiService.resetPassword(id);
      setToast({ message: `Password reset! New password: ${result.newPassword}`, type: 'info' });
    } catch (error) {
      setToast({ message: 'Failed to reset password', type: 'error' });
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await apiService.toggleUserStatus(id);
      setToast({ message: 'User status updated successfully', type: 'success' });
      loadCompanyAdmins();
    } catch (error) {
      setToast({ message: 'Failed to update user status', type: 'error' });
    }
  };

  const menuItems = [
    {
      id: 'company-management',
      title: 'Company Management',
      icon: <Building className="w-5 h-5" />,
      description: 'Manage companies and admins'
    },
    {
      id: 'user-management',
      title: 'User Management',
      icon: <Users className="w-5 h-5" />,
      description: 'Manage all system users'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <div className="ml-3 text-left">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeSection === 'company-management' && (
            <div className="space-y-6">
              {/* Company Management Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Building className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Create Company</h3>
                        <p className="text-sm text-gray-600">Add new company to system</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateCompanyModal(true)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create New Company
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Company Admins</h3>
                        <p className="text-sm text-gray-600">Manage company administrators</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Admin
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Building className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Total Companies</h3>
                        <p className="text-sm text-gray-600">Active companies in system</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">3</div>
                </div>
              </div>

              {/* Company Admins Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Company Administrators</h2>
                </div>

                <UserManagementTable
                  users={companyAdmins}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onResetPassword={handleResetPassword}
                  onToggleStatus={handleToggleStatus}
                  loading={loading}
                />
              </div>
            </div>
          )}

          {activeSection === 'user-management' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
              <p className="text-gray-600">User management features will be implemented here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Company Modal */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Create New Company</h3>
              <button
                onClick={() => setShowCreateCompanyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Admin (Optional)
                </label>
                <select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an admin</option>
                  {availableAdmins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.fullName} (@{admin.username})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  You can assign an existing admin or create one later
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateCompanyModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCompany}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {creatingCompany ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCompanyAdmins}
        userType="company-admins"
        title="Create Company Admin"
      />

      <EditUserModal
        isOpen={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSuccess={loadCompanyAdmins}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;