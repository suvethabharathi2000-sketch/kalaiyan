namespace Kalaiyan.DTO;

public class ServiceRequestDto
{
    public int ArtisanId { get; set; }

    public int CategoryId { get; set; }

    public string? Description { get; set; }

    public string Size { get; set; } = string.Empty;

    public int NoOfFaces { get; set; }

    public List<IFormFile>? SubjectImages { get; set; }

    public string Location { get; set; } = string.Empty;

    public decimal Budget { get; set; }

    public DateTime Deadline { get; set; }

    public string? Instructions { get; set; }
}