using MantenimientoPersonas.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DBConnection");
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CRUDContext>(options =>
{
    options.UseSqlServer(connectionString);
}
);


var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Persona}/{action=Index}/{id?}");

app.Run();
