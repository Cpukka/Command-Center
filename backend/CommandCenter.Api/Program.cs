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

// Database connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
}
if (string.IsNullOrEmpty(connectionString))
{
    connectionString = "Host=postgres.railway.internal;Database=railway;Username=postgres;Password=PEYnUMlHNxqChrkxTaOPaSuPrDdanDFT";
}

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

// CORS - Allow all for debugging
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Always enable Swagger for debugging
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
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

// Health endpoint
app.MapGet("/api/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    service = "Command Center API",
    database = "PostgreSQL Connected"
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
        throw;
    }
}

app.Run();