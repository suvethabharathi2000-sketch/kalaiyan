using Kalaiyan.Data;
using Kalaiyan.Services.UserService;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Kalaiyan.Services.JwtService;
using Kalaiyan.Services.CustomerService;
using Kalaiyan.Services.ServiceRequestService;
using Kalaiyan.Services.ArtisanService;
using Kalaiyan.Services.PaymentService;
using Kalaiyan.Services.ReviewService;
using Kalaiyan.Services.OrderService;
using Kalaiyan.Services.CategoryService;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["JwtSettings:Key"]!
                )
            )
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("DefaultConnection")!
    ));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IServiceRequestService, ServiceRequestService>();
builder.Services.AddScoped<IArtisanService, ArtisanService>();
builder.Services.AddScoped<
    IPaymentService,
    PaymentService>();
builder.Services.AddScoped<
    IReviewService,
    ReviewService>();
builder.Services.AddScoped<
    IOrderService,
    OrderService>();
builder.Services.AddScoped<
    ICategoryService,
    CategoryService>();

builder.Services.AddOpenApi();

var app = builder.Build();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();