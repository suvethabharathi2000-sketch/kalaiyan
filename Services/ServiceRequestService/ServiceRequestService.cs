using Dapper;
using MySqlConnector;
using Kalaiyan.DTO;
using Kalaiyan.Models;
using System.Data;

namespace Kalaiyan.Services.ServiceRequestService;

public class ServiceRequestService : IServiceRequestService
{
    private readonly IConfiguration _configuration;

    public ServiceRequestService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // CREATE REQUEST
    public async Task<Servicerequest> CreateRequestAsync(
        int userId,
        ServiceRequestDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);
            
        var subjectImagePaths = new List<string>();

        // SAVE MULTIPLE SUBJECT IMAGES
        if (request.SubjectImages != null &&
            request.SubjectImages.Count > 0)
        {
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads",
                "requests"
            );

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            foreach (var image in request.SubjectImages)
            {
                if (image == null || image.Length == 0)
                {
                    continue;
                }

                var extension =
                    Path.GetExtension(image.FileName);

                var fileName =
                    $"{Guid.NewGuid()}{extension}";

                var filePath =
                    Path.Combine(
                        uploadsFolder,
                        fileName
                    );

                using var stream =
                    new FileStream(
                        filePath,
                        FileMode.Create
                    );

                await image.CopyToAsync(stream);

                subjectImagePaths.Add(
                    $"/uploads/requests/{fileName}"
                );
            }
        }

        var subjectImagesJson =
            System.Text.Json.JsonSerializer.Serialize(
                subjectImagePaths
            );

        var serviceRequest =
            await connection.QueryFirstOrDefaultAsync<Servicerequest>(
                "sp_ServiceRequest_Create",
                new
                {
                    p_UserId = userId,
                    p_CategoryId = request.CategoryId,
                    p_ArtisanId = request.ArtisanId,
                    p_Description = request.Description,
                    p_Size = request.Size,
                    p_NoOfFaces = request.NoOfFaces,
                    p_SubjectImages = subjectImagesJson,
                    p_Location = request.Location,
                    p_Budget = request.Budget,
                    p_Deadline = request.Deadline.Date,
                    p_Instructions = request.Instructions
                },
                commandType: CommandType.StoredProcedure
            );

        if (serviceRequest == null)
        {
            throw new Exception(
                "Service request creation failed."
            );
        }

        return serviceRequest;
    }


    // GET CUSTOMER REQUESTS
    public async Task<IEnumerable<Servicerequest>> GetCustomerRequestsAsync(
        int userId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var requests =
            await connection.QueryAsync<Servicerequest>(
                "sp_ServiceRequest_GetCustomerRequests",
                new
                {
                    p_UserId = userId
                },
                commandType: CommandType.StoredProcedure
            );

        return requests;
    }


    // GET REQUEST DETAILS
    public async Task<Servicerequest?> GetRequestDetailsAsync(
        int userId,
        int requestId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var request =
            await connection.QueryFirstOrDefaultAsync<Servicerequest>(
                "sp_ServiceRequest_GetDetails",
                new
                {
                    p_UserId = userId,
                    p_RequestId = requestId
                },
                commandType: CommandType.StoredProcedure
            );

        return request;
    }


    // CANCEL REQUEST
    public async Task<bool> CancelRequestAsync(
        int userId,
        int requestId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var request =
            await connection.QueryFirstOrDefaultAsync<Servicerequest>(
                "sp_ServiceRequest_Cancel",
                new
                {
                    p_UserId = userId,
                    p_RequestId = requestId
                },
                commandType: CommandType.StoredProcedure
            );

        return request != null;
    }
}