using System;
using System.Collections.Generic;

namespace Kalaiyan.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public int OrderId { get; set; }

    public int CustomerId { get; set; }

    public int ArtisanId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime ReviewDate { get; set; }

    public virtual Artisan Artisan { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}
