using Kalaiyan.DTO;
using Kalaiyan.Services.ReviewService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kalaiyan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReview(
        ReviewDto request)
    {
        try
        {
            var userId = GetUserId();

            var review =
                await _reviewService.CreateReviewAsync(
                    userId,
                    request);

            return Ok(new
            {
                message = "Review created successfully",
                reviewId = review.ReviewId,
                orderId = review.OrderId,
                customerId = review.CustomerId,
                artisanId = review.ArtisanId,
                rating = review.Rating,
                comment = review.Comment,
                reviewDate = review.ReviewDate
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

    [HttpGet("artisan/{artisanId}/summary")]
[AllowAnonymous]
public async Task<IActionResult> GetArtisanReviewSummary(
    int artisanId)
{
    try
    {
        var result =
            await _reviewService.GetArtisanReviewSummaryAsync(
                artisanId);

        return Ok(result);
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