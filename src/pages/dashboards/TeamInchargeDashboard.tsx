import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, User } from '../../services/api';
import UserManagementTable from '../../components/UserManagementTable';
import CreateUserModal from '../../components/CreateUserModal';
import EditUserModal from '../../components/EditUserModal';
import Toast from '../../components/Toast';

const TeamInchargeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [telecallers, setTelecallers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadTelecallers();
  }, []);

  const loadTelecallers = async () => {
    try {
      const users = await apiService.getUsersByRole('Telecaller');
      setTelecallers(users);
    } catch (error) {
      setToast({ message: 'Failed to load telecallers', type: 'error' });
    } finally {
      setLoading(false);
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
      loadTelecallers();
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
      loadTelecallers();
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
              <h1 className="text-3xl font-bold text-gray-900">Team Incharge Dashboard</h1>
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
            <h2 className="text-xl font-semibold text-gray-900">Telecaller Management</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Telecaller
            </button>
          </div>

          <UserManagementTable
            users={telecallers}
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
        onSuccess={loadTelecallers}
        userType="telecallers"
        title="Create Telecaller"
      />

      <EditUserModal
        isOpen={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSuccess={loadTelecallers}
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

export default TeamInchargeDashboard;