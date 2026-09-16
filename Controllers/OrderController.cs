using Kalaiyan.Services.OrderService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kalaiyan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("customer")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetCustomerOrders()
    {
        try
        {
            var userId = GetUserId();

            var orders =
                await _orderService.GetCustomerOrdersAsync(userId);

            return Ok(orders);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet("artisan")]
    [Authorize(Roles = "Artisan")]
    public async Task<IActionResult> GetArtisanOrders()
    {
        try
        {
            var userId = GetUserId();

            var orders =
                await _orderService.GetArtisanOrdersAsync(userId);

            return Ok(orders);
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

    [HttpGet("customer/{orderId}")]
[Authorize(Roles = "Customer")]
public async Task<IActionResult> GetCustomerOrderDetails(int orderId)
{
    try
    {
        var userId = GetUserId();

        var order =
            await _orderService.GetCustomerOrderDetailsAsync(
                userId,
                orderId);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        return Ok(order);
    }
    catch (Exception ex)
    {
        return BadRequest(new
        {
            message = ex.Message
        });
    }
}

[HttpGet("artisan/{orderId}")]
[Authorize(Roles = "Artisan")]
public async Task<IActionResult> GetArtisanOrderDetails(int orderId)
{
    try
    {
        var userId = GetUserId();

        var order =
            await _orderService.GetArtisanOrderDetailsAsync(
                userId,
                orderId);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        return Ok(order);
    }
    catch (Exception ex)
    {
        return BadRequest(new
        {
            message = ex.Message
        });
    }
}
}