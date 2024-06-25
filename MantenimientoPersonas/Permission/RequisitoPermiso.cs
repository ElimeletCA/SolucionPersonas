using Microsoft.AspNetCore.Authorization;

namespace MantenimientoPersonas.Permission
{
    public class RequisitoPermiso : IAuthorizationRequirement
    {
        public string Permiso { get; private set; }
        public RequisitoPermiso(string permiso)
        {
            Permiso = permiso;
        }
    }
}
