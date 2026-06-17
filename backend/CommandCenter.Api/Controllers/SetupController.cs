using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CommandCenter.Api.Data;
using CommandCenter.Api.Models;

namespace CommandCenter.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public SetupController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpPost("create-default-user")]
    public async Task<IActionResult> CreateDefaultUser()
    {
        var defaultUser = new User
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
        
        if (!await _context.Users.AnyAsync(u => u.Username == "admin"))
        {
            _context.Users.Add(defaultUser);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Default user created", username = "admin", password = "admin123" });
        }
        
        return Ok(new { message = "Default user already exists" });
    }
}
