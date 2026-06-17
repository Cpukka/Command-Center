var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Welcome endpoint
app.MapGet("/", () => new
{
    message = "Command Center API is running!",
    timestamp = DateTime.UtcNow,
    dotNetVersion = Environment.Version.ToString(),
    endpoints = new[] { "/swagger", "/api/health", "/api/health/ping", "/api/health/info" }
});

app.Run();
