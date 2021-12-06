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
using System.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace MVCProject.Controllers
{
    public class HomeController : Controller
    {
        SqlCommand command = new SqlCommand();
        SqlDataReader dr;
        List<Data> datas = new List<Data>();
        SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB");

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
            SelectFromDB();
            return View();
        }

        public IActionResult MainPage()
        {
            ViewBag.Name = HttpContext.Session.GetString("UserName");
            return View();
        }
        //získání dat z DB pro select Pexeso
        public void SelectFromDB()
        {
            try
            {
                string query = "SELECT DISTINCT Name FROM PexesoTable";
                SqlCommand sqlcomm = new SqlCommand(query, sqlConnection);
                sqlConnection.Open();
                SqlDataAdapter sda = new SqlDataAdapter(sqlcomm);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                ViewBag.gameName = ds.Tables[0];

                List<SelectListItem> gameName = new List<SelectListItem>();

                foreach (DataRow dr in ViewBag.gameName.Rows)
                {
                    gameName.Add(new SelectListItem { Text = @dr["Name"].ToString(),Value= @dr["Name"].ToString() });
                }
                ViewBag.gameName = gameName;
                sqlConnection.Close();
            }
            catch (Exception e)
            {
                //Error();
                Console.WriteLine(e);
                throw;
            }
        }
        //získání dat z DB pro tabulku výsledků
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
