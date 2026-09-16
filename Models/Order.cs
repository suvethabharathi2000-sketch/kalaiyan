using System;
using System.Collections.Generic;

namespace Kalaiyan.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int RequestId { get; set; }

    public int CustomerId { get; set; }

    public int ArtisanId { get; set; }

    public decimal PlatformFeePercent { get; set; }

    public decimal PlatformFee { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal AdvanceAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public string OrderStatus { get; set; } = null!;

    public DateTime? AcceptedAt { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? ArtworkImages { get; set; }

    public string? SubjectImages { get; set; }

    public bool IsFinalPaymentCompleted { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Artisan Artisan { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Servicerequest Request { get; set; } = null!;

    public virtual Review? Review { get; set; }

    
}
