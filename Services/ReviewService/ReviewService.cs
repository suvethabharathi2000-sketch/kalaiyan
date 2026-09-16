using Dapper;
using MySqlConnector;
using Kalaiyan.DTO;
using Kalaiyan.Models;
using System.Data;

namespace Kalaiyan.Services.ReviewService;

public class ReviewService : IReviewService
{
    private readonly IConfiguration _configuration;

    public ReviewService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Review> CreateReviewAsync(
        int userId,
        ReviewDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var review =
            await connection.QueryFirstOrDefaultAsync<Review>(
                "sp_Review_Create",
                new
                {
                    p_UserId = userId,
                    p_OrderId = request.OrderId,
                    p_Rating = request.Rating,
                    p_Comment = request.Comment
                },
                commandType: CommandType.StoredProcedure);

        if (review == null)
            throw new Exception("Review creation failed.");

        return review;
    }

    public async Task<object> GetArtisanReviewSummaryAsync(
    int artisanId)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    var result =
        await connection.QueryFirstOrDefaultAsync(
            "sp_Review_GetArtisanSummary",
            new
            {
                p_ArtisanId = artisanId
            },
            commandType: CommandType.StoredProcedure);

    if (result == null)
    {
        return new
        {
            artisanId,
            averageRating = 0,
            reviewCount = 0
        };
    }

    return result;
}
}