using Kalaiyan.Models;

namespace Kalaiyan.Services.OrderService;

public interface IOrderService
{
    Task<IEnumerable<Order>> GetCustomerOrdersAsync(int userId);
    Task<IEnumerable<Order>> GetArtisanOrdersAsync(int userId);

    Task<Order?> GetCustomerOrderDetailsAsync(
    int userId,
    int orderId);

    Task<Order?> GetArtisanOrderDetailsAsync(
    int userId,
    int orderId);
}