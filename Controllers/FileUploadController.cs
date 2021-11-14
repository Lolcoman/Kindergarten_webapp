using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;

namespace MVCProject.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        SqlDataReader dr;
        SqlCommand command = new SqlCommand();
        SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB;");
        //test API
        public IActionResult Get()
        {
            return Ok("File Upload API running...");
        }

        [HttpPost("[action]")]
        //[HttpPost]
        //[Route("upload")]
        public IActionResult Upload(IFormCollection uploadFiles)
        {
            var files = HttpContext.Request.Form.Files;
            int i;
            try
            {
                if (files.Count == 0)
                {
                    return BadRequest("Žádný soubor");
                }
                //var filee = Request.Form.Files[0];
                //Kontrola pouze .jpg a .png
                foreach (var file in files)
                {   
                    string ext = Path.GetExtension(file.FileName);
                    if (IsImage(ext))
                    {
                        continue;
                    }
                    else
                    {
                        return BadRequest("Špatný formát");
                    }
                }
                sqlConnection.Open(); //první otevření SQL
                foreach (var file in files)
                {
                    var image = Image.FromStream(file.OpenReadStream()); //načtení do StreamReaderu
                    var resizedImg = new Bitmap(image, new Size(100, 100)); //zmenšení obrázku

                    var img = ImageToByteArray(resizedImg); //převod obrázku na ByteArray
                    SqlCommand command = new SqlCommand($"INSERT INTO [PexesoTable](Image) VALUES (@image)", sqlConnection);
                    command.Parameters.AddWithValue("@image", img);
                    i = command.ExecuteNonQuery();
                }
                return Ok("Data uložena");
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
            SqlCommand command = new SqlCommand($"SELECT Image from PexesoTable", sqlConnection);
            //"SELECT Password from UserTable where [UserName] = @UserName";
            //command.Parameters.AddWithValue("@image", );
            try
            {
                sqlConnection.Open();
                byte[] imgArray;
                Image fullImage;
                dr = command.ExecuteReader();
                var memory = new MemoryStream();
                int i = dr.FieldCount;
                while (dr.Read())
                {
                    //dr.Read();
                    imgArray = (byte[])dr["Image"];
                    fullImage = ByteArrayToImage(imgArray);
                    
                    fullImage.Save(memory, ImageFormat.Png);
                    //memory.Position = 0;
                }
                //dr.Read();
                //imgArray = (byte[])dr["Image"];
                //fullImage = ByteArrayToImage(imgArray);

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
                return File(memory.ToArray(),"image/png");
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
