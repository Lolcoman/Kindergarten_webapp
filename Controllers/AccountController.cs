using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MVCProject.DBHelps;
using MVCProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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



        //LOGIN
        [HttpPost]
        public IActionResult Login(LoginViewModel loginViewModel)
        {
            string hashPassword;
            bool IsPasswordValid;
            string connectionString = cfg["ConnectionStrings:DefaultConnection"];
            //string connectionString = ConfigurationManager.ConnectionStrings["ConnectionStrings:DefaultConnection"].ConnectionString;
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            //string sqlQuery = "SELECT UserName,Password from [UserTable] where UserName=@UserName and Password=@Password";
            string sqlQueryHash = "SELECT Password from UserTable where [UserName] = @UserName";
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(sqlQueryHash, sqlConnection);
            sqlCommand.Parameters.AddWithValue("@UserName", loginViewModel.UserName);
            //sqlCommand.Parameters.AddWithValue("@Password", loginViewModel.Password);

            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                hashPassword = sqlDataReader["Password"].ToString();
                IsPasswordValid = BCrypt.Net.BCrypt.Verify(loginViewModel.Password, hashPassword);
                if (IsPasswordValid)
                {
                    //string jmeno = sqlDataReader["UserName"].ToString();
                    EntryIntoSession(loginViewModel.UserName);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    //ViewBag.Message = "Přihlášení selhalo";
                    TempData["Message"] = "Špatné uživatelské jméno nebo heslo";
                }
            }
            TempData["Message"] = "Špatné přihlašovací jméno nebo heslo";
            sqlConnection.Close();
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }
    }
}
