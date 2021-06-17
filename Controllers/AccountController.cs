using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MVCProject.DBHelps;
using MVCProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVCProject.Controllers
{
    public class AccountController : Controller
    {
        private IConfiguration cfg;
        DBHelp help;
        public IActionResult Index()
        {
            return View();
        }

        public AccountController(IConfiguration configuration)
        {
            cfg = configuration;
            help = new DBHelp(cfg);
        }
        //REGISTRACE NOVÉHO UŽIVATELE
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        public IActionResult Register(RegisterViewModel registerViewModel)
        {
            string uQuery = $"Select * from [UserTable] where UserName = '{registerViewModel.UserName}'" + $"OR Email = '{registerViewModel.Email}'";
            bool IsExist = help.IsUserExist(uQuery);
            if (IsExist == true)
            {
                ViewBag.Exist = "Jmeno a email existují!";
                return View("Register", "Accounts");
            }
            //Kryptování hesla pomocí BCrypt
            string CrypPassword = registerViewModel.Password;
            CrypPassword = BCrypt.Net.BCrypt.HashPassword(CrypPassword);

            string query = "Insert into [UserTable](UserName,Email,Password)" + $"values('{registerViewModel.UserName}','{registerViewModel.Email}','{CrypPassword}')";

            int result = help.DMLTransaction(query);
            //Pokud je hodnota větší než 0, data se uloží do databáze
            if (result > 0)
            {
                EntryIntoSession(registerViewModel.UserName);
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        public void EntryIntoSession(string userName)
        {
            HttpContext.Session.SetString("UserName", userName);
        }
    }
}
