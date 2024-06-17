using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MantenimientoPersonas.Models
{
    public class PersonaRelacionadaModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int persona_relacionada_id { get; set; }

        public int? persona_id { get; set; }
        public PersonaModel? persona { get; set; }
        public int? ciudad_id { get; set; }
        public CiudadModel? ciudad { get; set; }
        public int? entidad_bancaria_id { get; set; }
        public EntidadBancariaModel? entidad_bancaria { get; set; }



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

        public DateTime? fecha_nacimiento { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string? correo_electronico { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string? tipo_telefono_principal { get; set; }

        [Column(TypeName = "nvarchar(15)")]
        public string? numero_telefono_principal { get; set; }

        [Column(TypeName = "nvarchar(15)")]
        public string? tipo_pago { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string? numero_cuenta { get; set; }
        [Required]
        public bool estado_activo { get; set; }
        public ICollection<RolModel>? roles { get; set; }
        [NotMapped]
        public int[]? roles_id { get; set; }
    }
}
