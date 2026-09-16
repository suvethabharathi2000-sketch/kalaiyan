using Kalaiyan.DTO;
using Kalaiyan.Models;

namespace Kalaiyan.Services.CustomerService;

public interface ICustomerService
{
    Task<Customer> CreateProfileAsync(
        int userId,
        CustomerProfileDto request);

    Task<Customer?> GetProfileAsync(int userId);

    Task<Customer?> UpdateProfileAsync(
        int userId,
        CustomerProfileDto request);
}