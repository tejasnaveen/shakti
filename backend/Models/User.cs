namespace LoanRecoveryCRM.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public int? CompanyId { get; set; }
        public int? TeamId { get; set; }
        public int? CreatedByUserId { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual Role Role { get; set; } = null!;
        public virtual Company? Company { get; set; }
        public virtual Team? Team { get; set; }
        public virtual User? CreatedByUser { get; set; }
        public virtual ICollection<User> CreatedUsers { get; set; } = new List<User>();
        public virtual ICollection<Company> CreatedCompanies { get; set; } = new List<Company>();
        public virtual ICollection<Team> CreatedTeams { get; set; } = new List<Team>();
    }
}