using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MantenimientoPersonas.Models
{
    public class PaisModel
    {
        [Key]
        public int pais_id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(40)")]
        public string nombre_pais { get; set; } = string.Empty;
        public ICollection<ProvinciaModel>? provincias { get; set; }
    }
}
