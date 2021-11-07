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
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;

namespace MVCProject.Controllers
{
    public class HomeController : Controller
    {
        SqlCommand command = new SqlCommand();
        SqlDataReader dr;
        List<Data> datas = new List<Data>();  
        SqlConnection sqlConnection = new SqlConnection("Server=tcp:sqlusersdb.database.windows.net,1433;Initial Catalog=UsersDB;Persist Security Info=False;User ID=kozami01;Password=sql123?!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

        //pro debug při logování
        //private readonly ILogger<HomeController> _logger;

        //public HomeController(ILogger<HomeController> logger)
        //{
        //    _logger = logger;
        //}


        public IActionResult Index()
        {
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

        public IActionResult MemoryCreate()
        {
            return View();
        }

        public IActionResult MainPage()
        {
            ViewBag.Name = HttpContext.Session.GetString("UserName");
            return View();
        }
        //získání dat z databáze
        private void FillData()
        {
            var name = HttpContext.Session.GetString("UserName");
            if (datas.Count > 0)
            {
                datas.Clear();
            }
            try
            {
                sqlConnection.Open();
                command.Connection = sqlConnection;
                //command.CommandText = "SELECT TOP (1000) [UserName],[Email],[Maze],[Pexeso],[Quiz],[DateTime] FROM [dbo].[UserTable]";
                //command.CommandText = "SELECT UserName,Email,Maze,Quiz,Pexeso,DateTime FROM UserTable WHERE UserName = @UserName";
                //TADY BUDE ROLE!!!
                if (name == "admin")
                {
                    command.CommandText = "SELECT UserName,Moves,Games,DateTime FROM ScoreTable";
                }
                else
                {
                    command.CommandText = "SELECT UserName,Moves,Games,DateTime FROM ScoreTable WHERE UserName = @UserName";
                }
                command.Parameters.AddWithValue("@UserName", name);
                dr = command.ExecuteReader();
                //while (dr.Read())
                //{
                //    datas.Add(new Data() { UserName = dr["UserName"].ToString()
                //    ,Email = dr["Email"].ToString()
                //    ,Maze = dr["Maze"].ToString()
                //    ,Pexeso = dr["Pexeso"].ToString()
                //    ,Quiz = dr["Quiz"].ToString()
                //    ,DateTime = dr["DateTime"].ToString()
                //    });
                //}
                while (dr.Read())
                {
                    datas.Add(new Data()
                    {
                        UserName = dr["UserName"].ToString()
                    ,
                        Moves = dr["Moves"].ToString()
                    ,
                        Games = dr["Games"].ToString()
                    ,
                        DateTime = dr["DateTime"].ToString()
                    });
                }
                ViewData["Data"] = datas;
                sqlConnection.Close();
            }
            catch (Exception e)
            {
                //Error();
                Console.WriteLine(e);
                throw;
            }
        }
        public IActionResult Table()
        {
            FillData();
            return View("Scores/Table",datas);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
