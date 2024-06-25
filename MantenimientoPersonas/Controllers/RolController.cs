using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MantenimientoPersonas.Controllers
{
    [Authorize(Roles = "Administrador")]
    public class RolController : Controller
    {
        private readonly RoleManager<IdentityRole> _rolManager;

        public RolController(RoleManager<IdentityRole> rolManager)
        {
            _rolManager = rolManager;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var roles = await _rolManager.Roles.ToListAsync();
            return View(roles);
        }
        [HttpPost]
        public async Task<IActionResult> AgregarRol(string nombreRol)
        {
            if (nombreRol != null)
            {
                await _rolManager.CreateAsync(new IdentityRole(nombreRol.Trim()));
            }
            return RedirectToAction("Index");
        }
        [HttpPost]
        public async Task<IActionResult> EliminarRol(string rolId)
        {

            if (rolId != null)
            {
                var rol = _rolManager.FindByIdAsync(rolId).Result;
                if (rol != null)
                {
                    await _rolManager.DeleteAsync(rol);
                }
            }
            return RedirectToAction("Index");
        }
    }
}
