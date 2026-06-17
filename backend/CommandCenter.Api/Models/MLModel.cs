using System.ComponentModel.DataAnnotations;

namespace CommandCenter.Api.Models;

public class MLModel
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModelType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string Parameters { get; set; } = "{}";
    public double? Accuracy { get; set; }
    public int TrainedOnDataset { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = false;
    
    public Dataset? Dataset { get; set; }
    public User? Creator { get; set; }
}
