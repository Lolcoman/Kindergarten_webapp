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
            //Ověření zda již uživetel je v databázi, ověří duplicitní jméno a email
            SqlConnection sql = new SqlConnection(@"Server=tcp:sqlusersdb.database.windows.net,1433;Initial Catalog=UsersDB;Persist Security Info=False;User ID=kozami01;Password=sql123?!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            string uQuery = $"SELECT * FROM [UserTable] WHERE UserName = @UserName OR Email = @email";
            SqlCommand command1 = new SqlCommand(uQuery, sql);
            command1.Parameters.AddWithValue("@UserName", registerViewModel.UserName);
            command1.Parameters.AddWithValue("@email", registerViewModel.Email);
            bool IsExist = help.IsUserExist(command1,sql);
            if (IsExist == true)
            {
                ViewBag.Exist = "Jméno nebo email již existují!";
                return View();
            }
            //Kryptování hesla pomocí BCrypt
            string CrypPassword = registerViewModel.Password;
            CrypPassword = BCrypt.Net.BCrypt.HashPassword(CrypPassword);


            //string query = "INSERT INTO [UserTable](UserName,Email,Password) VALUES (@username, @email, @password)";
            uQuery = "INSERT INTO [UserTable](UserName,Email,Password) VALUES (@username, @email, @password)";
            SqlCommand command = new SqlCommand(uQuery,sql);
            command.Parameters.AddWithValue("@username", registerViewModel.UserName);
            command.Parameters.AddWithValue("@email", registerViewModel.Email);
            command.Parameters.AddWithValue("@password", CrypPassword); 
            try
            {
                sql.Open();
                command.ExecuteNonQuery();
                EntryIntoSession(registerViewModel.UserName);
                return RedirectToAction("Index", "Home");
            }
            catch (SqlException e)
            {
                Console.WriteLine("Error Generated. Details: " + e.ToString());
            }
            finally
            {
                sql.Close();
            }



            //string query = "Insert into [UserTable](UserName,Email,Password)" + $"values('{registerViewModel.UserName}','{registerViewModel.Email}','{CrypPassword}')";

           //int result = help.DMLTransaction(query);
            //Pokud je hodnota větší než 0, data se uloží do databáze
            //if (result > 0)
            //{
            //    EntryIntoSession(registerViewModel.UserName);
            //    return RedirectToAction("Index", "Home");
            //}
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
                    //Session["userID"] = loginViewModel.UserName;
                    EntryIntoSession(loginViewModel.UserName);
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


        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            HttpContext.Session.Remove("UserName");
            return RedirectToAction("MainPage", "Home");
        }
    }
}
