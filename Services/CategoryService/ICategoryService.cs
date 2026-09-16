using Kalaiyan.DTO;

namespace Kalaiyan.Services.CategoryService;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
}