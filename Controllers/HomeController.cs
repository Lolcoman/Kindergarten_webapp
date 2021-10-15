using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MVCProject.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace MVCProject.Controllers
{
    public class HomeController : Controller
    {
        SqlCommand command = new SqlCommand();
        SqlDataReader dr;
        List<Data> datas = new List<Data>();  
        SqlConnection sqlConnection = new SqlConnection("Server=tcp:sqlusersdb.database.windows.net,1433;Initial Catalog=UsersDB;Persist Security Info=False;User ID=kozami01;Password=sql123?!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ViewBag.Name = HttpContext.Session.GetString("UserName");
            return View();
        }

        public IActionResult Maze()
        {
            return View();
        }

        public IActionResult MazeSelector()
        {
            return View();
        }

        public IActionResult Quiz()
        {
            return View();
        }

        public IActionResult Memory()
        {
            return View();
        }

        public IActionResult MainPage()
        {
            return View();
        }
        //získání dat z databáze
        private void FillData()
        {
            if (datas.Count > 0)
            {
                datas.Clear();
            }
            try
            {
                sqlConnection.Open();
                command.Connection = sqlConnection;
                command.CommandText = "SELECT TOP (1000) [UserName],[Email],[Maze],[Pexeso],[Quiz],[DateTime] FROM [dbo].[UserTable]";
                dr = command.ExecuteReader();
                while (dr.Read())
                {
                    datas.Add(new Data() { UserName = dr["UserName"].ToString()
                    ,Email = dr["Email"].ToString()
                    ,Maze = dr["Maze"].ToString()
                    ,Pexeso = dr["Pexeso"].ToString()
                    ,Quiz = dr["Quiz"].ToString()
                    ,DateTime = dr["DateTime"].ToString()
                    
                    });
                }
                sqlConnection.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        public IActionResult Table()
        {
            FillData();
            return View(datas);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
