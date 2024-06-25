using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace MantenimientoPersonas.Controllers
{
    [Authorize(Roles = "Administrador")]
    public class UserController : Controller
    {
        private readonly UserManager<UserModel> _userManager;
        public UserController(UserManager<UserModel> userManager)
        {
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var currentUser = await _userManager.GetUserAsync(HttpContext.User);
            var allUsersExceptCurrentUser = await _userManager.Users.Where(a => a.Id != currentUser.Id).ToListAsync();
            return View(allUsersExceptCurrentUser);
        }
        [HttpPost]
        public async Task<IActionResult> EliminarUsuario(string userId)
        {

            if (userId != null)
            {
                var user = _userManager.FindByIdAsync(userId).Result;
                if (user != null)
                {
                    await _userManager.DeleteAsync(user);
                }
            }
            return RedirectToAction("Index");
        }
    }
}
