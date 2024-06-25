using MantenimientoPersonas.Constants;
using MantenimientoPersonas.Models;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MantenimientoPersonas.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<UserModel> _userManager;
        private readonly RoleManager<IdentityRole> _rolManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<UserModel> userManager, RoleManager<IdentityRole> rolManager, IConfiguration config)
        {
            _userManager = userManager;
            _rolManager = rolManager;
            _config = config;
        }

        public async Task<bool> RegistrarUsuario(UserModel usuario)
        {
            var result = await _userManager.CreateAsync(usuario, usuario.PasswordWithoutHash);
            return result.Succeeded;
        }
        public async Task<bool> LoginUsuario(UserModel usuario)
        {
            try
            {
                var usuarioexistente = await _userManager.FindByNameAsync(usuario.UserName);

                if (usuarioexistente is null)
                {
                    usuarioexistente = await _userManager.FindByEmailAsync(usuario.UserName);
                }

                if (usuarioexistente is null)
                {
                    return false;
                }
                return await _userManager.CheckPasswordAsync(usuarioexistente, usuario.PasswordWithoutHash);
            } catch {
                return false;

            }

        }

        public async Task<string> GenerarTokenString(UserModel usuario)
        {
            var usuarioexistente = await _userManager.FindByNameAsync(usuario.UserName);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuarioexistente.Id),
                new Claim(JwtRegisteredClaimNames.Name, usuarioexistente.UserName),
                //new Claim(ClaimTypes.Role, "Admin")
            };


            var roles = await _userManager.GetRolesAsync(usuarioexistente);
            claims.AddRange(roles.Select(rol => new Claim("roles", rol)));

            var roleClaims = new List<Claim>();
            foreach (var role in roles)
            {
                var roleEntity = await _rolManager.FindByNameAsync(role);
                if (roleEntity != null)
                {
                    var claimsFromRole = await _rolManager.GetClaimsAsync(roleEntity);
                    roleClaims.AddRange(claimsFromRole.Where(claim => claim.Type == "Permiso"));
                }
            }
            claims.AddRange(roleClaims);

            var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var signingcred = new SigningCredentials
                (
                securitykey,
                SecurityAlgorithms.HmacSha512Signature
                );

            var securityToken = new JwtSecurityToken(
                claims: claims,
                expires: System.DateTime.Now.AddMinutes(10),
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                signingCredentials: signingcred);
                
            string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return tokenString;
        }
        public void ColocarJwtTokenEnCookie(string token, HttpContext context)
        {
            try
            {
                context.Response.Cookies.Append("tokenacceso", token,
                    new CookieOptions
                    {
                        Expires = DateTimeOffset.UtcNow.AddMinutes(10),
                        HttpOnly = true,
                        IsEssential = true,
                        Secure = true,
                        SameSite = SameSiteMode.None
                    });
            }
            catch {

            }

        }
        public bool ExisteTokenValido(HttpContext context)
        {
            if (context.Request.Cookies.TryGetValue("tokenacceso", out var token) && !string.IsNullOrEmpty(token))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

                try
                {
                    tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = _config["Jwt:Issuer"],
                        ValidAudience = _config["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    }, out SecurityToken validatedToken);

                    return true; // Token is valid
                }
                catch
                {
                    return false; // Token is invalid
                }
            }
            return false; // No token found
        }
        public void EliminarJwtTokenDeCookie(HttpContext context)
        {
            context.Response.Cookies.Delete("tokenacceso");
        }
    }
}
