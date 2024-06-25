using MantenimientoPersonas.Constants;
using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace MantenimientoPersonas.Seeds
{
    public static class DefaultRoles
    {
        public static async Task SembrarAsync(UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager)
        {
            await roleManager.CreateAsync(new IdentityRole(Roles.Administrador.ToString()));
        }
    }

}
