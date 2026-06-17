using Microsoft.AspNetCore.Mvc;
using CommandCenter.Api.Services;

namespace CommandCenter.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ForecastingController : ControllerBase
{
    [HttpPost("forecast")]
    public IActionResult CreateForecast([FromBody] ForecastRequest request)
    {
        var forecasts = new List<object>();
        var startDate = DateTime.UtcNow;
        var random = new Random();
        
        for (int i = 1; i <= request.Horizon; i++)
        {
            forecasts.Add(new
            {
                date = startDate.AddDays(i),
                predictedValue = 100 + (i * 10) + (random.NextDouble() * 5),
                lowerBound = 90 + (i * 8),
                upperBound = 110 + (i * 12)
            });
        }
        
        return Ok(new
        {
            forecastId = Guid.NewGuid().ToString(),
            datasetId = request.DatasetId,
            targetColumn = request.TargetColumn,
            horizon = request.Horizon,
            forecasts = forecasts,
            confidence = 0.95,
            created = DateTime.UtcNow
        });
    }
}
