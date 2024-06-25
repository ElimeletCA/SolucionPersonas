using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MantenimientoPersonas.Controllers
{
    [Authorize]
    public class EmailController : Controller
    {
        private UserManager<UserModel> userManager;
        private readonly IConfiguration _config;
        public EmailController(UserManager<UserModel> usrMgr, IConfiguration config)
        {
            userManager = usrMgr;
            _config = config;
        }
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmarCorreo(string token, string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
                return View("Error");

            var result = await userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                var result2fa = userManager.SetTwoFactorEnabledAsync(user, true);
            }
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }
    }
}
