import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiService, Company, Team } from '../services/api';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userType: 'company-admins' | 'team-incharges' | 'telecallers';
  title: string;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userType,
  title
}) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    companyId: '',
    teamId: ''
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      if (userType !== 'company-admins') {
        loadTeams();
      }
    }
  }, [isOpen, userType]);

  useEffect(() => {
    if (formData.companyId && userType === 'telecallers') {
      loadTeams(parseInt(formData.companyId));
    }
  }, [formData.companyId, userType]);

  const loadCompanies = async () => {
    try {
      const data = await apiService.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const loadTeams = async (companyId?: number) => {
    try {
      const data = await apiService.getTeams(companyId);
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        username: formData.username,
        fullName: formData.fullName,
        ...(formData.companyId && { companyId: parseInt(formData.companyId) }),
        ...(formData.teamId && { teamId: parseInt(formData.teamId) })
      };

      const result = await apiService.createUser(payload, userType);
      setSuccess(`User created successfully! Temporary password: ${result.tempPassword}`);
      
      // Reset form
      setFormData({ username: '', fullName: '', companyId: '', teamId: '' });
      
      // Call success callback after a delay
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Failed to create user. Username might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', fullName: '', companyId: '', teamId: '' });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {userType !== 'company-admins' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company {userType === 'telecallers' ? '*' : ''}
              </label>
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={userType === 'telecallers'}
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {userType === 'telecallers' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team *
              </label>
              <select
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!formData.companyId}
              >
                <option value="">Select a team</option>
                {teams
                  .filter(team => !formData.companyId || team.companyId === parseInt(formData.companyId))
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 py-2 px-4 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 py-2 px-4 rounded">
              {success}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;