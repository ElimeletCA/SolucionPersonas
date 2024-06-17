using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MantenimientoPersonas.Models
{
    public class CiudadModel
    {
        [Key]
        public int ciudad_id { get; set; }
        public int provincia_id { get; set; }
        public ProvinciaModel? provincia { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(40)")]
        public string nombre_ciudad { get; set; } = string.Empty;
        public ICollection<PersonaRelacionadaModel>? personas_relacionadas { get; set; }

    }
}
