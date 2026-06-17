namespace CommandCenter.Api.Services;

// Shared ML Models
public class TrainRequest
{
    public string DatasetId { get; set; } = string.Empty;
    public string TargetColumn { get; set; } = string.Empty;
    public string ModelType { get; set; } = "regression";
    public Dictionary<string, object> Parameters { get; set; } = new();
}

public class TrainResponse
{
    public string Status { get; set; } = string.Empty;
    public string DatasetId { get; set; } = string.Empty;
    public string ModelId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class PredictRequest
{
    public string ModelId { get; set; } = string.Empty;
    public List<Dictionary<string, object>> Features { get; set; } = new();
}

public class PredictResponse
{
    public string ModelId { get; set; } = string.Empty;
    public List<double> Predictions { get; set; } = new();
    public int Count { get; set; }
}

public class ForecastRequest
{
    public string DatasetId { get; set; } = string.Empty;
    public string TargetColumn { get; set; } = string.Empty;
    public int Horizon { get; set; } = 30;
    public int Seasonality { get; set; } = 12;
}

public class ForecastResponse
{
    public string DatasetId { get; set; } = string.Empty;
    public string TargetColumn { get; set; } = string.Empty;
    public int Horizon { get; set; }
    public List<ForecastPoint> Forecasts { get; set; } = new();
    public double ConfidenceLevel { get; set; }
    public string Model { get; set; } = string.Empty;
}

public class ForecastPoint
{
    public string Date { get; set; } = string.Empty;
    public double Value { get; set; }
    public double LowerBound { get; set; }
    public double UpperBound { get; set; }
}

public class ModelInfo
{
    public string ModelId { get; set; } = string.Empty;
    public string ModelType { get; set; } = string.Empty;
    public string DatasetId { get; set; } = string.Empty;
    public string TargetColumn { get; set; } = string.Empty;
    public double Accuracy { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}
