using MantenimientoPersonas.Data;
using MantenimientoPersonas.Seeds;

using MantenimientoPersonas.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MantenimientoPersonas.Controllers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Authorization;
using MantenimientoPersonas.Permission;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DBConnection");
// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<CRUDContext>(options =>
{
    options.UseSqlServer(connectionString);
}
);
builder.Services.AddIdentity<UserModel, IdentityRole>(options =>
    {
        options.Password.RequiredLength = 8;
        options.SignIn.RequireConfirmedEmail = true;
        options.Lockout.AllowedForNewUsers = false;

    }).AddEntityFrameworkStores<CRUDContext>().AddDefaultTokenProviders();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(options =>
{   options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateActor = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        RequireExpirationTime=true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = ctx =>
        {
            ctx.Request.Cookies.TryGetValue("tokenacceso", out var accessToken);
            if (!string.IsNullOrEmpty(accessToken))
                ctx.Token = accessToken;
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermisoPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, AutorizacionPermisoHandler>();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();
    var logger = loggerFactory.CreateLogger("app");

    try
    {
        var userManager = services.GetRequiredService<UserManager<UserModel>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        await DefaultRoles.SembrarAsync(userManager, roleManager);
        await DefaultUsers.SembrarUsuarioAdministradorAsync(userManager, roleManager, builder.Configuration["DefaultUser:Password"]);
        logger.LogInformation("Seed de datos iniciales terminado");
        logger.LogInformation("Iniciando Aplicaicon...");
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Error al enviar los datos seed a la DB");
    }
}

// 

app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Auth}/{action=Login}/{id?}");


app.Run();
