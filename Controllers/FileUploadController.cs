using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace MVCProject.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        SqlDataReader dr;
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
        public IActionResult Upload(List<IFormFile> file)
        {
            //string ext = Path.GetExtension(file.FileName);
            //zmenšení obrázku

            

            //var fileName = Path.GetFileName(file.FileName);
            //var fileExtension = Path.GetExtension(fileName);

            //var newFileName = String.Concat(Convert.ToString(Guid.NewGuid()), fileExtension);

            //byte[] imgArray = new byte[file.Length];

            //UPRAVIT
            //using (var imageStream = new MemoryStream())
            //{
            //    var imageStream = new MemoryStream()
            //    file.CopyTo(imageStream);
            //    var fileBytes = imageStream.ToArray();
            //    string img = Convert.ToBase64String(fileBytes);
            //}

            //resizedImg.Save(imageStream, ImageFormat.Jpeg);
            //var imageBytes = imageStream.ToArray();
            try
            {
                foreach (var item in file)
                {
                    string ext = Path.GetExtension(item.FileName);
                    if (IsImage(ext))
                    {
                        var image = Image.FromStream(item.OpenReadStream());
                        var resizedImg = new Bitmap(image, new Size(100, 100));

                        var img = ImageToByteArray(resizedImg);
                        SqlCommand command = new SqlCommand($"INSERT INTO [PexesoTable](Image) VALUES (@image)", sqlConnection);
                        command.Parameters.AddWithValue("@image", img);
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
                }
                return BadRequest("Špatný formát");
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

        //Převod obrázku na byte[]
        public byte[] ImageToByteArray(Image imageInside)
        {
            MemoryStream ms = new MemoryStream();
            imageInside.Save(ms, ImageFormat.Jpeg);
            return ms.ToArray();
        }
        //Převod byte[] na obrázek
        public Image ByteArrayToImage(byte[] byteArray)
        {
            MemoryStream ms = new MemoryStream(byteArray);
            Image returnImage = Image.FromStream(ms);
            return returnImage;
        }
        //Validace obrázku
        public bool IsImage(string fileName)
        {
            var fileExtension = Path.GetExtension(fileName);
            if (fileExtension == ".jpg" || fileExtension == ".png")
            {
                return true;
            }
            return false;
        }

        //download obrázku z databáze
        [HttpGet("[action]")]
        public IActionResult Download()
        {
            SqlCommand command = new SqlCommand($"SELECT Image from PexesoTable WHERE Id = 1", sqlConnection);
            //"SELECT Password from UserTable where [UserName] = @UserName";
            //command.Parameters.AddWithValue("@image", );
            try
            {
                sqlConnection.Open();
                byte[] imgArray;
                Image fullImage;
                dr = command.ExecuteReader();
                dr.Read();
                imgArray = (byte[])dr["Image"];
                fullImage = ByteArrayToImage(imgArray);
                //while (dr.Read())
                //{
                //    imgArray = (byte[])dr["Image"];
                //    fullImage = ByteArrayToImage(imgArray);

                //    return Ok();
                //    //return (IActionResult)fullImage;
                //}
                //int i = command.ExecuteNonQuery();
                //EntryIntoSession(registerViewModel.UserName);
                //return RedirectToAction("Index", "Home");
                //if (i == 1)
                //{
                //    return Ok("Data uložena");
                //}
                //else
                //{
                //    return BadRequest("Chyba");
                //}
                var streak = new MemoryStream();
                fullImage.Save(streak, ImageFormat.Png);
                return File(streak.ToArray(),"image/png");
            }
            catch (SqlException e)
            {
                return BadRequest("Error Generated. Details: " + e.ToString());
            }
            finally
            {
                sqlConnection.Close();
                dr.Close();
            }
        }
    }
}
