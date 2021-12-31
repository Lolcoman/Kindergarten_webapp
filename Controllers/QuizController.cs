using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        SqlDataReader dr;
        SqlCommand command = new SqlCommand();
        //SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB;");
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

                //var image = Image.FromStream(file.OpenReadStream()); //načtení do StreamReaderu
                //var resizedImg = new Bitmap(image, new Size(170, 170)); //zmenšení obrázku

                //var img = ImageToByteArray(resizedImg); //převod obrázku na ByteArray
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
            SqlConnection sqlConnection = new SqlConnection("workstation id=MainSiteDB.mssql.somee.com;packet size=4096;user id=Lolcoman_SQLLogin_1;pwd=crnnfr9adq;data source=MainSiteDB.mssql.somee.com;persist security info=False;initial catalog=MainSiteDB;");
            SqlCommand command = new SqlCommand($"SELECT question,answer,wrongOne,wrongTwo FROM QuizTable WHERE Name = @name", sqlConnection);
            //"SELECT Password from UserTable where [UserName] = @UserName";
            command.Parameters.AddWithValue("@name", name);
            try
            {
                //List<string> list = new List<string>();
                //List<Image> photoList = new List<Image>();
                var questionList = new List<Question>();
                sqlConnection.Open();
                byte[] question, answer, wrongOne, wrongTwo;
                //Image fullQuestion,fullAnswer,fullWrongOne,fullWrongTwo;
                dr = command.ExecuteReader();
                var memory = new MemoryStream();
                //int i = dr.FieldCount;
                bool b = dr.HasRows;
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        //dr.Read();
                        question = (byte[])dr["question"];
                        answer = (byte[])dr["answer"];
                        wrongOne = (byte[])dr["wrongOne"];
                        wrongTwo = (byte[])dr["wrongTwo"];

                        //fullQuestion = ByteArrayToImage(question);
                        //fullAnswer = ByteArrayToImage(answer);
                        //fullWrongOne = ByteArrayToImage(wrongOne);
                        //fullWrongTwo = ByteArrayToImage(wrongTwo);
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

                        //fullImage.Save(memory, ImageFormat.Png);

                        //photoList.Add(fullImage);
                        //memory.Position = 0;
                    }
                }
                //Image[] imagesArray;
                //imagesArray = File.ReadAllLines(memory);
                //imagesArray = photoList.ToArray();
                //ViewBag.countQuestion = questionList.Count;
                return questionList;
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
