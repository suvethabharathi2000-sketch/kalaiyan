using System;
using System.Collections.Generic;

namespace Kalaiyan.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public int UserId { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Servicerequest> Servicerequests { get; set; } = new List<Servicerequest>();

    public virtual User User { get; set; } = null!;
}
