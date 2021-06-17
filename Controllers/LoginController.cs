using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using MVCProject.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace MVCProject.Controllers
{
    public class LoginController : Controller
    {
        private IConfiguration cfg;
        public LoginController(IConfiguration configuration)
        {
            cfg = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(LoginViewModel loginViewModel)
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
                    ViewData["Message"] = "Přihlášení selhalo";
                }
            }
            sqlConnection.Close();
            return View(); 
        }
        public void EntryIntoSession(string userName)
        {
            HttpContext.Session.SetString("UserName", userName);
        }
    }
}
