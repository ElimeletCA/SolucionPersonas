using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using System.Security.Claims;

namespace MantenimientoPersonas.Helpers
{
    public static class ClaimsHelper
    {
        public static void ObtenerPermisos(this List<RoleClaimsViewModel> allPermissions, Type policy, string roleId)
        {
            FieldInfo[] fields = policy.GetFields(BindingFlags.Static | BindingFlags.Public);
            foreach (FieldInfo fi in fields)
            {
                allPermissions.Add(new RoleClaimsViewModel { Value = fi.GetValue(null).ToString(), Type = "Permiso" });
            }
        }
        public static async Task AgregarClaimPermiso(this RoleManager<IdentityRole> roleManager, IdentityRole role, string permission)
        {
            var allClaims = await roleManager.GetClaimsAsync(role);
            if (!allClaims.Any(a => a.Type == "Permiso" && a.Value == permission))
            {
                await roleManager.AddClaimAsync(role, new Claim("Permiso", permission));
            }
        }
    }
}
