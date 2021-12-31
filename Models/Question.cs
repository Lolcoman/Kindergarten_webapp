using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVCProject.Models
{
    public class Question
    {
        public string question { get; set; }
        public string correct { get; set; }
        public string wrongOne { get; set; }
        public string wrongTwo { get; set; }
    }
}
