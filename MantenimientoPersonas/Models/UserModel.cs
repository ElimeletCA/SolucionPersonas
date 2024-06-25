using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace MantenimientoPersonas.Models
{
    public class UserModel : IdentityUser 
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }

        [NotMapped]
        public string PasswordWithoutHash { get; set; }

        [NotMapped]
        public string TwoFactorCode { get; set; }

    }
}
