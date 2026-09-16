using Kalaiyan.DTO;
using Kalaiyan.Services.ArtisanService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kalaiyan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Artisan")]
public class ArtisanController : ControllerBase
{
    private readonly IArtisanService _artisanService;

    public ArtisanController(IArtisanService artisanService)
    {
        _artisanService = artisanService;
    }

    [HttpPost("profile")]
    public async Task<IActionResult> CreateProfile(
        ArtisanProfileDto request)
    {
        try
        {
            var userId = GetUserId();

            var artisan =
                await _artisanService.CreateProfileAsync(
                    userId,
                    request);

            return Ok(new
            {
                message = "Artisan profile created successfully",
                artisanId = artisan.ArtisanId,
                userId = artisan.UserId,
                companyName = artisan.CompanyName,
                experienceYears = artisan.ExperienceYears,
                serviceArea = artisan.ServiceArea,
                description = artisan.Description,
                isApproved = artisan.IsApproved,
                createdAt = artisan.CreatedAt
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

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();

        var artisan =
            await _artisanService.GetProfileAsync(userId);

        if (artisan == null)
        {
            return NotFound(new
            {
                message = "Artisan profile not found"
            });
        }

        return Ok(artisan);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        ArtisanProfileDto request)
    {
        try
        {
            var userId = GetUserId();

            var artisan =
                await _artisanService.UpdateProfileAsync(
                    userId,
                    request);

            if (artisan == null)
            {
                return NotFound(new
                {
                    message = "Artisan profile not found"
                });
            }

            return Ok(new
            {
                message = "Artisan profile updated successfully",
                artisanId = artisan.ArtisanId,
                userId = artisan.UserId,
                companyName = artisan.CompanyName,
                experienceYears = artisan.ExperienceYears,
                serviceArea = artisan.ServiceArea,
                description = artisan.Description,
                isApproved = artisan.IsApproved
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

    [HttpGet("requests")]
public async Task<IActionResult> GetAvailableRequests()
{
    try
    {
        var userId = GetUserId();

        var requests =
            await _artisanService.GetAvailableRequestsAsync(userId);

        return Ok(requests);
    }
    catch (Exception ex)
    {
        return BadRequest(new
        {
            message = ex.Message
        });
    }
}


[HttpPost("requests/{requestId}/accept")]
public async Task<IActionResult> AcceptRequest(int requestId)
{
    try
    {
        var userId = GetUserId();

        var order =
            await _artisanService.AcceptRequestAsync(
                userId,
                requestId);

        return Ok(new
        {
            message = "Service request accepted successfully",
            orderId = order.OrderId,
            requestId = order.RequestId,
            customerId = order.CustomerId,
            artisanId = order.ArtisanId,
            platformFeePercent = order.PlatformFeePercent,
            platformFee = order.PlatformFee,
            totalAmount = order.TotalAmount,
            advanceAmount = order.AdvanceAmount,
            remainingAmount = order.RemainingAmount,
            orderStatus = order.OrderStatus,
            acceptedAt = order.AcceptedAt,
            createdAt = order.CreatedAt
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

[HttpPost("orders/{orderId}/start")]
public async Task<IActionResult> StartWork(int orderId)
{
    try
    {
        var userId = GetUserId();

        var result =
            await _artisanService.StartWorkAsync(
                userId,
                orderId);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Work could not be started."
            });
        }

        return Ok(new
        {
            message = "Work started successfully",
            orderId = orderId
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

[HttpPost("orders/{orderId}/complete")]
public async Task<IActionResult> CompleteWork(int orderId)
{
    try
    {
        var userId = GetUserId();

        var result =
            await _artisanService.CompleteWorkAsync(
                userId,
                orderId);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Work could not be completed."
            });
        }

        return Ok(new
        {
            message = "Work completed successfully",
            orderId = orderId
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

[HttpPost("requests/{requestId}/reject")]
[Authorize(Roles = "Artisan")]
public async Task<IActionResult> RejectRequest(int requestId)
{
    try
    {
        var userId = GetUserId();

        var result =
            await _artisanService.RejectRequestAsync(
                userId,
                requestId);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Request could not be rejected."
            });
        }

        return Ok(new
        {
            message = "Service request rejected successfully",
            requestId = requestId
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

[HttpPut("orders/{orderId}/artwork")]
public async Task<IActionResult> UploadArtwork(
    int orderId,
    ArtworkUploadDto request)
{
    try
    {
        var userId = GetUserId();

        var order = await _artisanService.UploadArtworkAsync(
            userId,
            orderId,
            request);

        return Ok(new
        {
            message = "Artwork uploaded successfully",
            orderId = order.OrderId,
            artworkImages = order.ArtworkImages
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

[HttpPost("previous-work/upload")]
public async Task<IActionResult> UploadPreviousWorkImages(
    [FromForm] ArtisanPreviousWorkUploadDto request)
{
    try
    {
        var userId = GetUserId();

        var imagePaths =
            await _artisanService.UploadPreviousWorkImagesAsync(
                userId,
                request.Images);

        return Ok(new
        {
            message = "Previous work images uploaded successfully",
            images = imagePaths
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

}