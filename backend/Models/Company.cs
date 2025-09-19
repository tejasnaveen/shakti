namespace LoanRecoveryCRM.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CreatedByUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual User CreatedByUser { get; set; } = null!;
        public virtual ICollection<Team> Teams { get; set; } = new List<Team>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}