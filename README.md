# Shakti - Loan Recovery CRM System

A comprehensive Customer Relationship Management system for loan recovery operations with role-based access control.

## Features

- **Multi-Role Authentication System**
  - Super Admin - Full system access
  - Company Admin - Company and team management
  - Team Incharge - Team member management  
  - Telecaller - Call activities dashboard

- **User Management**
  - Create, edit, delete users
  - Reset passwords
  - Activate/deactivate accounts
  - Role-based permissions

- **Responsive Design**
  - Mobile-first approach
  - Professional UI with Tailwind CSS
  - Interactive components with smooth animations

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **ASP.NET Core 6** Web API
- **Entity Framework Core** with MySQL
- **JWT Authentication**
- **Role-based Authorization**
- **Password Hashing** with ASP.NET Core Identity

### Database
- **MySQL** with Pomelo EF Core provider
- Proper relational schema with foreign keys
- Automatic seeding of roles and super admin

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- .NET 6 SDK
- MySQL Server

### Database Setup

1. Install MySQL Server and create a database:
```sql
CREATE DATABASE LoanRecoveryCRM;
```

2. Update the connection string in `backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LoanRecoveryCRM;Uid=root;Pwd=your_password;"
  }
}
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Default Credentials

**Super Admin Account (Pre-seeded)**
- Username: `yanavi infotech`
- Password: `Arqpn2492n`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### User Management
- `GET /api/users/role/{role}` - Get users by role
- `PATCH /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `POST /api/users/{id}/reset-password` - Reset password
- `PATCH /api/users/{id}/status` - Toggle user status

### Role-Specific Creation
- `POST /api/users/company-admins` - Create company admin (Super Admin only)
- `POST /api/users/team-incharges` - Create team incharge (Company Admin)
- `POST /api/users/telecallers` - Create telecaller (Team Incharge)

### Organization Management
- `GET /api/users/companies` - Get all companies
- `POST /api/users/companies` - Create company (Super Admin only)
- `GET /api/users/teams` - Get all teams
- `POST /api/users/teams` - Create team (Company Admin)

## User Roles & Permissions

### Super Admin
- Create companies and company admins
- Full access to all system functions
- Manage all users across all companies

### Company Admin  
- Create teams and team incharges within their company
- Manage team incharges
- View company-specific data

### Team Incharge
- Create and manage telecallers within their team
- View team-specific data and performance

### Telecaller
- Access personal dashboard
- View assigned contacts and call activities
- Update call logs and customer interactions

## Development

### Project Structure
```
loan-recovery-crm/
├── backend/                 # ASP.NET Core Web API
│   ├── Controllers/        # API controllers
│   ├── Data/              # EF Core DbContext and seeding
│   ├── Models/            # Entity models
│   └── Services/          # Business logic services
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── pages/            # Page components
│   └── services/         # API service layer
└── README.md
```

### Environment Variables

Backend (`backend/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LoanRecoveryCRM;Uid=root;Pwd=password;"
  },
  "Jwt": {
    "Key": "YourSecretKeyHere",
    "Issuer": "LoanRecoveryCRM", 
    "Audience": "LoanRecoveryCRM"
  }
}
```

## Security Features

- JWT token-based authentication
- Role-based authorization policies
- Password hashing using ASP.NET Core Identity
- CORS configuration for frontend-backend communication
- SQL injection protection via EF Core
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.