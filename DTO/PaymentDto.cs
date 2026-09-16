namespace Kalaiyan.DTO;

public class PaymentDto
{
    public int OrderId { get; set; }
    public string PaymentType { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
}