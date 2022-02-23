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
            string connectionString = cfg["ConnectionStrings:DefaultConnection"];
            //Ověření zda již uživetel je v databázi, ověří duplicitní jméno a email
            SqlConnection sql = new SqlConnection(connectionString);
            //TEST
            //string uQuery = $"SELECT * FROM [UserTable] WHERE UserName = @UserName OR Email = @email";
            string uQuery = $"SELECT * FROM [UserTable] WHERE UserName = @UserName";
            SqlCommand command1 = new SqlCommand(uQuery, sql);
            command1.Parameters.AddWithValue("@UserName", registerViewModel.UserName);
            //command1.Parameters.AddWithValue("@email", registerViewModel.Email);
            bool IsExist = help.IsUserExist(command1,sql);
            if (IsExist == true)
            {
                ViewBag.Exist = "Jméno již existuje!";
                return View();
            }
            //Kryptování hesla pomocí BCrypt
            string CrypPassword = registerViewModel.Password;
            CrypPassword = BCrypt.Net.BCrypt.HashPassword(CrypPassword);

            //string query = "INSERT INTO [UserTable](UserName,Email,Password) VALUES (@username, @email, @password)";
            uQuery = "INSERT INTO [UserTable](UserName,Email,Password,Role) VALUES (@username, @email, @password, @role)";
            SqlCommand command = new SqlCommand(uQuery,sql);
            command.Parameters.AddWithValue("@username", registerViewModel.UserName);
            command.Parameters.AddWithValue("@email", registerViewModel.Email);
            command.Parameters.AddWithValue("@password", CrypPassword);
            if (registerViewModel.AdminKey == "9qf+TZ")
            {
                registerViewModel.AdminKey = "pedagog";
                command.Parameters.AddWithValue("@role",registerViewModel.AdminKey);
            }
            else
            {
                command.Parameters.AddWithValue("@role", "dite");
            }

            try
            {
                sql.Open();
                command.ExecuteNonQuery();
                EntryIntoSession(registerViewModel.UserName);
                //Přidá Pedagoga do session
                if (registerViewModel.AdminKey == "9qf+TZ")
                {
                    EntryIntoSessionRole(registerViewModel.AdminKey);
                }

                //změna zprávy když se zaregistruje
                TempData["Message"] = "SucessRegister";
                return RedirectToAction("MainPage", "Home");
            }
            catch (SqlException e)
            {
                Console.WriteLine("Error Generated. Details: " + e.ToString());
            }
            finally
            {
                sql.Close();
            }
            return View();
        }

        public void EntryIntoSession(string userName)
        {
            HttpContext.Session.SetString("UserName", userName);
        }
        public void EntryIntoSessionRole(string role)
        {
            HttpContext.Session.SetString("Role", role);
        }



        //LOGIN
        [HttpPost]
        public IActionResult Login(LoginViewModel loginViewModel)
        {
            string role;
            string hashPassword;
            bool IsPasswordValid;
            string connectionString = cfg["ConnectionStrings:DefaultConnection"];
            //string connectionString = ConfigurationManager.ConnectionStrings["ConnectionStrings:DefaultConnection"].ConnectionString;
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            //string sqlQuery = "SELECT UserName,Password from [UserTable] where UserName=@UserName and Password=@Password";
            string sqlQueryHash = "SELECT Password,Role from UserTable where [UserName] = @UserName";
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(sqlQueryHash, sqlConnection);
            sqlCommand.Parameters.AddWithValue("@UserName", loginViewModel.UserName);

            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                hashPassword = sqlDataReader["Password"].ToString();
                role = sqlDataReader["Role"].ToString();
                IsPasswordValid = BCrypt.Net.BCrypt.Verify(loginViewModel.Password, hashPassword);
                if (IsPasswordValid)
                {
                    //string jmeno = sqlDataReader["UserName"].ToString();
                    //Session["userID"] = loginViewModel.UserName;
                    EntryIntoSession(loginViewModel.UserName);
                    if (role == "pedagog")
                    {
                        EntryIntoSessionRole(role);
                    }
                    TempData["Message"] = "Sucess";
                    return RedirectToAction("MainPage", "Home");
                }
                else
                {
                    //ViewBag.Message = "Přihlášení selhalo";
                    TempData["Message"] = "Špatné uživatelské jméno nebo heslo";
                }
            }
            //TempData["Message"] = "Špatné přihlašovací jméno nebo heslo";
            sqlConnection.Close();
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        //ODHLÁŠENÍ UŽIVATELE
        [HttpGet]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            HttpContext.Session.Remove("UserName");
            HttpContext.Session.Remove("Role");
            return RedirectToAction("MainPage", "Home");
        }


        //DODĚLAT
        [HttpPost]
        public IActionResult ForgotPassword(string email)
        {
            string message = "";
            bool status = false;

            string query = "SELECT Email FROM UserTable WHERE [Email] = @UserName";
            return View();
        }
    }
}
