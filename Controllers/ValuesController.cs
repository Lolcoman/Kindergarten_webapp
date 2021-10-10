﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using MVCProject.DBHelps;
using MVCProject.Models;
using Newtonsoft.Json.Serialization;
using System.Web;
using Newtonsoft.Json.Linq;

namespace MVCProject.Controllers
{
    [Route("api/Score")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        SqlConnection connection = new SqlConnection(@"Server=tcp:sqlusersdb.database.windows.net,1433;Initial Catalog=UsersDB;Persist Security Info=False;User ID=kozami01;Password=sql123?!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

        [HttpPost("[action]")]
        public IActionResult Save([FromBody] Score score)
        {
            //JArray array = (JArray)ojObject["chats"];
            //int id = Convert.ToInt32(array[0].ToString());
            //string query = "INSERT into UserTable(UserName) VALUES('"+value+"')",connection);
            SqlCommand command = new SqlCommand($"INSERT into UserTable(UserName) VALUES('{score.score}')", connection);
            //command.Parameters.AddWithValue("@username", registerViewModel.UserName);
            try
            {
                connection.Open();
                int i = command.ExecuteNonQuery();
                //EntryIntoSession(registerViewModel.UserName);
                //return RedirectToAction("Index", "Home");
                if (i == 1)
                {
                    return Ok("Data uložena");
                }
                else
                {
                    return BadRequest("Chyba");
                }
            }
            catch (SqlException e)
            {
                return BadRequest("Error Generated. Details: " + e.ToString());
            }
            finally
            {
                connection.Close();
            }
        }


    }
}