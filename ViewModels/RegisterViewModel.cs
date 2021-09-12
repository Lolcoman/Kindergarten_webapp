using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MVCProject.ViewModels
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Zadejte jméno!")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Zadejte e-mail!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage ="Zadejte platný email!")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Zadejte heslo!")]
        [StringLength(10, MinimumLength = 5, ErrorMessage = "Minimum znaků je 5!")]
        [DataType(DataType.Password)]
        //[RegularExpression("^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$", ErrorMessage = "Heslo musí mít 8 znaků a obsahovat 1x (A-Z),1x number (0-9) a 1x !@#$%^&*)")]
        public string Password { get; set; }
    }
}
