﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MVCProject.Models;
using MVCProject.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace MVCProject.Controllers
{
    public class HomeController : Controller
    {
        SqlCommand command = new SqlCommand();
        SqlDataReader dr;
        List<Data> datas = new List<Data>();
        string role;
        private readonly SqlConnectionFactory _factory;
        public HomeController(SqlConnectionFactory factory)
        {
            _factory = factory;
        }

        public IActionResult Manual()
        {
            return View();
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Draw()
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

        public IActionResult Memory()
        {
            return View();
        }

        public IActionResult MemoryCreate()
        {
            string name = "memory";
            SelectFromDB(name);
            return View();
        }
        public IActionResult Quiz()
        {
            string name = "quiz";
            SelectFromDB(name);
            return View();
        }
        public IActionResult MainPage()
        {
            ViewBag.Name = HttpContext.Session.GetString("UserName");
            return View();
        }
        //získání dat z DB pro select Pexeso
        public void SelectFromDB(string name)
        {
            using SqlConnection sqlConnection = _factory.CreateConnection();
            try
            {
                string query = "";
                if (name == "memory")
                {
                    query = "SELECT DISTINCT Name FROM PexesoTable";
                }
                if (name == "quiz")
                {
                    query = "SELECT DISTINCT Name FROM QuizTable";
                }
                SqlCommand sqlcomm = new SqlCommand(query, sqlConnection);
                sqlConnection.Open();
                SqlDataAdapter sda = new SqlDataAdapter(sqlcomm);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                ViewBag.gameName = ds.Tables[0];

                List<SelectListItem> gameName = new List<SelectListItem>();

                foreach (DataRow dr in ViewBag.gameName.Rows)
                {
                    gameName.Add(new SelectListItem { Text = @dr["Name"].ToString(), Value = @dr["Name"].ToString() });
                }
                ViewBag.gameName = gameName;
                //ViewBag.countQuestion = gameName.Count;
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
            using SqlConnection sqlConnection = _factory.CreateConnection();
            //načtení role z databáze
            string name = HttpContext.Session.GetString("UserName");
            string className = HttpContext.Session.GetString("ClassName");
            string accentedStr = className;
            byte[] tempBytes;
            tempBytes = System.Text.Encoding.GetEncoding("ISO-8859-8").GetBytes(accentedStr);
            string lowerClassName = System.Text.Encoding.UTF8.GetString(tempBytes);
            string selectSql = "SELECT UserName,ClassName,Role FROM UserTable WHERE UserName = @name";
            SqlCommand com = new SqlCommand(selectSql, sqlConnection);
            com.Parameters.AddWithValue("@name", name);
            try
            {
                sqlConnection.Open();
                using (SqlDataReader read = com.ExecuteReader())
                {
                    while (read.Read())
                    {
                        role = (read["Role"].ToString());
                    }
                }
                sqlConnection.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }


            if (datas.Count > 0)
            {
                datas.Clear();
            }
            try
            {
                sqlConnection.Open();
                command.Connection = sqlConnection;
                //TADY JE ROLE!!!
                if (role == "pedagog")
                {
                    command.CommandText = "SELECT UserName,ClassName,Moves,Games,DateTime,CorrectAnswer,Question FROM ScoreTable WHERE ClassName = @ClassName";
                    command.Parameters.AddWithValue("@ClassName", lowerClassName);
                }
                else
                {
                    command.CommandText = "SELECT UserName,ClassName,Moves,Games,DateTime,CorrectAnswer,Question FROM ScoreTable WHERE UserName = @UserName";
                }
                command.Parameters.AddWithValue("@UserName", name);
                dr = command.ExecuteReader();
                //naplnění tabulky výsledků z databáze
                while (dr.Read())
                {
                    datas.Add(new Data()
                    {
                        UserName = dr["UserName"].ToString()
                    ,
                        ClassName = dr["ClassName"].ToString()
                    ,
                        Moves = dr["Moves"].ToString()
                    ,
                        Games = dr["Games"].ToString()
                    ,
                        DateTime = dr["DateTime"].ToString()
                    ,
                        CorrectAnswer = dr["CorrectAnswer"].ToString()
                    ,
                        Question = dr["Question"].ToString()
                    });
                }
                ViewData["Data"] = datas;
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
            return View("Scores/Table", datas);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
