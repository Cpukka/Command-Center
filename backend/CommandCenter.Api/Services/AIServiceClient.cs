using System.Text;
using System.Text.Json;

namespace CommandCenter.Api.Services;

public class AIServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIServiceClient> _logger;

    public AIServiceClient(HttpClient httpClient, ILogger<AIServiceClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _httpClient.BaseAddress = new Uri("http://localhost:8000");
        _httpClient.Timeout = TimeSpan.FromMinutes(5);
    }

    public async Task<TrainResponse?> TrainModelAsync(TrainRequest request)
    {
        try
        {
            _logger.LogInformation("Sending training request to AI service for dataset {DatasetId}", request.DatasetId);
            
            var response = await _httpClient.PostAsJsonAsync("/api/train", request);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<TrainResponse>();
            _logger.LogInformation("Training started successfully. Model ID: {ModelId}", result?.ModelId);
            
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to train model for dataset {DatasetId}", request.DatasetId);
            throw;
        }
    }

    public async Task<PredictResponse?> PredictAsync(PredictRequest request)
    {
        try
        {
            _logger.LogInformation("Sending prediction request to AI service using model {ModelId}", request.ModelId);
            
            var response = await _httpClient.PostAsJsonAsync("/api/predict", request);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<PredictResponse>();
            _logger.LogInformation("Prediction completed successfully");
            
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to make predictions using model {ModelId}", request.ModelId);
            throw;
        }
    }

    public async Task<ForecastResponse?> ForecastAsync(ForecastRequest request)
    {
        try
        {
            _logger.LogInformation("Sending forecast request to AI service for dataset {DatasetId}", request.DatasetId);
            
            var response = await _httpClient.PostAsJsonAsync("/api/forecast", request);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<ForecastResponse>();
            _logger.LogInformation("Forecast generated successfully for {Horizon} periods", request.Horizon);
            
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate forecast for dataset {DatasetId}", request.DatasetId);
            throw;
        }
    }

    public async Task<List<ModelInfo>> GetModelsAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/api/models");
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<List<ModelInfo>>();
            return result ?? new List<ModelInfo>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get models list");
            throw;
        }
    }
}
