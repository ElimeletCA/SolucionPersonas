using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MantenimientoPersonas.Models
{
    public class PersonaModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int persona_id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(10)")]
        public string tipo_documento { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "nvarchar(15)")]
        public string numero_documento { get; set; } = string.Empty;
        [Required]
        [Column(TypeName = "nvarchar(20)")]
        public string primer_nombre { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(20)")]
        public string? segundo_nombre { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(20)")]
        public string primer_apellido { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(20)")]
        public string? segundo_apellido { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string? tipo_telefono { get; set; }

        [Column(TypeName = "nvarchar(15)")]
        public string? numero_telefono { get; set; }
        [Required]
        public bool mayoria_edad { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(10)")]
        public string genero { get; set; } = string.Empty;
        [Required]
        public bool estado_activo { get; set; }
        public ICollection<PersonaRelacionadaModel>? personas_relacionadas { get; set; }
        [NotMapped]
        public int[]? pr_id { get; set; }
    }
}
