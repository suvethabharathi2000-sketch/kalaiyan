using Kalaiyan.DTO;
using Kalaiyan.Services.ServiceRequestService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kalaiyan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class ServiceRequestController : ControllerBase
{
    private readonly IServiceRequestService _serviceRequestService;

    public ServiceRequestController(
        IServiceRequestService serviceRequestService)
    {
        _serviceRequestService = serviceRequestService;
    }

    // CREATE SERVICE REQUEST
    [HttpPost]
    public async Task<IActionResult> CreateRequest(
        [FromForm] ServiceRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            Console.WriteLine(
    $"CREATE REQUEST - UserId: {userId}"
);

Console.WriteLine(
    $"CREATE REQUEST - ArtisanId: {request.ArtisanId}"
);

Console.WriteLine(
    $"CREATE REQUEST - CategoryId: {request.CategoryId}"
);

            var serviceRequest =
                await _serviceRequestService.CreateRequestAsync(
                    userId,
                    request);

            return Ok(new
            {
                message = "Service request created successfully",
                requestId = serviceRequest.RequestId,
                customerId = serviceRequest.CustomerId,
                categoryId = serviceRequest.CategoryId,
                size = serviceRequest.Size,
                noOfFaces = serviceRequest.NoOfFaces,
                location = serviceRequest.Location,
                budget = serviceRequest.Budget,
                deadline = serviceRequest.Deadline,
                requestStatus = serviceRequest.RequestStatus,
                createdAt = serviceRequest.CreatedAt
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

    // GET MY REQUESTS
    [HttpGet]
    public async Task<IActionResult> GetMyRequests()
    {
        var userId = GetUserId();

        var requests =
            await _serviceRequestService
                .GetCustomerRequestsAsync(userId);

        return Ok(requests);
    }

    // GET REQUEST DETAILS
    [HttpGet("{requestId}")]
    public async Task<IActionResult> GetRequestDetails(
        int requestId)
    {
        var userId = GetUserId();

        var request =
            await _serviceRequestService
                .GetRequestDetailsAsync(
                    userId,
                    requestId);

        if (request == null)
        {
            return NotFound(new
            {
                message = "Service request not found"
            });
        }

        return Ok(request);
    }

    // CANCEL REQUEST
    [HttpPut("{requestId}/cancel")]
    public async Task<IActionResult> CancelRequest(
        int requestId)
    {
        try
        {
            var userId = GetUserId();

            var result =
                await _serviceRequestService
                    .CancelRequestAsync(
                        userId,
                        requestId);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Service request not found"
                });
            }

            return Ok(new
            {
                message = "Service request cancelled successfully"
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
        {
            throw new UnauthorizedAccessException(
                "User ID not found in token.");
        }

        return int.Parse(userIdClaim);
    }
}