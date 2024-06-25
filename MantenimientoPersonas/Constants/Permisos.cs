namespace MantenimientoPersonas.Constants
{
    public class Permisos
    {
        public static List<string> GenerarPermisosParaModulo(string modulo)
        {
            return new List<string>()
        {
            $"Permisos.{modulo}.Ver",
            $"Permisos.{modulo}.Crear",
            $"Permisos.{modulo}.Editar",
            $"Permisos.{modulo}.Eliminar",
        };
        }

        public static class Personas
        {
            public const string Ver = "Permisos.Personas.Ver";
            public const string Crear = "Permisos.Personas.Crear";
            public const string Editar = "Permisos.Personas.Editar";
            public const string Eliminar = "Permisos.Personas.Eliminar";
        }
        public static class PersonasRelacionadas
        {
            public const string Ver = "Permisos.PersonasRelacionadas.Ver";
            public const string Crear = "Permisos.PersonasRelacionadas.Crear";
            public const string Editar = "Permisos.PersonasRelacionadas.Editar";
            public const string Eliminar = "Permisos.PersonasRelacionadas.Eliminar";
        }
        public static class Roles
        {
            public const string Ver = "Permisos.Roles.Ver";
            public const string Crear = "Permisos.Roles.Crear";
            public const string Editar = "Permisos.Roles.Editar";
            public const string Eliminar = "Permisos.Roles.Eliminar";
        }
        public static class Usuarios
        {
            public const string Ver = "Permisos.Usuarios.Ver";
            public const string Crear = "Permisos.Usuarios.Crear";
            public const string Editar = "Permisos.Usuarios.Editar";
            public const string Eliminar = "Permisos.Usuarios.Eliminar";
        }
    }
}
