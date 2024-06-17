using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MantenimientoPersonas.Models
{
    public class RolModel
    {
        [Key]
        public int rol_id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(40)")]
        public string nombre_rol { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(250)")]
        public string? descripcion_rol { get; set; }
        private ICollection<PersonaRelacionadaModel>? personas_relacionadas { get; set; }

    }
}
