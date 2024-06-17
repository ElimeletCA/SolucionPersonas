using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MantenimientoPersonas.Models
{
    public class EntidadBancariaModel
    {
        [Key]
        public int entidad_bancaria_id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(40)")]
        public string nombre_entidad { get; set; } = string.Empty;
        public ICollection<PersonaRelacionadaModel>? personas_relacionadas { get; set; }

    }
}
