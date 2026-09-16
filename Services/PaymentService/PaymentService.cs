using Dapper;
using MySqlConnector;
using Kalaiyan.DTO;
using Kalaiyan.Models;
using System.Data;

namespace Kalaiyan.Services.PaymentService;

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public PaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Payment> CreatePaymentAsync(
        int userId,
        PaymentDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var payment =
            await connection.QueryFirstOrDefaultAsync<Payment>(
                "sp_Payment_Create",
                new
                {
                    p_UserId = userId,
                    p_OrderId = request.OrderId,
                    p_PaymentType = request.PaymentType,
                    p_PaymentMethod = request.PaymentMethod
                },
                commandType: CommandType.StoredProcedure);

        if (payment == null)
            throw new Exception("Payment creation failed.");

        return payment;
    }
}