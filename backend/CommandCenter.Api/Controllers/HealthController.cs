using Microsoft.AspNetCore.Mvc;

namespace CommandCenter.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { 
            status = "healthy", 
            timestamp = DateTime.UtcNow,
            service = "Command Center API",
            version = "1.0.0",
            database = "PostgreSQL Connected"
        });
    }
    
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok(new { message = "pong", timestamp = DateTime.UtcNow });
    }
    
    [HttpGet("info")]
    public IActionResult Info()
    {
        return Ok(new
        {
            name = "Command Center Data Analytics Platform",
            version = "1.0.0",
            dotnetVersion = Environment.Version.ToString(),
            database = "PostgreSQL",
            timestamp = DateTime.UtcNow
        });
    }
}
