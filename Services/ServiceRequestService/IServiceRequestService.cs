using Kalaiyan.DTO;
using Kalaiyan.Models;

namespace Kalaiyan.Services.ServiceRequestService;

public interface IServiceRequestService
{
    Task<Servicerequest> CreateRequestAsync(
        int userId,
        ServiceRequestDto request);

    Task<IEnumerable<Servicerequest>> GetCustomerRequestsAsync(int userId);

    Task<Servicerequest?> GetRequestDetailsAsync(
        int userId,
        int requestId);

    Task<bool> CancelRequestAsync(
        int userId,
        int requestId);
}