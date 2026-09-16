using System;
using System.Collections.Generic;

namespace Kalaiyan.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int OrderId { get; set; }

    public string PaymentType { get; set; } = null!;

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public string? TransactionReference { get; set; }

    public DateTime PaymentDate { get; set; }

    public virtual Order Order { get; set; } = null!;
}
