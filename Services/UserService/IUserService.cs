using Kalaiyan.DTO;
using Kalaiyan.Models;

namespace Kalaiyan.Services.UserService;

public interface IUserService
{
    Task<User> RegisterAsync(UserRegisterDto request);

    Task<User?> LoginAsync(UserLoginDto request);

    Task<User?> GetProfileAsync(int userId);
}