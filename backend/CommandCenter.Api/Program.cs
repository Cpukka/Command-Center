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
// DATABASE CONNECTION STRING - MANUAL FORMAT
// ============================================
// Use the manual format that Npgsql definitely supports
var connectionString = "Host=ep-sparkling-feather-at996fiz-pooler.c-9.us-east-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_GYQHqpc3EvT9;SslMode=Require";

// Verify the connection string is valid
if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("❌ ERROR: Database connection string is empty!");
    throw new Exception("Database connection string is required");
}

Console.WriteLine($"✅ Using database connection string: Host={connectionString.Split(';')[0].Replace("Host=", "")}...");

// Add Database Context
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
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "CommandCenter_SuperSecret_JWT_2024_32char"))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<AuthService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(
            "https://renewed-growth-production-9650.up.railway.app",
            "http://localhost:3000"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigins");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Root endpoint
app.MapGet("/", () => new { 
    message = "Command Center API is running!",
    timestamp = DateTime.UtcNow,
    version = Environment.Version.ToString(),
    database = "PostgreSQL Connected",
    environment = app.Environment.EnvironmentName
});

// ❌ REMOVED: Duplicate /api/health endpoint
// HealthController already handles /api/health
// app.MapGet("/api/health", () => new { ... });

// Create database on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.EnsureCreated();
        Console.WriteLine("✅ Database ensured created!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database creation failed: {ex.Message}");
        Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
        throw;
    }
}

app.Run();