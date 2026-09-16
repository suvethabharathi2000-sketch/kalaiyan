using Kalaiyan.DTO;
using Kalaiyan.Services.UserService;
using Microsoft.AspNetCore.Mvc;
using Kalaiyan.Services.JwtService;
namespace Kalaiyan.Controllers;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
private readonly IJwtService _jwtService;

public UserController(
    IUserService userService,
    IJwtService jwtService)
{
    _userService = userService;
    _jwtService = jwtService;
}

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto request)
    {
        try
        {
            var user = await _userService.RegisterAsync(request);

            return Ok(new
            {
                message = "User registered successfully",
                userId = user.UserId,
                name = user.FullName,
                email = user.Email,
                role = user.Role
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
    [HttpPost("login")]
public async Task<IActionResult> Login(UserLoginDto request)
{
    var user = await _userService.LoginAsync(request);

    if (user == null)
    {
        return Unauthorized(new
        {
            message = "Invalid email or password"
        });
    }

    var token = _jwtService.GenerateToken(user);

    return Ok(new
    {
        message = "Login successful",
        token = token,
        user = new
        {
            userId = user.UserId,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role
        }
    });
}

[Authorize]
[HttpGet("profile/{userId}")]
public async Task<IActionResult> GetProfile(int userId)
{
    var user = await _userService.GetProfileAsync(userId);

    if (user == null)
    {
        return NotFound(new
        {
            message = "User not found"
        });
    }

    return Ok(new
    {
        userId = user.UserId,
        fullName = user.FullName,
        email = user.Email,
        phoneNumber = user.PhoneNumber,
        role = user.Role,
        isActive = user.IsActive,
        createdAt = user.CreatedAt
    });
}
    

}