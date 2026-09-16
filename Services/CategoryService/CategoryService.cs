using Dapper;
using MySqlConnector;
using Kalaiyan.DTO;
using System.Data;

namespace Kalaiyan.Services.CategoryService;

public class CategoryService : ICategoryService
{
    private readonly IConfiguration _configuration;

    public CategoryService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        var connectionString =
            _configuration.GetConnectionString("DefaultConnection");

        using var connection =
            new MySqlConnection(connectionString);

        return await connection.QueryAsync<CategoryDto>(
            "sp_Category_GetAll",
            commandType: CommandType.StoredProcedure);
    }
}