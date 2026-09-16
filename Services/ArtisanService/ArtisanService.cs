using Dapper;
using MySqlConnector;
using Kalaiyan.DTO;
using Kalaiyan.Models;
using System.Data;

namespace Kalaiyan.Services.ArtisanService;

public class ArtisanService : IArtisanService
{
    private readonly IConfiguration _configuration;
private readonly IWebHostEnvironment _environment;

public ArtisanService(
    IConfiguration configuration,
    IWebHostEnvironment environment)
{
    _configuration = configuration;
    _environment = environment;
}

    public async Task<Artisan> CreateProfileAsync(
        int userId,
        ArtisanProfileDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var artisan =
            await connection.QueryFirstOrDefaultAsync<Artisan>(
                "sp_Artisan_CreateProfile",
                new
                {
                    p_UserId = userId,
                    p_CompanyName = request.CompanyName,
                    p_ExperienceYears = request.ExperienceYears,
                    p_ServiceArea = request.ServiceArea,
                    p_Description = request.Description,
                    p_PreviousWorkImages = request.PreviousWorkImages
                },
                commandType: CommandType.StoredProcedure);

        if (artisan == null)
            throw new Exception("Artisan profile creation failed.");

        return artisan;
    }

    public async Task<Artisan?> GetProfileAsync(int userId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        return await connection.QueryFirstOrDefaultAsync<Artisan>(
            "sp_Artisan_GetProfile",
            new
            {
                p_UserId = userId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Artisan?> UpdateProfileAsync(
        int userId,
        ArtisanProfileDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        return await connection.QueryFirstOrDefaultAsync<Artisan>(
            "sp_Artisan_UpdateProfile",
            new
            {
                p_UserId = userId,
                p_CompanyName = request.CompanyName,
                p_ExperienceYears = request.ExperienceYears,
                p_ServiceArea = request.ServiceArea,
                p_Description = request.Description,
                p_PreviousWorkImages = request.PreviousWorkImages
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Servicerequest>> GetAvailableRequestsAsync(int userId)
{
    var connectionString = _configuration.GetConnectionString("DefaultConnection");
    using var connection = new MySqlConnection(connectionString);

    return await connection.QueryAsync<Servicerequest>(
        "sp_Artisan_GetAvailableRequests",
        new
        {
            p_UserId = userId
        },
        commandType: CommandType.StoredProcedure);
}

public async Task<Order> AcceptRequestAsync(
    int userId,
    int requestId)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    var order =
        await connection.QueryFirstOrDefaultAsync<Order>(
            "sp_Artisan_AcceptRequest",
            new
            {
                p_UserId = userId,
                p_RequestId = requestId
            },
            commandType: CommandType.StoredProcedure);

    if (order == null)
        throw new Exception("Request acceptance failed.");

    return order;
}

public async Task<bool> StartWorkAsync(
    int userId,
    int orderId)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    var order =
        await connection.QueryFirstOrDefaultAsync<Order>(
            "sp_Artisan_StartWork",
            new
            {
                p_UserId = userId,
                p_OrderId = orderId
            },
            commandType: CommandType.StoredProcedure);

    return order != null;
}

public async Task<bool> CompleteWorkAsync(
    int userId,
    int orderId)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    var order =
        await connection.QueryFirstOrDefaultAsync<Order>(
            "sp_Artisan_CompleteWork",
            new
            {
                p_UserId = userId,
                p_OrderId = orderId
            },
            commandType: CommandType.StoredProcedure);

    return order != null;
}

public async Task<bool> RejectRequestAsync(
    int userId,
    int requestId)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    var request =
        await connection.QueryFirstOrDefaultAsync<Servicerequest>(
            "sp_Artisan_RejectRequest",
            new
            {
                p_UserId = userId,
                p_RequestId = requestId
            },
            commandType: CommandType.StoredProcedure);

    return request != null;
}

public async Task<IEnumerable<ArtisanListDto>> GetArtisansForCustomerAsync()
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    return await connection.QueryAsync<ArtisanListDto>(
        "sp_Artisan_GetAllForCustomer",
        commandType: CommandType.StoredProcedure);
}

public async Task<Order> UploadArtworkAsync(
    int userId,
    int orderId,
    ArtworkUploadDto request)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    var order =
        await connection.QueryFirstOrDefaultAsync<Order>(
            "sp_Artisan_UploadArtwork",
            new
            {
                p_UserId = userId,
                p_OrderId = orderId,
                p_ArtworkImages = request.ArtworkImages
            },
            commandType: CommandType.StoredProcedure);

    if (order == null)
    {
        throw new Exception("Artwork upload failed.");
    }

    return order;
}

public async Task<string> UploadPreviousWorkImagesAsync(
    int userId,
    List<IFormFile> images)
{
    if (images == null || images.Count == 0)
        throw new Exception("Please select at least one image.");

    var uploadFolder = Path.Combine(
        _environment.WebRootPath,
        "uploads",
        "artisans");

    if (!Directory.Exists(uploadFolder))
    {
        Directory.CreateDirectory(uploadFolder);
    }

    var imagePaths = new List<string>();

    foreach (var image in images)
    {
        if (image.Length == 0)
            continue;

        var extension =
            Path.GetExtension(image.FileName);

        var fileName =
            $"{Guid.NewGuid()}{extension}";

        var filePath =
            Path.Combine(uploadFolder, fileName);

        using var stream =
            new FileStream(
                filePath,
                FileMode.Create);

        await image.CopyToAsync(stream);

        imagePaths.Add(
            $"/uploads/artisans/{fileName}");
    }

    if (imagePaths.Count == 0)
        throw new Exception("No valid images were uploaded.");

    var previousWorkImages =
        string.Join(",", imagePaths);

    var connectionString =
        _configuration.GetConnectionString(
            "DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    await connection.QueryFirstOrDefaultAsync<Artisan>(
        "sp_Artisan_UpdatePreviousWorkImages",
        new
        {
            p_UserId = userId,
            p_PreviousWorkImages = previousWorkImages
        },
        commandType: CommandType.StoredProcedure);

    return previousWorkImages;
}

}