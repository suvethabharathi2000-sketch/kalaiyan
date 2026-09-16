using Kalaiyan.DTO;
using Kalaiyan.Services.CustomerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kalaiyan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomerController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    // CREATE PROFILE
    [HttpPost("profile")]
    public async Task<IActionResult> CreateProfile(
        CustomerProfileDto request)
    {
        try
        {
            var userId = GetUserId();

            var customer =
                await _customerService.CreateProfileAsync(
                    userId,
                    request);

            return Ok(new
            {
                message = "Customer profile created successfully",
                customerId = customer.CustomerId,
                userId = customer.UserId,
                address = customer.Address,
                city = customer.City
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

    // GET PROFILE
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();

        var customer =
            await _customerService.GetProfileAsync(userId);

        if (customer == null)
        {
            return NotFound(new
            {
                message = "Customer profile not found"
            });
        }

        return Ok(new
        {
            customerId = customer.CustomerId,
            userId = customer.UserId,
            address = customer.Address,
            city = customer.City,
            createdAt = customer.CreatedAt
        });
    }

    // UPDATE PROFILE
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        CustomerProfileDto request)
    {
        try
        {
            var userId = GetUserId();

            var customer =
                await _customerService.UpdateProfileAsync(
                    userId,
                    request);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Customer profile not found"
                });
            }

            return Ok(new
            {
                message = "Customer profile updated successfully",
                customerId = customer.CustomerId,
                userId = customer.UserId,
                address = customer.Address,
                city = customer.City
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
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException(
                "User ID not found in token.");
        }

        return int.Parse(userIdClaim);
    }
}