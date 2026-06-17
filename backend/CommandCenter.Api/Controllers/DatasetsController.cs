using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CommandCenter.Api.Data;
using CommandCenter.Api.Models;

namespace CommandCenter.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatasetsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public DatasetsController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var datasets = await _context.Datasets.ToListAsync();
        return Ok(datasets);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dataset = await _context.Datasets.FindAsync(id);
        if (dataset == null)
            return NotFound();
        return Ok(dataset);
    }
    
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromBody] UploadRequest request)
    {
        try
        {
            var dataset = new Dataset
            {
                Name = request.Name,
                Description = request.Description ?? string.Empty,
                FilePath = string.Empty,
                FileType = "manual",
                RowCount = 0,
                ColumnCount = 0,
                SizeBytes = 0,
                Status = "pending",
                UploadedBy = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Datasets.Add(dataset);
            await _context.SaveChangesAsync();
            
            return Ok(new { 
                message = "Dataset created successfully", 
                datasetId = dataset.Id,
                status = "pending"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
        }
    }
    
    [HttpPost("upload-csv")]
    public async Task<IActionResult> UploadCSV([FromForm] IFormFile file, [FromForm] string name, [FromForm] string description)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded" });
        
        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Only CSV files are allowed" });
        
        try
        {
            // Parse CSV to get row and column count
            using var reader = new StreamReader(file.OpenReadStream());
            var csvContent = await reader.ReadToEndAsync();
            var lines = csvContent.Split('\n', StringSplitOptions.RemoveEmptyEntries);
            var headers = lines.Length > 0 ? lines[0].Split(',') : Array.Empty<string>();
            var rowCount = lines.Length - 1; // Subtract header row
            var columnCount = headers.Length;
            
            var dataset = new Dataset
            {
                Name = name,
                Description = description ?? "",
                FilePath = "", // Would store file path if saving to disk
                FileType = "csv",
                RowCount = rowCount,
                ColumnCount = columnCount,
                SizeBytes = file.Length,
                Status = "ready",
                UploadedBy = 1, // TODO: Get from authenticated user
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Datasets.Add(dataset);
            await _context.SaveChangesAsync();
            
            // TODO: Store CSV data in a separate table or process as needed
            // For now, we just store metadata
            
            return Ok(new { 
                datasetId = dataset.Id, 
                message = "CSV uploaded successfully",
                rowCount = rowCount,
                columnCount = columnCount,
                fileSize = file.Length,
                status = "ready"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error processing CSV: {ex.Message}" });
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var dataset = await _context.Datasets.FindAsync(id);
        if (dataset == null)
            return NotFound();
        
        _context.Datasets.Remove(dataset);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Dataset deleted" });
    }
}

public class UploadRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}