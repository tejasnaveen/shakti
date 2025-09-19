using LoanRecoveryCRM.Models;

namespace LoanRecoveryCRM.Services
{
    public interface IAuthService
    {
        Task<(bool success, string token, User? user)> LoginAsync(string username, string password, string role);
        string GenerateJwtToken(User user);
        Task<User?> GetCurrentUserAsync(string username);
    }
}