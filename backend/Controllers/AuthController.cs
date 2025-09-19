using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using LoanRecoveryCRM.Services;

namespace LoanRecoveryCRM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (success, token, user) = await _authService.LoginAsync(request.Username, request.Password, request.Role);

            if (!success)
            {
                return Unauthorized(new { message = "Invalid credentials or role" });
            }

            return Ok(new
            {
                token,
                user = new
                {
                    id = user!.Id,
                    username = user.Username,
                    fullName = user.FullName,
                    role = user.Role.Name,
                    companyId = user.CompanyId,
                    teamId = user.TeamId
                }
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var user = await _authService.GetCurrentUserAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                fullName = user.FullName,
                role = user.Role.Name,
                companyId = user.CompanyId,
                teamId = user.TeamId,
                isActive = user.IsActive
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}