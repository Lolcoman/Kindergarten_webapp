using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MVCProject.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        SqlCommand command = new SqlCommand();
        SqlConnection sqlConnection = new SqlConnection("Server=tcp:sqlusersdb.database.windows.net,1433;Initial Catalog=UsersDB;Persist Security Info=False;User ID=kozami01;Password=sql123?!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
        //test API
        public IActionResult Get()
        {
            return Ok("File Upload API running...");
        }

        [HttpPost("[action]")]
        //[HttpPost]
        //[Route("upload")]
        public IActionResult Upload(IFormFile file)
        {
            //zmenšení obrázku
            var image = Image.FromStream(file.OpenReadStream());
            var resizedImg = new Bitmap(image, new Size(100, 100));

            var fileName = Path.GetFileName(file.FileName);
            var fileExtension = Path.GetExtension(fileName);
            var newFileName = String.Concat(Convert.ToString(Guid.NewGuid()), fileExtension);

            //UPRAVIT
            using (var imageStream = new MemoryStream())
            {
                file.CopyTo(imageStream);

                SqlCommand command = new SqlCommand($"INSERT INTO [PexesoTable](Image) VALUES (@image)", sqlConnection);
                command.Parameters.AddWithValue("@image", newFileName);
            }
            //resizedImg.Save(imageStream, ImageFormat.Jpeg);
            //var imageBytes = imageStream.ToArray();
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

            //if (fileExtension == ".jpg" || fileExtension == ".png")
            //{
            //    return Ok();
            //}
            //return Ok();
        }
    }
}
