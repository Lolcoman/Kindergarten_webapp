using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MVCProject.Services;
using System;
using System.Data.SqlClient;

namespace MVCProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteFileController : Controller
    {
        private readonly SqlConnectionFactory _factory;
        public DeleteFileController(SqlConnectionFactory factory)
        {
            _factory = factory;
        }
        //smazání PEXESA z databáze
        [HttpPost("[action]")]
        public IActionResult PexDelete([FromQuery] string name)
        {
            using SqlConnection sqlConn = _factory.CreateConnection();
            string sqlQuery = $"DELETE FROM [PexesoTable] WHERE Name = @Name";
            SqlCommand sqlCommand = new SqlCommand(sqlQuery, sqlConn);
            sqlCommand.Parameters.AddWithValue("@Name", name);
            try
            {
                if (HttpContext.Session.GetString("Role") != "pedagog")
                {
                    throw new Exception();
                }
                sqlConn.Open();
                sqlCommand.ExecuteNonQuery();
                return Ok();
            }
            //catch (SqlException ex)
            //{
            //    Console.WriteLine("Error Generated. Details: " + ex.ToString());
            //    //return BadRequest();
            //    return Problem(statusCode: 400, title: "SQL errorr" + ex.ToString());
            //}
            catch (Exception e)
            {
                Console.WriteLine("You are not authorized: " + e.ToString());
                return Problem(statusCode: 400, title: "Nejste přihlášen jako pedagog!");
            }
            finally
            {
                sqlConn.Close();
            }
        }
        //smazání Kvízu z databáze
        [HttpPost("[action]")]
        public IActionResult QuizDelete([FromQuery] string name)
        {
            using SqlConnection sqlConn = _factory.CreateConnection();
            string sqlQuery = $"DELETE FROM [QuizTable] WHERE Name = @Name";
            SqlCommand sqlCommand = new SqlCommand(sqlQuery, sqlConn);
            sqlCommand.Parameters.AddWithValue("@Name", name);
            try
            {
                if (HttpContext.Session.GetString("Role") != "pedagog")
                {
                    throw new Exception();
                }
                sqlConn.Open();
                sqlCommand.ExecuteNonQuery();
                return Ok();
            }
            //catch (SqlException ex)
            //{
            //    Console.WriteLine("Error Generated. Details: " + ex.ToString());
            //    //return BadRequest();
            //    return Problem(statusCode: 400, title: "SQL errorr" + ex.ToString());
            //}
            catch (Exception e)
            {
                Console.WriteLine("You are not authorized: " + e.ToString());
                return Problem(statusCode: 400, title: "Nejste přihlášen jako pedagog!");
            }
            finally
            {
                sqlConn.Close();
            }
        }
    }
}
