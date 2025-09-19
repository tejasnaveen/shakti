using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using LoanRecoveryCRM.Services;

namespace LoanRecoveryCRM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("role/{role}")]
        public async Task<IActionResult> GetUsersByRole(string role)
        {
            var users = await _userService.GetUsersByRoleAsync(role);
            return Ok(users.Select(u => new
            {
                id = u.Id,
                username = u.Username,
                fullName = u.FullName,
                role = u.Role.Name,
                companyName = u.Company?.Name,
                teamName = u.Team?.Name,
                isActive = u.IsActive,
                createdAt = u.CreatedAt,
                createdBy = u.CreatedByUser?.FullName
            }));
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _userService.UpdateUserAsync(id, request.FullName, request.Username, request.CompanyId, request.TeamId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found or username already exists" });
            }

            return Ok(new { message = "User updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPost("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id)
        {
            var newPassword = await _userService.ResetPasswordAsync(id);
            if (string.IsNullOrEmpty(newPassword))
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { newPassword, message = "Password reset successfully" });
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var success = await _userService.ToggleUserStatusAsync(id);
            if (!success)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { message = "User status updated successfully" });
        }

        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _userService.GetCompaniesAsync();
            return Ok(companies.Select(c => new
            {
                id = c.Id,
                name = c.Name,
                createdBy = c.CreatedByUser.FullName,
                createdAt = c.CreatedAt
            }));
        }

        [HttpGet("teams")]
        public async Task<IActionResult> GetTeams(int? companyId = null)
        {
            var teams = await _userService.GetTeamsAsync(companyId);
            return Ok(teams.Select(t => new
            {
                id = t.Id,
                name = t.Name,
                companyName = t.Company.Name,
                companyId = t.CompanyId,
                createdBy = t.CreatedByUser.FullName,
                createdAt = t.CreatedAt
            }));
        }

        [HttpPost("companies")]
        [Authorize(Policy = "SuperAdmin")]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var company = await _userService.CreateCompanyAsync(request.Name, userId);

            if (company == null)
            {
                return BadRequest(new { message = "Failed to create company" });
            }

            return Ok(new { message = "Company created successfully", companyId = company.Id });
        }

        [HttpPost("teams")]
        [Authorize(Policy = "CompanyAdmin")]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var team = await _userService.CreateTeamAsync(request.Name, request.CompanyId, userId);

            if (team == null)
            {
                return BadRequest(new { message = "Failed to create team" });
            }

            return Ok(new { message = "Team created successfully", teamId = team.Id });
        }

        [HttpPost("company-admins")]
        [Authorize(Policy = "SuperAdmin")]
        public async Task<IActionResult> CreateCompanyAdmin([FromBody] CreateUserRequest request)
        {
            var createdByUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _userService.CreateUserAsync(request.Username, request.FullName, "CompanyAdmin", createdByUserId, request.CompanyId);

            if (user == null)
            {
                return BadRequest(new { message = "Failed to create company admin or username already exists" });
            }

            return Ok(new { message = "Company Admin created successfully", tempPassword = user.PasswordHash });
        }

        [HttpPost("team-incharges")]
        [Authorize(Policy = "CompanyAdmin")]
        public async Task<IActionResult> CreateTeamIncharge([FromBody] CreateUserRequest request)
        {
            var createdByUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _userService.CreateUserAsync(request.Username, request.FullName, "TeamIncharge", createdByUserId, request.CompanyId, request.TeamId);

            if (user == null)
            {
                return BadRequest(new { message = "Failed to create team incharge or username already exists" });
            }

            return Ok(new { message = "Team Incharge created successfully", tempPassword = user.PasswordHash });
        }

        [HttpPost("telecallers")]
        [Authorize(Policy = "TeamIncharge")]
        public async Task<IActionResult> CreateTelecaller([FromBody] CreateUserRequest request)
        {
            var createdByUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _userService.CreateUserAsync(request.Username, request.FullName, "Telecaller", createdByUserId, request.CompanyId, request.TeamId);

            if (user == null)
            {
                return BadRequest(new { message = "Failed to create telecaller or username already exists" });
            }

            return Ok(new { message = "Telecaller created successfully", tempPassword = user.PasswordHash });
        }
    }

    public class UpdateUserRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public int? CompanyId { get; set; }
        public int? TeamId { get; set; }
    }

    public class CreateUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public int? CompanyId { get; set; }
        public int? TeamId { get; set; }
    }

    public class CreateCompanyRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    public class CreateTeamRequest
    {
        public string Name { get; set; } = string.Empty;
        public int CompanyId { get; set; }
    }
}