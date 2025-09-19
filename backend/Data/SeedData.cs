using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using LoanRecoveryCRM.Models;

namespace LoanRecoveryCRM.Data
{
    public static class SeedData
    {
        public static async Task Initialize(ApplicationDbContext context, IPasswordHasher<User> passwordHasher)
        {
            await context.Database.EnsureCreatedAsync();

            // Seed roles
            if (!await context.Roles.AnyAsync())
            {
                var roles = new[]
                {
                    new Role { Name = "SuperAdmin" },
                    new Role { Name = "CompanyAdmin" },
                    new Role { Name = "TeamIncharge" },
                    new Role { Name = "Telecaller" }
                };

                context.Roles.AddRange(roles);
                await context.SaveChangesAsync();
            }

            // Seed SuperAdmin user
            if (!await context.Users.AnyAsync(u => u.Username == "yanavi infotech"))
            {
                var superAdminRole = await context.Roles.FirstAsync(r => r.Name == "SuperAdmin");
                var superAdmin = new User
                {
                    Username = "yanavi infotech",
                    FullName = "Super Administrator",
                    RoleId = superAdminRole.Id,
                    IsActive = true
                };

                superAdmin.PasswordHash = passwordHasher.HashPassword(superAdmin, "Arqpn2492n");
                
                context.Users.Add(superAdmin);
                await context.SaveChangesAsync();
            }
        }
    }
}