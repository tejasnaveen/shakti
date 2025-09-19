using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using LoanRecoveryCRM.Data;
using LoanRecoveryCRM.Models;

namespace LoanRecoveryCRM.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(ApplicationDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<IEnumerable<User>> GetUsersByRoleAsync(string role, int? createdByUserId = null)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Company)
                .Include(u => u.Team)
                .Include(u => u.CreatedByUser)
                .Where(u => u.Role.Name == role);

            if (createdByUserId.HasValue)
            {
                query = query.Where(u => u.CreatedByUserId == createdByUserId);
            }

            return await query.OrderByDescending(u => u.CreatedAt).ToListAsync();
        }

        public async Task<User?> CreateUserAsync(string username, string fullName, string roleName, int createdByUserId, int? companyId = null, int? teamId = null)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
            if (role == null) return null;

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == username))
                return null;

            var user = new User
            {
                Username = username,
                FullName = fullName,
                RoleId = role.Id,
                CompanyId = companyId,
                TeamId = teamId,
                CreatedByUserId = createdByUserId,
                IsActive = true
            };

            // Generate temporary password
            var tempPassword = GenerateRandomPassword();
            user.PasswordHash = _passwordHasher.HashPassword(user, tempPassword);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // In a real application, you would send this password via email
            // For now, we'll return it (this is not secure for production)
            user.PasswordHash = tempPassword; // Temporarily store plain password for demo

            return user;
        }

        public async Task<User?> UpdateUserAsync(int id, string fullName, string username, int? companyId = null, int? teamId = null)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            // Check if new username already exists (excluding current user)
            if (await _context.Users.AnyAsync(u => u.Username == username && u.Id != id))
                return null;

            user.FullName = fullName;
            user.Username = username;
            user.CompanyId = companyId;
            user.TeamId = teamId;

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> ResetPasswordAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return string.Empty;

            var newPassword = GenerateRandomPassword();
            user.PasswordHash = _passwordHasher.HashPassword(user, newPassword);

            await _context.SaveChangesAsync();
            return newPassword;
        }

        public async Task<bool> ToggleUserStatusAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Company>> GetCompaniesAsync()
        {
            return await _context.Companies
                .Include(c => c.CreatedByUser)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Team>> GetTeamsAsync(int? companyId = null)
        {
            var query = _context.Teams
                .Include(t => t.Company)
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            if (companyId.HasValue)
                query = query.Where(t => t.CompanyId == companyId);

            return await query.OrderBy(t => t.Name).ToListAsync();
        }

        public async Task<Company?> CreateCompanyAsync(string name, int createdByUserId)
        {
            var company = new Company
            {
                Name = name,
                CreatedByUserId = createdByUserId
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<Team?> CreateTeamAsync(string name, int companyId, int createdByUserId)
        {
            var team = new Team
            {
                Name = name,
                CompanyId = companyId,
                CreatedByUserId = createdByUserId
            };

            _context.Teams.Add(team);
            await _context.SaveChangesAsync();
            return team;
        }

        private static string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}