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
// DATABASE CONNECTION STRING - RAILWAY POSTGRESQL
// ============================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
}

// If still empty, use Railway PostgreSQL directly
if (string.IsNullOrEmpty(connectionString))
{
    connectionString = "Host=postgres.railway.internal;Database=railway;Username=postgres;Password=PEYnUMlHNxqChrkxTaOPaSuPrDdanDFT";
}

if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("❌ ERROR: Database connection string is missing!");
    throw new Exception("Database connection string is required");
}

Console.WriteLine($"✅ Using database connection string...");

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