using Microsoft.EntityFrameworkCore;
using CommandCenter.Api.Data;
using CommandCenter.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register AI Service HTTP client
builder.Services.AddHttpClient<AIServiceClient>();

// ============================================
// DATABASE CONNECTION STRING - FIXED
// ============================================
// Try multiple sources for connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// If not found in appsettings, try environment variable
if (string.IsNullOrEmpty(connectionString))
{
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
}

// If still empty, log error and exit
if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("❌ ERROR: Database connection string is missing!");
    Console.WriteLine("Please set DATABASE_URL or ConnectionStrings__DefaultConnection in Railway variables.");
    throw new Exception("Database connection string is required");
}

Console.WriteLine($"✅ Database connection string found! (starts with: {connectionString.Substring(0, Math.Min(30, connectionString.Length))}...)");

// Add Database Context with the connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "your-super-secret-key-32-chars-minimum"))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<AuthService>();

// CORS with specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(
            "https://renewed-growth-production-9650.up.railway.app",  // Frontend
            "https://command-center-production-f0a9.up.railway.app",  // Backend
            "https://carefree-hope-production-9085.up.railway.app",   // AI Service
            "http://localhost:3000",
            "http://localhost:5000"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Swagger in development only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS redirection (Railway handles SSL)
app.UseHttpsRedirection();

// CORS
app.UseCors("AllowSpecificOrigins");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Root endpoint
app.MapGet("/", () => new { 
    message = "Command Center API is running!",
    timestamp = DateTime.UtcNow,
    version = Environment.Version.ToString(),
    database = "PostgreSQL Connected",
    environment = app.Environment.EnvironmentName
});

// Health check endpoint
app.MapGet("/api/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    service = "Command Center API",
    database = "PostgreSQL Connected"
});

// Create database on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
    Console.WriteLine("✅ Database ensured created!");
}

app.Run();