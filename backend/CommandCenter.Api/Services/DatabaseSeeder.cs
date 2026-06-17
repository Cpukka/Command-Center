using CommandCenter.Api.Models;
using CommandCenter.Api.Data;  // ADD THIS LINE
using Microsoft.EntityFrameworkCore;

namespace CommandCenter.Api.Services;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;

    public DatabaseSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        if (!await _context.Users.AnyAsync(u => u.Username == "admin"))
        {
            var admin = new User
            {
                Email = "admin@commandcenter.com",
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                FirstName = "Admin",
                LastName = "User",
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.Users.Add(admin);
            await _context.SaveChangesAsync();
            
            Console.WriteLine("✅ Admin user created. Username: admin, Password: admin123");
        }
    }
}
