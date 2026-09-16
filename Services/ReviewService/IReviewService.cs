using Kalaiyan.DTO;
using Kalaiyan.Models;

namespace Kalaiyan.Services.ReviewService;

public interface IReviewService
{
    Task<Review> CreateReviewAsync(
        int userId,
        ReviewDto request);

        Task<object> GetArtisanReviewSummaryAsync(
    int artisanId);
}