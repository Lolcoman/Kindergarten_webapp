using Microsoft.AspNetCore.Http;
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
using Microsoft.AspNetCore.Authorization;

namespace MVCProject.Controllers
{
    [Route("api/Score")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        //SqlConnection sqlConnection = new SqlConnection("Server=tcp:sqlusersdb.database.windows.net,1433;Initial Catalog=UsersDB;Persist Security Info=False;User ID=kozami01;Password=sql123?!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

        [HttpPost("[action]")]
        public IActionResult Save([FromBody] Score score)
        {
            string lowerClassName;
            //získání uživatele ze session
            var name = HttpContext.Session.GetString("UserName");
            var className = HttpContext.Session.GetString("ClassName");
            //převedení na malé písmena třída
            if (className == null)
            {
                return BadRequest("Chyba");
            }
            else
            {
                string accentedStr = className;
                byte[] tempBytes;
                tempBytes = System.Text.Encoding.GetEncoding("ISO-8859-8").GetBytes(accentedStr);
                lowerClassName = System.Text.Encoding.UTF8.GetString(tempBytes);
            }
            if (name == null)
            {
                return BadRequest("Chyba");
            }
            SqlCommand command = new SqlCommand();
            DateTime mydateTime = DateTime.Now;
            TimeZoneInfo tz = TimeZoneInfo.FindSystemTimeZoneById("Central Europe Standard Time");
            DateTime date2 = TimeZoneInfo.ConvertTime(mydateTime, tz);
            string sqlDate = date2.ToString("G");
            //string sqlDate = mydateTime.Date.ToString("yyyy-MM-dd HH:mm:ss");
            DateTime myDate = DateTime.Parse(sqlDate);

            using SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB");
            command.Connection = sqlConnection;
            //JArray array = (JArray)ojObject["chats"];
            //int id = Convert.ToInt32(array[0].ToString());
            //string query = "INSERT into UserTable(UserName) VALUES('"+value+"')",connection);
            //SqlCommand command = new SqlCommand($"UPDATE [UserTable] SET Maze = ('{score.score}'), DateTime = ('{sqlDate}') WHERE UserName = @UserName", sqlConnection);
            if (score.game == "Kvíz")
            {
                command.CommandText = $"INSERT INTO [ScoreTable](UserName,ClassName,Moves,Games,DateTime,CorrectAnswer,Question) VALUES (@UserName,@ClassName,@Score,@Game,@DateTime,@CorrectAnswer,@Question)";
                command.Parameters.AddWithValue("@UserName", name);
                command.Parameters.AddWithValue("@ClassName", lowerClassName);
                command.Parameters.AddWithValue("@Score", score.score);
                command.Parameters.AddWithValue("@Game", score.game);
                command.Parameters.AddWithValue("@DateTime", myDate);
                command.Parameters.AddWithValue("@CorrectAnswer", score.correctAnswer);
                command.Parameters.AddWithValue("@Question", score.question);
            }
            if (score.game == "Bludiště")
            {
                command.CommandText = $"INSERT INTO [ScoreTable](UserName,ClassName,Moves,Games,DateTime,CorrectAnswer,Question) VALUES (@UserName,@ClassName,@Score,@Game,@DateTime,@CorrectAnswer,@Question)";
                command.Parameters.AddWithValue("@UserName", name);
                command.Parameters.AddWithValue("@ClassName", lowerClassName);
                command.Parameters.AddWithValue("@Score", score.score);
                command.Parameters.AddWithValue("@Game", score.game);
                command.Parameters.AddWithValue("@DateTime", myDate);
                command.Parameters.AddWithValue("@CorrectAnswer", 0);
                command.Parameters.AddWithValue("@Question", 0);
            }
            if (score.game == "Pexeso")
            {
                command.CommandText = $"INSERT INTO [ScoreTable](UserName,ClassName,Moves,Games,DateTime,CorrectAnswer,Question) VALUES (@UserName,@ClassName,@Score,@Game,@DateTime,@CorrectAnswer,@Question)";
                command.Parameters.AddWithValue("@UserName", name);
                command.Parameters.AddWithValue("@ClassName", lowerClassName);
                command.Parameters.AddWithValue("@Score", score.score);
                command.Parameters.AddWithValue("@Game", score.game);
                command.Parameters.AddWithValue("@DateTime", myDate);
                command.Parameters.AddWithValue("@CorrectAnswer", 0);
                command.Parameters.AddWithValue("@Question", 0);
            }
            try
            {
                sqlConnection.Open();
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
                sqlConnection.Close();
            }
        }
    }
}
