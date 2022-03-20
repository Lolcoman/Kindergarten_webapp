using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MVCProject.Models;
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
    public class QuizController : ControllerBase
    {
        private IConfiguration cfg;
        string connectionString;
        public QuizController(IConfiguration configuration)
        {
            cfg = configuration;
            connectionString = cfg["ConnectionStrings:DefaultConnection"];
        }
        SqlDataReader dr;
        SqlCommand command = new SqlCommand();
        //test API
        public IActionResult Get()
        {
            return Ok("File Upload API running...");
        }

        [HttpPost("[action]")]
        //[HttpPost]
        //[Route("upload")]
        public IActionResult QuizUpload([FromForm] List<IFormFile> files, [FromForm] string name)
        {
            byte[] img, question;
            Image image, resizedImg;
            int i;
            using SqlConnection sqlConnection = new SqlConnection(connectionString);
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
                SqlCommand command = new SqlCommand($"INSERT INTO [QuizTable](question,answer,wrongOne,wrongTwo,name) VALUES (@question,@answer,@wrongOne,@wrongTwo,@name)", sqlConnection);
                for (int j = 0; j < files.Count; j++)
                {
                    switch (j)
                    {
                        case 0:
                            image = Image.FromStream(files[j].OpenReadStream());
                            resizedImg = new Bitmap(image, new Size(170, 170));
                            img = ImageToByteArray(resizedImg);
                            question = img;
                            command.Parameters.AddWithValue("@question", question);
                            break;
                        case 1:
                            image = Image.FromStream(files[j].OpenReadStream());
                            resizedImg = new Bitmap(image, new Size(170, 170));
                            img = ImageToByteArray(resizedImg);
                            question = img;
                            command.Parameters.AddWithValue("@answer", question);
                            break;
                        case 2:
                            image = Image.FromStream(files[j].OpenReadStream());
                            resizedImg = new Bitmap(image, new Size(170, 170));
                            img = ImageToByteArray(resizedImg);
                            question = img;
                            command.Parameters.AddWithValue("@wrongOne", question);
                            break;
                        case 3:
                            image = Image.FromStream(files[j].OpenReadStream());
                            resizedImg = new Bitmap(image, new Size(170, 170));
                            img = ImageToByteArray(resizedImg);
                            question = img;
                            command.Parameters.AddWithValue("@wrongTwo", question);
                            break;
                        default:
                            break;
                    }
                }
                command.Parameters.AddWithValue("@name", name);
                i = command.ExecuteNonQuery();
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
        public List<Question> QuizDownload([FromQuery] string name)
        {
            using SqlConnection sqlConnection = new SqlConnection(connectionString);
            SqlCommand command = new SqlCommand($"SELECT question,answer,wrongOne,wrongTwo FROM QuizTable WHERE Name = @name", sqlConnection);
            command.Parameters.AddWithValue("@name", name);
            try
            {
                var questionList = new List<Question>();
                sqlConnection.Open();
                byte[] question, answer, wrongOne, wrongTwo;
                dr = command.ExecuteReader();
                var memory = new MemoryStream();
                bool b = dr.HasRows;
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        question = (byte[])dr["question"];
                        answer = (byte[])dr["answer"];
                        wrongOne = (byte[])dr["wrongOne"];
                        wrongTwo = (byte[])dr["wrongTwo"];
                        string questionString = Convert.ToBase64String(question);
                        string answerString = Convert.ToBase64String(answer);
                        string wrongOneString = Convert.ToBase64String(wrongOne);
                        string wrongTwoString = Convert.ToBase64String(wrongTwo);
                        questionList.Add(new Question
                        {
                            question = questionString,
                            correct = answerString,
                            wrongOne = wrongOneString,
                            wrongTwo = wrongTwoString
                        });
                    }
                }
                return questionList;
            }
            finally
            {
                sqlConnection.Close();
                dr.Close();
            }
        }
    }
}
