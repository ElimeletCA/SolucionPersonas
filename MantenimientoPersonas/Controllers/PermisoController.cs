using MantenimientoPersonas.Constants;
using MantenimientoPersonas.Helpers;
using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace MantenimientoPersonas.Controllers
{
    [Authorize(Roles = "Administrador")]
    public class PermisoController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public PermisoController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }
        public async Task<ActionResult> Index(string roleId)
        {
            var model = new PermisoViewModel();
            var allPermiso = new List<RoleClaimsViewModel>();

            // Obtén todos los tipos de permisos automáticamente
            var permisoTypes = typeof(Permisos).GetNestedTypes(BindingFlags.Static | BindingFlags.Public);
            foreach (var permisoType in permisoTypes)
            {
                allPermiso.ObtenerPermisos(permisoType, roleId);
            }

            var role = await _roleManager.FindByIdAsync(roleId);
            model.RoleId = roleId;
            var claims = await _roleManager.GetClaimsAsync(role);

            var allClaimValues = allPermiso.Select(a => a.Value).ToList();
            var roleClaimValues = claims.Select(a => a.Value).ToList();
            var authorizedClaims = allClaimValues.Intersect(roleClaimValues).ToList();

            foreach (var permission in allPermiso)
            {
                if (authorizedClaims.Any(a => a == permission.Value))
                {
                    permission.Selected = true;
                }
            }

            model.RoleClaims = allPermiso;
            return View(model);
        }
        public async Task<IActionResult> Update(PermisoViewModel model)
        {
            var role = await _roleManager.FindByIdAsync(model.RoleId);
            var claims = await _roleManager.GetClaimsAsync(role);
            foreach (var claim in claims)
            {
                await _roleManager.RemoveClaimAsync(role, claim);
            }
            var selectedClaims = model.RoleClaims.Where(a => a.Selected).ToList();
            foreach (var claim in selectedClaims)
            {
                await _roleManager.AgregarClaimPermiso(role, claim.Value);
            }
            return RedirectToAction("Index", new { roleId = model.RoleId });
        }
    }
}
