using Dapper;
using MySqlConnector;
using Kalaiyan.Models;
using System.Data;

namespace Kalaiyan.Services.OrderService;

public class OrderService : IOrderService
{
    private readonly IConfiguration _configuration;

    public OrderService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<IEnumerable<Order>> GetCustomerOrdersAsync(
        int userId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        return await connection.QueryAsync<Order>(
            "sp_Order_GetCustomerOrders",
            new
            {
                p_UserId = userId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Order>> GetArtisanOrdersAsync(
        int userId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        return await connection.QueryAsync<Order>(
            "sp_Order_GetArtisanOrders",
            new
            {
                p_UserId = userId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Order?> GetCustomerOrderDetailsAsync(
    int userId,
    int orderId)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    return await connection.QueryFirstOrDefaultAsync<Order>(
        "sp_Order_GetCustomerOrderDetails",
        new
        {
            p_UserId = userId,
            p_OrderId = orderId
        },
        commandType: CommandType.StoredProcedure);
}
public async Task<Order?> GetArtisanOrderDetailsAsync(
    int userId,
    int orderId)
{
    var connectionString =
        _configuration.GetConnectionString("DefaultConnection");

    using var connection =
        new MySqlConnection(connectionString);

    return await connection.QueryFirstOrDefaultAsync<Order>(
        "sp_Order_GetArtisanOrderDetails",
        new
        {
            p_UserId = userId,
            p_OrderId = orderId
        },
        commandType: CommandType.StoredProcedure);
}

}