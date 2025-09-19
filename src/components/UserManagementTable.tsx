import React, { useState } from 'react';
import { Edit, Trash2, RefreshCw, Power, PowerOff } from 'lucide-react';
import { User } from '../services/api';

interface UserManagementTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onResetPassword: (id: number) => void;
  onToggleStatus: (id: number) => void;
  loading?: boolean;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  loading = false
}) => {
  const [loadingAction, setLoadingAction] = useState<{ action: string; userId: number } | null>(null);

  const handleAction = async (action: string, userId: number, callback: () => Promise<void>) => {
    setLoadingAction({ action, userId });
    try {
      await callback();
    } finally {
      setLoadingAction(null);
    }
  };

  const isActionLoading = (action: string, userId: number) => {
    return loadingAction?.action === action && loadingAction?.userId === userId;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company/Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {user.companyName && (
                      <div className="text-sm text-gray-900">{user.companyName}</div>
                    )}
                    {user.teamName && (
                      <div className="text-sm text-gray-500">{user.teamName}</div>
                    )}
                    {!user.companyName && !user.teamName && (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  {user.createdBy && (
                    <div className="text-sm text-gray-500">by {user.createdBy}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleAction('reset', user.id, () => onResetPassword(user.id))}
                      disabled={isActionLoading('reset', user.id)}
                      className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 disabled:opacity-50"
                      title="Reset password"
                    >
                      {isActionLoading('reset', user.id) ? (
                        <div className="animate-spin w-4 h-4 border border-orange-600 border-t-transparent rounded-full"></div>
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleAction('toggle', user.id, () => onToggleStatus(user.id))}
                      disabled={isActionLoading('toggle', user.id)}
                      className={`p-1 rounded disabled:opacity-50 ${
                        user.isActive 
                          ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                          : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                      }`}
                      title={user.isActive ? 'Deactivate user' : 'Activate user'}
                    >
                      {isActionLoading('toggle', user.id) ? (
                        <div className="animate-spin w-4 h-4 border border-current border-t-transparent rounded-full"></div>
                      ) : user.isActive ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleAction('delete', user.id, () => onDelete(user.id))}
                      disabled={isActionLoading('delete', user.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                      title="Delete user"
                    >
                      {isActionLoading('delete', user.id) ? (
                        <div className="animate-spin w-4 h-4 border border-red-600 border-t-transparent rounded-full"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;