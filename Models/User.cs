using System;
using System.Collections.Generic;

namespace Kalaiyan.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public bool? IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Artisan? Artisan { get; set; }

    public virtual Customer? Customer { get; set; }
}
