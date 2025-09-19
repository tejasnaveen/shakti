import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Building } from 'lucide-react';
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

  useEffect(() => {
    loadCompanyAdmins();
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

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCompany(true);
    
    try {
      await apiService.createCompany(companyName);
      setToast({ message: 'Company created successfully', type: 'success' });
      setCompanyName('');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Company Management</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateCompanyModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Building className="w-4 h-4 mr-2" />
                Create Company
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Company Admin
              </button>
            </div>
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

      {/* Create Company Modal */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Create Company</h3>
              <button
                onClick={() => setShowCreateCompanyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCompany} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
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