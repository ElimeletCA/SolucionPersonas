using System.ComponentModel.DataAnnotations;

namespace MantenimientoPersonas.Models
{
    public class TwoFactor
    {
        [Required]
        public string TwoFactorCode { get; set; }
    }
}
