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
        string connectionString;
        public IActionResult Index()
        {
            return View();
        }

        public AccountController(IConfiguration configuration)
        {
            cfg = configuration;
            help = new DBHelp(cfg);
            connectionString = cfg["ConnectionStrings:DefaultConnection"];
        }
        //REGISTRACE NOVÉHO UŽIVATELE
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        public IActionResult Register(RegisterViewModel registerViewModel)
        {
            //Ověření zda již uživetel je v databázi, ověří duplicitní jméno a email
            using SqlConnection sql = new SqlConnection(connectionString);
            //TEST
            //string uQuery = $"SELECT * FROM [UserTable] WHERE UserName = @UserName OR Email = @email";
            string uQuery = $"SELECT * FROM [UserTable] WHERE UserName = @UserName";
            SqlCommand command1 = new SqlCommand(uQuery, sql);
            command1.Parameters.AddWithValue("@UserName", registerViewModel.UserName);
            //command1.Parameters.AddWithValue("@email", registerViewModel.Email);
            bool IsExist = help.IsUserExist(command1,sql);
            if (IsExist == true)
            {
                //ViewBag.Exist = "Jméno již existuje!";
                TempData["Message"] = "nameExist";
                return View();
            }
            //Kryptování hesla pomocí BCrypt
            string CrypPassword = registerViewModel.Password;
            CrypPassword = BCrypt.Net.BCrypt.HashPassword(CrypPassword);
            //převedení na malé písmena třída
            string accentedStr = registerViewModel.ClassName;
            byte[] tempBytes;
            tempBytes = System.Text.Encoding.GetEncoding("ISO-8859-8").GetBytes(accentedStr);
            string lowerClassName = System.Text.Encoding.UTF8.GetString(tempBytes);
            //string query = "INSERT INTO [UserTable](UserName,Email,Password) VALUES (@username, @email, @password)";
            uQuery = "INSERT INTO [UserTable](UserName,Email,Password,Role,ClassName) VALUES (@username, @email, @password, @role, @className)";
            SqlCommand command = new SqlCommand(uQuery,sql);
            command.Parameters.AddWithValue("@username", registerViewModel.UserName);
            command.Parameters.AddWithValue("@email", registerViewModel.Email);
            command.Parameters.AddWithValue("@password", CrypPassword);
            command.Parameters.AddWithValue("@className", lowerClassName);
            if (registerViewModel.AdminKey == "9qf+TZ")
            {
                //registerViewModel.AdminKey = "pedagog";
                string addRole = "pedagog";
                command.Parameters.AddWithValue("@role",addRole);
            }
            else
            {
                command.Parameters.AddWithValue("@role", "dite");
            }

            try
            {
                sql.Open();
                command.ExecuteNonQuery();
                EntryIntoSession(registerViewModel.UserName, registerViewModel.ClassName);
                //Přidá Pedagoga do session
                if (registerViewModel.AdminKey == "9qf+TZ")
                {
                    EntryIntoSessionRole("pedagog");
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

        public void EntryIntoSession(string userName,string className)
        {
            HttpContext.Session.SetString("UserName", userName);
            HttpContext.Session.SetString("ClassName", className);
        }
        public void EntryIntoSessionRole(string role)
        {
            HttpContext.Session.SetString("Role", role);
        }



        //LOGIN
        [HttpPost]
        public IActionResult Login(LoginViewModel loginViewModel)
        {
            string className;
            string role;
            string hashPassword;
            bool IsPasswordValid;
            //string connectionString = ConfigurationManager.ConnectionStrings["ConnectionStrings:DefaultConnection"].ConnectionString;
            using SqlConnection sqlConnection = new SqlConnection(connectionString);
            //string sqlQuery = "SELECT UserName,Password from [UserTable] where UserName=@UserName and Password=@Password";
            string sqlQueryHash = "SELECT Password,Role,ClassName from UserTable where [UserName] = @UserName";
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(sqlQueryHash, sqlConnection);
            sqlCommand.Parameters.AddWithValue("@UserName", loginViewModel.UserName);

            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                hashPassword = sqlDataReader["Password"].ToString();
                role = sqlDataReader["Role"].ToString();
                className = sqlDataReader["ClassName"].ToString();

                IsPasswordValid = BCrypt.Net.BCrypt.Verify(loginViewModel.Password, hashPassword);
                if (IsPasswordValid)
                {
                    //string jmeno = sqlDataReader["UserName"].ToString();
                    //Session["userID"] = loginViewModel.UserName;
                    EntryIntoSession(loginViewModel.UserName,className);
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
            TempData["Message"] = "Logout";
            HttpContext.Session.Clear();
            HttpContext.Session.Remove("UserName");
            HttpContext.Session.Remove("Role");
            HttpContext.Session.Remove("ClassName");
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
