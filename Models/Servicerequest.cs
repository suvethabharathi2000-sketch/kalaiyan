using System;
using System.Collections.Generic;

namespace Kalaiyan.Models;

public partial class Servicerequest
{
    public int RequestId { get; set; }

    public int CustomerId { get; set; }

    public int CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public string? Description { get; set; }

    public string Size { get; set; } = null!;

    public int NoOfFaces { get; set; }

    public string? SubjectImages { get; set; }

    public string Location { get; set; } = null!;

    public decimal Budget { get; set; }

    public DateTime Deadline { get; set; }

    public string? Instructions { get; set; }

    public string RequestStatus { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual Order? Order { get; set; }
}
