using MantenimientoPersonas.Helpers;
using MantenimientoPersonas.Models;
using MantenimientoPersonas.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MantenimientoPersonas.Controllers
{
    [Authorize]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly UserManager<UserModel> _userManager;
        private readonly IConfiguration _config;
        private readonly SignInManager<UserModel> _signInManager;

        public AuthController(IAuthService authservice, UserManager<UserModel> userManager, IConfiguration config, SignInManager<UserModel> signInManager )
        {
            _authService = authservice;
            _userManager = userManager;
            _config = config;
            _signInManager = signInManager;
        }
        [AllowAnonymous]
        public IActionResult Login()
        {
            if (_authService.ExisteTokenValido(HttpContext))
            {
                return RedirectToAction("Index", "Inicio");
            }
            return View();
        }
        [AllowAnonymous]
        public IActionResult Registro()
        {
            if (_authService.ExisteTokenValido(HttpContext))
            {
                return RedirectToAction("Index", "Inicio");
            }
            return View();
        }
        [AllowAnonymous]
        public IActionResult Verificacion()
        {
            return View();
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<JsonResult> RegistrarUsuario(UserModel usuario)
        {
            try
            {
                if
 (
     usuario.UserName is null
     || usuario.PasswordWithoutHash is null
     || usuario.FullName is null
     || usuario.Email is null
     || usuario.PhoneNumber is null
 )
                {
                    return Json(new { success = false, message = "ERROR-101" });
                }
                if (!Regex.IsMatch(usuario.UserName, @"^[a-zA-Z]{1,15}$", RegexOptions.IgnoreCase))
                {
                    return Json(new { success = false, message = "ERROR-102" });
                }
                if (!Regex.IsMatch(usuario.PasswordWithoutHash, @"^.{1,25}$", RegexOptions.IgnoreCase))
                {
                    return Json(new { success = false, message = "ERROR-103" });
                }
                if (!Regex.IsMatch(usuario.FullName, @"^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]{1,50}$", RegexOptions.IgnoreCase))
                {
                    return Json(new { success = false, message = "ERROR-104" });
                }
                // linux @"^\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}$"
                // windows @"^\d{1,2}/\d{1,2}/\d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)$"
                if (!Regex.IsMatch(usuario.BirthDate.ToString(), @"^\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}$", RegexOptions.IgnoreCase))
                {
                    return Json(new { success = false, message = $"{usuario.BirthDate.ToString()} ERROR-105" });
                }
                if (!Regex.IsMatch(usuario.PhoneNumber, @"^\(\d{3}\) \d{3}-\d{4}$", RegexOptions.IgnoreCase))
                {
                    return Json(new { success = false, message = "ERROR-106" });
                }
                if (!Regex.IsMatch(usuario.Email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", RegexOptions.IgnoreCase))
                {
                    return Json(new { success = false, message = "ERROR-107" });
                }
                if (!(await _userManager.FindByNameAsync(usuario.UserName) is null))
                {
                    return Json(new { success = false, message = "Ya existe una cuenta con ese nombre de usuario, favor verificar e intentar de nuevo" });

                }
                if (!(await _userManager.FindByEmailAsync(usuario.Email) is null))
                {
                    return Json(new { success = false, message = "Ya existe una cuenta con ese correo electrónico, favor verificar e intentar de nuevo" });

                }
                if (await _authService.RegistrarUsuario(usuario))
                {
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(usuario);
                    var confirmationLink = Url.Action("ConfirmarCorreo", "Email", new { token, email = usuario.Email }, Request.Scheme);
                    EmailHelper emailHelper = new EmailHelper(_config);
                    bool emailResponse = emailHelper.EnviarCorreo(usuario.Email, confirmationLink);

                    if (emailResponse)
                    {
                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, message = "ERROR-108" });
                    }


                }
                return Json(new { success = false, message = "ERROR-109" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex });
            }

        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<JsonResult> LoginUsuario(UserModel usuario)
        {
            try {
                var usuarioexistente = await _userManager.FindByNameAsync(usuario.UserName);

                if (usuarioexistente is null)
                {
                    usuarioexistente = await _userManager.FindByEmailAsync(usuario.UserName);
                }

                if (usuarioexistente is null)
                {
                    return Json(new { success = false, message = "No existe el usuario en nuestro sistema, por favor verifique los datos e intente de nuevo." });
                }
                if (!await _userManager.IsEmailConfirmedAsync(usuarioexistente))
                {
                    return Json(new { success = false, message = "El correo electrónico del usuario aún no ha sido verificado, realice la verificación o contacte a soporte técnico" });
                }

                if (await _authService.LoginUsuario(usuario))
                {
                    bool confirmacionenvio = await EnviarCodigo2FA(usuarioexistente.Email);
                    return Json(new { success = confirmacionenvio, message = "2FA" });

                }
                else
                {
                    return Json(new { success = false, message = "Usuario o contraseña incorrectos, por favor verifique los datos e intente de nuevo." });

                }
            } catch
            {
                return Json(new { success = false, message = "ERROR" });
            }

        }
        private async Task<bool> EnviarCodigo2FA(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null) { 
                return false;
            }

            var token = await _userManager.GenerateTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider);
            
            EmailHelper emailHelper = new EmailHelper(_config);
            bool emailResponse = emailHelper.EnviarCorreoCodigoDobleFactor(user.Email, token);
            
            return emailResponse;
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<JsonResult> Verificar2FA(UserModel usuario)
        {
            try
            {
                var usuarioexistente = await _userManager.FindByNameAsync(usuario.UserName);

                if (usuarioexistente is null)
                {
                    usuarioexistente = await _userManager.FindByEmailAsync(usuario.UserName);
                }

                if (usuarioexistente is null || usuario.TwoFactorCode is null)
                {
                    return Json(new { success = false, message = "ERROR" });
                }

                var result = await _userManager.VerifyTwoFactorTokenAsync(usuarioexistente, "Email", usuario.TwoFactorCode);
                if (result)
                {
                    var token = await _authService.GenerarTokenString(usuarioexistente);
                    _authService.ColocarJwtTokenEnCookie(token , HttpContext);
                    return Json(new { success = true, message = "VERIFICADO" });

                }
                else
                {
                    return Json(new { success = false, message = "ERROR" });

                }
            }
            catch(Exception ex)
            {
                return Json(new { success = false, message = ex });
            }

        }

        [HttpPost]
        public JsonResult CerrarSesion()
        {
            _authService.EliminarJwtTokenDeCookie(HttpContext);
            return Json(new { success = true });
        }

    }
}
