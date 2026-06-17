using Microsoft.AspNetCore.Mvc;
using CommandCenter.Api.Services;

namespace CommandCenter.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MLController : ControllerBase
{
    private readonly AIServiceClient _aiService;
    private readonly ILogger<MLController> _logger;

    public MLController(AIServiceClient aiService, ILogger<MLController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    [HttpPost("train")]
    public async Task<IActionResult> TrainModel([FromBody] Services.TrainRequest request)
    {
        try
        {
            var result = await _aiService.TrainModelAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error training model");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("predict")]
    public async Task<IActionResult> Predict([FromBody] Services.PredictRequest request)
    {
        try
        {
            var result = await _aiService.PredictAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error making predictions");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("forecast")]
    public async Task<IActionResult> Forecast([FromBody] Services.ForecastRequest request)
    {
        try
        {
            var result = await _aiService.ForecastAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating forecast");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("models")]
    public async Task<IActionResult> GetModels()
    {
        try
        {
            var result = await _aiService.GetModelsAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting models");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
