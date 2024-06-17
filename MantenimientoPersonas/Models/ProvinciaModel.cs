using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MantenimientoPersonas.Models
{
    public class ProvinciaModel
    {
        [Key]
        public int provincia_id { get; set; }
        public int pais_id { get; set; }
        public PaisModel? pais { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(40)")]
        public string nombre_provincia { get; set; } = string.Empty;
        public ICollection<CiudadModel>? ciudades { get; set; }

    }
}
