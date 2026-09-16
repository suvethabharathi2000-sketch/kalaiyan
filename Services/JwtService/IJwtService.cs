using Kalaiyan.Models;

namespace Kalaiyan.Services.JwtService;

public interface IJwtService
{
    string GenerateToken(User user);
}