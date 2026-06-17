using Microsoft.EntityFrameworkCore;
using CommandCenter.Api.Models;

namespace CommandCenter.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Dataset> Datasets { get; set; }
    public DbSet<MLModel> MLModels { get; set; }
    public DbSet<Prediction> Predictions { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Role).HasDefaultValue("Analyst");
        });
        
        // Dataset configuration
        modelBuilder.Entity<Dataset>(entity =>
        {
            entity.Property(e => e.Status).HasDefaultValue("pending");
            entity.HasOne(e => e.Uploader)
                  .WithMany()
                  .HasForeignKey(e => e.UploadedBy)
                  .OnDelete(DeleteBehavior.Restrict);
        });
        
        // MLModel configuration
        modelBuilder.Entity<MLModel>(entity =>
        {
            entity.HasOne(e => e.Dataset)
                  .WithMany()
                  .HasForeignKey(e => e.TrainedOnDataset);
            entity.HasOne(e => e.Creator)
                  .WithMany()
                  .HasForeignKey(e => e.CreatedBy);
        });
    }
}
