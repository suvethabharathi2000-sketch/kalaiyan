using Kalaiyan.DTO;
using Kalaiyan.Models;

namespace Kalaiyan.Services.PaymentService;

public interface IPaymentService
{
    Task<Payment> CreatePaymentAsync(
        int userId,
        PaymentDto request);
}