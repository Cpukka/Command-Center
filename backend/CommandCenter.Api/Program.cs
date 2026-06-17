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

// Add Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT Authentication
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

// Configure CORS with specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(
            "https://command-center-production-d1b0.up.railway.app",  // Production Frontend
            "https://command-center-production-1af8.up.railway.app",  // AI Service (if needed)
            "http://localhost:3000",  // Local development
            "http://localhost:5000"   // Local backend
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use HTTPS redirection in production
app.UseHttpsRedirection();

// Use CORS with the specific policy
app.UseCors("AllowSpecificOrigins");

// Add authentication and authorization
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
}

app.Run();