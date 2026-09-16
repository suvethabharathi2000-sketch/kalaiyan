using Dapper;
using MySqlConnector;
using Kalaiyan.DTO;
using Kalaiyan.Models;
using System.Data;

namespace Kalaiyan.Services.UserService;

public class UserService : IUserService
{
    private readonly IConfiguration _configuration;

    public UserService(IConfiguration configuration)
    {
        _configuration = configuration;
    }


    // REGISTER
    public async Task<User> RegisterAsync(UserRegisterDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        // BCrypt password hash
        var passwordHash =
            BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = await connection.QueryFirstOrDefaultAsync<User>(
            "sp_User_Register",
            new
            {
                p_FullName = request.FullName,
                p_Email = request.Email,
                p_PhoneNumber = request.PhoneNumber,
                p_PasswordHash = passwordHash,
                p_Role = request.Role
            },
            commandType: CommandType.StoredProcedure
        );

        if (user == null)
            throw new Exception("User registration failed.");

        return user;
    }


    // LOGIN
    public async Task<User?> LoginAsync(
        UserLoginDto request)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var user = await connection.QueryFirstOrDefaultAsync<User>(
            "sp_User_Login",
            new
            {
                p_Email = request.Email
            },
            commandType: CommandType.StoredProcedure
        );

        if (user == null)
            return null;

        // Verify BCrypt password
        var passwordValid =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );

        if (!passwordValid)
            return null;

        return user;
    }


    // GET PROFILE
    public async Task<User?> GetProfileAsync(int userId)
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        var user = await connection.QueryFirstOrDefaultAsync<User>(
            "sp_User_GetProfile",
            new
            {
                p_UserId = userId
            },
            commandType: CommandType.StoredProcedure
        );

        return user;
    }
}