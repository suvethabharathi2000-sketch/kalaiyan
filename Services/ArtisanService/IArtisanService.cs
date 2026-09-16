using Kalaiyan.DTO;
using Kalaiyan.Models;

namespace Kalaiyan.Services.ArtisanService;

public interface IArtisanService
{
    Task<Artisan> CreateProfileAsync(
        int userId,
        ArtisanProfileDto request);

    Task<Artisan?> GetProfileAsync(
        int userId);

    Task<Artisan?> UpdateProfileAsync(
        int userId,
        ArtisanProfileDto request);

    Task<IEnumerable<Servicerequest>> GetAvailableRequestsAsync(int userId); 

    Task<Order> AcceptRequestAsync(int userId, int requestId);

    Task<bool> StartWorkAsync(int userId, int orderId);

    Task<bool> CompleteWorkAsync(int userId, int orderId);

    Task<bool> RejectRequestAsync(
    int userId,
    int requestId);

    Task<IEnumerable<ArtisanListDto>> GetArtisansForCustomerAsync();

    Task<Order> UploadArtworkAsync(
    int userId,
    int orderId,
    ArtworkUploadDto request);

    Task<string> UploadPreviousWorkImagesAsync(
    int userId,
    List<IFormFile> images);


}