﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MVCProject.Services;
using System;
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
        private readonly SqlConnectionFactory _factory;
        public FileUploadController(SqlConnectionFactory factory)
        {
            _factory = factory;
        }

        [HttpPost("[action]")]
        public IActionResult Upload([FromForm] List<IFormFile> files, [FromForm] string name)
        {
            int i;
            using SqlConnection sqlConnection = _factory.CreateConnection();
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
                    var resizedImg = new Bitmap(image, new Size(140, 140)); //zmenšení obrázku

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
            using SqlConnection sqlConnection = _factory.CreateConnection();
            SqlCommand command = new SqlCommand($"SELECT Image FROM PexesoTable WHERE Name = @name", sqlConnection);
            command.Parameters.AddWithValue("@name", name);
            sqlConnection.Open();
            using var dr = command.ExecuteReader();
            try
            {
                List<string> list = new List<string>();
                List<Image> photoList = new List<Image>();
                byte[] imgArray;
                Image fullImage;
                var memory = new MemoryStream();
                int i = dr.FieldCount;
                bool b = dr.HasRows;
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        //jen test musí se ještě vyselectovat podle názvu hry jaké obrázky stáhnout
                        imgArray = (byte[])dr["Image"];
                        fullImage = ByteArrayToImage(imgArray);
                        string imgString = Convert.ToBase64String(imgArray);
                        list.Add(imgString);

                        fullImage.Save(memory, ImageFormat.Png);

                        photoList.Add(fullImage);
                    }
                }
                Image[] imagesArray;
                //imagesArray = File.ReadAllLines(memory);
                imagesArray = photoList.ToArray();
                return list;
                //return File(memory.ToArray(),"image/png");
            }
            finally
            {
                sqlConnection.Close();
                dr.Close();
            }
        }
    }
}
