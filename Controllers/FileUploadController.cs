using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
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
        //SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB;");
        [HttpPost("[action]")]
        public IActionResult Upload([FromForm]List<IFormFile> files, [FromForm] string name)
        {
            int i;
            SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB;");
            try
            {
                if (name == "")
                {
                    return BadRequest("Žádné jméno");
                }
                if (files.Count == 0)
                {
                    return BadRequest("Žádný soubor");
                }
                //var file = Request.Form.Files[0];
                //Kontrola pouze .jpg a .png
                foreach (var file in files)
                {   
                    string ext = Path.GetExtension(file.FileName);
                    string extLower = ext.ToLower();
                    if (IsImage(extLower))
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
                    var resizedImg = new Bitmap(image, new Size(215, 215)); //zmenšení obrázku

                    var img = ImageToByteArray(resizedImg); //převod obrázku na ByteArray
                    SqlCommand command = new SqlCommand($"INSERT INTO [PexesoTable](Image,Name) VALUES (@image,@name)", sqlConnection);
                    command.Parameters.AddWithValue("@image", img);
                    command.Parameters.AddWithValue("@name", name);
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
        public List<string> Download([FromQuery] string name)
        {
            SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB;");
            SqlCommand command = new SqlCommand($"SELECT Image FROM PexesoTable WHERE Name = @name", sqlConnection);
            //"SELECT Password from UserTable where [UserName] = @UserName";
            command.Parameters.AddWithValue("@name",name);
            try
            {
                List<string> list = new List<string>();
                List<Image> photoList = new List<Image>();
                sqlConnection.Open();
                byte[] imgArray;
                Image fullImage;
                dr = command.ExecuteReader();
                var memory = new MemoryStream();
                int i = dr.FieldCount;
                bool b = dr.HasRows;
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        //jen test musí se ještě vyselectovat podle názvu hry jaké obrázky stáhnout
                        //dr.Read();
                        imgArray = (byte[])dr["Image"];
                        fullImage = ByteArrayToImage(imgArray);
                        string imgString = Convert.ToBase64String(imgArray);
                        list.Add(imgString);

                        fullImage.Save(memory, ImageFormat.Png);

                        photoList.Add(fullImage);
                        //memory.Position = 0;
                    }
                }
                Image[] imagesArray;
                //imagesArray = File.ReadAllLines(memory);
                imagesArray = photoList.ToArray();
                return list;
                //return File(memory.ToArray(),"image/png");
            }
            //catch (SqlException e)
            //{
            //    return BadRequest("Error Generated. Details: " + e.ToString());
            //}
            finally
            {
                sqlConnection.Close();
                dr.Close();
            }
        }
    }
}
