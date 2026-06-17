using System.ComponentModel.DataAnnotations;

namespace CommandCenter.Api.Models;

public class Prediction
{
    [Key]
    public int Id { get; set; }
    public int ModelId { get; set; }
    public int DatasetId { get; set; }
    public string InputData { get; set; } = "{}";
    public string PredictionResult { get; set; } = "{}";
    public double? ConfidenceScore { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public MLModel? Model { get; set; }
    public Dataset? Dataset { get; set; }
    public User? User { get; set; }
}
