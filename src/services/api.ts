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
    // Mock data for demo purposes
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'john_doe',
        fullName: 'John Doe',
        role: role,
        companyName: role !== 'SuperAdmin' ? 'Acme Corporation' : undefined,
        teamName: role === 'Telecaller' ? 'Sales Team A' : undefined,
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        createdBy: 'Super Administrator'
      },
      {
        id: 2,
        username: 'jane_smith',
        fullName: 'Jane Smith',
        role: role,
        companyName: role !== 'SuperAdmin' ? 'Tech Solutions Inc' : undefined,
        teamName: role === 'Telecaller' ? 'Support Team B' : undefined,
        isActive: false,
        createdAt: '2024-01-20T14:15:00Z',
        createdBy: 'Super Administrator'
      },
      {
        id: 3,
        username: 'mike_wilson',
        fullName: 'Mike Wilson',
        role: role,
        companyName: role !== 'SuperAdmin' ? 'Global Enterprises' : undefined,
        teamName: role === 'Telecaller' ? 'Recovery Team C' : undefined,
        isActive: true,
        createdAt: '2024-02-01T09:45:00Z',
        createdBy: 'Company Administrator'
      }
    ];

    return new Promise(resolve => {
      setTimeout(() => resolve(mockUsers), 500); // Simulate API delay
    });
  }

  async createUser(data: {
    username: string;
    fullName: string;
    companyId?: number;
    teamId?: number;
  }, userType: 'company-admins' | 'team-incharges' | 'telecallers'): Promise<{ tempPassword: string }> {
    // Mock user creation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ tempPassword: 'temp123' });
      }, 1000);
    });
  }

  async updateUser(id: number, data: {
    username: string;
    fullName: string;
    companyId?: number;
    teamId?: number;
  }): Promise<void> {
    // Mock update
    return new Promise(resolve => {
      setTimeout(() => resolve(), 500);
    });
  }

  async deleteUser(id: number): Promise<void> {
    // Mock delete
    return new Promise(resolve => {
      setTimeout(() => resolve(), 500);
    });
  }

  async resetPassword(id: number): Promise<{ newPassword: string }> {
    // Mock password reset
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ newPassword: 'newPass123' });
      }, 500);
    });
  }

  async toggleUserStatus(id: number): Promise<void> {
    // Mock status toggle
    return new Promise(resolve => {
      setTimeout(() => resolve(), 500);
    });
  }

  async getCompanies(): Promise<Company[]> {
    // Mock companies data
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Acme Corporation',
        createdBy: 'Super Administrator',
        createdAt: '2024-01-10T08:00:00Z'
      },
      {
        id: 2,
        name: 'Tech Solutions Inc',
        createdBy: 'Super Administrator',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 3,
        name: 'Global Enterprises',
        createdBy: 'Super Administrator',
        createdAt: '2024-01-20T14:15:00Z'
      }
    ];

    return new Promise(resolve => {
      setTimeout(() => resolve(mockCompanies), 300);
    });
  }

  async getTeams(companyId?: number): Promise<Team[]> {
    // Mock teams data
    const mockTeams: Team[] = [
      {
        id: 1,
        name: 'Sales Team A',
        companyName: 'Acme Corporation',
        companyId: 1,
        createdBy: 'Company Administrator',
        createdAt: '2024-01-12T09:00:00Z'
      },
      {
        id: 2,
        name: 'Support Team B',
        companyName: 'Tech Solutions Inc',
        companyId: 2,
        createdBy: 'Company Administrator',
        createdAt: '2024-01-18T11:30:00Z'
      },
      {
        id: 3,
        name: 'Recovery Team C',
        companyName: 'Global Enterprises',
        companyId: 3,
        createdBy: 'Company Administrator',
        createdAt: '2024-01-25T16:45:00Z'
      }
    ];

    const filteredTeams = companyId 
      ? mockTeams.filter(team => team.companyId === companyId)
      : mockTeams;

    return new Promise(resolve => {
      setTimeout(() => resolve(filteredTeams), 300);
    });
  }

  async createCompany(name: string): Promise<void> {
    // Mock company creation
    return new Promise(resolve => {
      setTimeout(() => resolve(), 800);
    });
  }

  async createTeam(name: string, companyId: number): Promise<void> {
    // Mock team creation
    return new Promise(resolve => {
      setTimeout(() => resolve(), 800);
    });
  }
}

export const apiService = new ApiService();
export type { LoginRequest, LoginResponse, User, Company, Team };