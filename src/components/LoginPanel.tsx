import React, { useState } from 'react';
import { User, Building, Users, Phone } from 'lucide-react';

interface LoginPanelProps {
  role: string;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  onLogin: (username: string, password: string, role: string) => Promise<void>;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ role, title, icon, colorClass, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(username, password, role);
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 border-t-4 ${colorClass} transform hover:scale-105 transition-all duration-300`}>
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colorClass.replace('border-', 'bg-').replace('-500', '-100')}`}>
          <div className={`${colorClass.replace('border-', 'text-')}`}>
            {icon}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor={`${role}-username`} className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id={`${role}-username`}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label htmlFor={`${role}-password`} className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id={`${role}-password`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : `${colorClass.replace('border-', 'bg-')} hover:opacity-90`
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {role === 'SuperAdmin' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            Demo credentials:<br />
            Username: yanavi infotech<br />
            Password: Arqpn2492n
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPanel;