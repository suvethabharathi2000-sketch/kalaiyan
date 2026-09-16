using System;
using System.Collections.Generic;

namespace Kalaiyan.Models;

public partial class Artisan
{
    public int ArtisanId { get; set; }

    public int UserId { get; set; }

    public string? CompanyName { get; set; }

    public int? ExperienceYears { get; set; }

    public string? ServiceArea { get; set; }

    public string? Description { get; set; }

    public bool IsApproved { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? PreviousWorkImages { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual User User { get; set; } = null!;
}
