using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVCProject.Models
{
    public class Score
    {
        public int score { get; set; }
        public string game { get; set; }
        public int correctAnswer { get; set; }
        public int question { get; set; }
    }
}
