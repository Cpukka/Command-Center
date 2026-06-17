using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommandCenter.Api.Models;

public class Dataset
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? FilePath { get; set; }
    public string? FileType { get; set; }
    public int RowCount { get; set; }
    public int ColumnCount { get; set; }
    public long SizeBytes { get; set; }
    public string Status { get; set; } = "pending";
    public int? UploadedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("UploadedBy")]
    public User? Uploader { get; set; }
}
