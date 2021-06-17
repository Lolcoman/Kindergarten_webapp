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

namespace MVCProject.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(LoginViewModel loginViewModel)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["ConnectionStrings:DefaultConnection"].ConnectionString;
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            string sqlQuery = "SELECT UserName,Password from [UserTable] where UserName=@UserName and Password=@Password";
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(sqlQuery, sqlConnection);
            sqlCommand.Parameters.AddWithValue("@UserName", loginViewModel.UserName);
            sqlCommand.Parameters.AddWithValue("@Password", loginViewModel.Password);
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            if (sqlDataReader.Read())
            {
                EntryIntoSession(loginViewModel.UserName);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ViewData["Message"] = "Přihlášení selhalo";
            }
            sqlConnection.Close();
            return View(); 
        }
        public void EntryIntoSession(string userName)
        {
            HttpContext.Session.SetString("UserName", userName);
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }
    }
}
