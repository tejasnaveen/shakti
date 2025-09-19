using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LoanRecoveryCRM.Data;
using LoanRecoveryCRM.Models;
using Microsoft.AspNetCore.Identity;

namespace LoanRecoveryCRM.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
        }

        public async Task<(bool success, string token, User? user)> LoginAsync(string username, string password, string role)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Company)
                .Include(u => u.Team)
                .FirstOrDefaultAsync(u => u.Username == username && u.IsActive);

            if (user == null || user.Role.Name != role)
            {
                return (false, string.Empty, null);
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
            {
                return (false, string.Empty, null);
            }

            var token = GenerateJwtToken(user);
            return (true, token, user);
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.Name),
                    new Claim("FullName", user.FullName)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<User?> GetCurrentUserAsync(string username)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Company)
                .Include(u => u.Team)
                .FirstOrDefaultAsync(u => u.Username == username);
        }
    }
}