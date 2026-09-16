using Kalaiyan.DTO;
using Kalaiyan.Services.PaymentService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kalaiyan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePayment(
        PaymentDto request)
    {
        try
        {
            var userId = GetUserId();

            var payment =
                await _paymentService.CreatePaymentAsync(
                    userId,
                    request);

            return Ok(new
            {
                message = "Payment created successfully",
                paymentId = payment.PaymentId,
                orderId = payment.OrderId,
                paymentType = payment.PaymentType,
                amount = payment.Amount,
                paymentMethod = payment.PaymentMethod,
                paymentStatus = payment.PaymentStatus,
                transactionReference =
                    payment.TransactionReference,
                paymentDate = payment.PaymentDate
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    private int GetUserId()
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException(
                "User ID not found in token.");

        return int.Parse(userIdClaim);
    }
}