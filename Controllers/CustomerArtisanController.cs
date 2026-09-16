using Kalaiyan.Services.ArtisanService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kalaiyan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class CustomerArtisanController : ControllerBase
{
    private readonly IArtisanService _artisanService;

    public CustomerArtisanController(IArtisanService artisanService)
    {
        _artisanService = artisanService;
    }

    [HttpGet]
    public async Task<IActionResult> GetArtisans()
    {
        try
        {
            var artisans =
                await _artisanService.GetArtisansForCustomerAsync();

            return Ok(artisans);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}