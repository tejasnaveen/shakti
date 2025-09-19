const API_BASE_URL = 'https://localhost:5001/api';

interface LoginRequest {
  username: string;
  password: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    role: string;
    companyId?: number;
    teamId?: number;
  };
}

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  companyName?: string;
  teamName?: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}

interface Company {
  id: number;
  name: string;
  createdBy: string;
  createdAt: string;
}

interface Team {
  id: number;
  name: string;
  companyName: string;
  companyId: number;
  createdBy: string;
  createdAt: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/role/${role}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async createUser(data: {
    username: string;
    fullName: string;
    companyId?: number;
    teamId?: number;
  }, userType: 'company-admins' | 'team-incharges' | 'telecallers'): Promise<{ tempPassword: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${userType}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  async updateUser(id: number, data: {
    username: string;
    fullName: string;
    companyId?: number;
    teamId?: number;
  }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }

  async resetPassword(id: number): Promise<{ newPassword: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to reset password');
    }

    return response.json();
  }

  async toggleUserStatus(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to toggle user status');
    }
  }

  async getCompanies(): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/users/companies`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }

    return response.json();
  }

  async getTeams(companyId?: number): Promise<Team[]> {
    const url = companyId 
      ? `${API_BASE_URL}/users/teams?companyId=${companyId}`
      : `${API_BASE_URL}/users/teams`;
      
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }

    return response.json();
  }

  async createCompany(name: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/companies`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error('Failed to create company');
    }
  }

  async createTeam(name: string, companyId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/teams`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, companyId })
    });

    if (!response.ok) {
      throw new Error('Failed to create team');
    }
  }
}

export const apiService = new ApiService();
export type { LoginRequest, LoginResponse, User, Company, Team };