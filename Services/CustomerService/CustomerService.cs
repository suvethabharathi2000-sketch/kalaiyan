using Dapper;
using MySqlConnector;
using Kalaiyan.DTO;
using Kalaiyan.Models;
using System.Data;

namespace Kalaiyan.Services.CustomerService;

public class CustomerService : ICustomerService
{
    private readonly IConfiguration _configuration;

    public CustomerService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // CREATE PROFILE
    public async Task<Customer> CreateProfileAsync(
        int userId,
        CustomerProfileDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var customer = await connection.QueryFirstOrDefaultAsync<Customer>(
            "sp_Customer_CreateProfile",
            new
            {
                p_UserId = userId,
                p_Address = request.Address,
                p_City = request.City
            },
            commandType: CommandType.StoredProcedure
        );

        if (customer == null)
            throw new Exception("Customer profile creation failed.");

        return customer;
    }

    // GET PROFILE
    public async Task<Customer?> GetProfileAsync(int userId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var customer = await connection.QueryFirstOrDefaultAsync<Customer>(
            "sp_Customer_GetProfile",
            new
            {
                p_UserId = userId
            },
            commandType: CommandType.StoredProcedure
        );

        return customer;
    }

    // UPDATE PROFILE
    public async Task<Customer?> UpdateProfileAsync(
        int userId,
        CustomerProfileDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var customer = await connection.QueryFirstOrDefaultAsync<Customer>(
            "sp_Customer_UpdateProfile",
            new
            {
                p_UserId = userId,
                p_Address = request.Address,
                p_City = request.City
            },
            commandType: CommandType.StoredProcedure
        );

        return customer;
    }
}