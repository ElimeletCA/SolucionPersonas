using MantenimientoPersonas.Models;
using System.Threading.Tasks;

namespace MantenimientoPersonas.Services
{
    public interface IAuthService
    {
        Task<string> GenerarTokenString(UserModel usuario);
        Task<bool> LoginUsuario(UserModel usuario);
        Task<bool> RegistrarUsuario(UserModel usuario);
        public void ColocarJwtTokenEnCookie(string token, HttpContext context);
        public bool ExisteTokenValido(HttpContext context);
        public void EliminarJwtTokenDeCookie(HttpContext context);

    }
}