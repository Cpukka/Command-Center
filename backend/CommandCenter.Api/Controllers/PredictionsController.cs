using Microsoft.AspNetCore.Mvc;
using CommandCenter.Api.Services;

namespace CommandCenter.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PredictionsController : ControllerBase
{
    [HttpPost("train")]
    public IActionResult Train([FromBody] TrainRequest request)
    {
        return Ok(new
        {
            message = "Model training started",
            modelId = Guid.NewGuid().ToString(),
            datasetId = request.DatasetId,
            status = "training",
            estimatedTime = "5 minutes"
        });
    }
    
    [HttpPost("predict")]
    public IActionResult Predict([FromBody] PredictRequest request)
    {
        return Ok(new
        {
            predictions = new[] { 0.85, 0.92, 0.78, 0.95 },
            confidence = 0.89,
            modelId = request.ModelId,
            timestamp = DateTime.UtcNow
        });
    }
    
    [HttpGet("models")]
    public IActionResult GetModels()
    {
        return Ok(new[]
        {
            new { id = "model-1", name = "Sales Predictor", accuracy = 0.94, type = "Regression" },
            new { id = "model-2", name = "Customer Churn", accuracy = 0.87, type = "Classification" }
        });
    }
}
