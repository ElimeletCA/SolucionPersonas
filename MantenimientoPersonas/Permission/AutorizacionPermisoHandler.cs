using Microsoft.AspNetCore.Authorization;

namespace MantenimientoPersonas.Permission
{
    internal class AutorizacionPermisoHandler : AuthorizationHandler<RequisitoPermiso>
    {
        private readonly IConfiguration _config;

        public AutorizacionPermisoHandler(IConfiguration config) {
            _config = config;
        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, RequisitoPermiso requisito)
        {
            if (context.User == null)
            {
                return;
            }
            var permisos = context.User.Claims.Where(x => x.Type == "Permiso" &&
                                                                x.Value == requisito.Permiso &&
                                                                x.Issuer == _config["Jwt:Issuer"]);
            if (permisos.Any())
            {
                context.Succeed(requisito);
                return;
            }
        }
    }
}
