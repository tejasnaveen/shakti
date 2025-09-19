using LoanRecoveryCRM.Models;

namespace LoanRecoveryCRM.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersByRoleAsync(string role, int? createdByUserId = null);
        Task<User?> CreateUserAsync(string username, string fullName, string roleName, int createdByUserId, int? companyId = null, int? teamId = null);
        Task<User?> UpdateUserAsync(int id, string fullName, string username, int? companyId = null, int? teamId = null);
        Task<bool> DeleteUserAsync(int id);
        Task<string> ResetPasswordAsync(int id);
        Task<bool> ToggleUserStatusAsync(int id);
        Task<IEnumerable<Company>> GetCompaniesAsync();
        Task<IEnumerable<Team>> GetTeamsAsync(int? companyId = null);
        Task<Company?> CreateCompanyAsync(string name, int createdByUserId);
        Task<Team?> CreateTeamAsync(string name, int companyId, int createdByUserId);
    }
}