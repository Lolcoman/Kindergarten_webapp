using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace MVCProject.DBHelps
{
    public class DBHelp
    {
        private IConfiguration configuration;

        public DBHelp(IConfiguration cfg)
        {
            configuration = cfg;
        }

        /// <summary>
        /// Zda uživatel již je v databázi
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public bool IsUserExist(string query)
        {
            bool help = false;

            string connectionString = configuration["ConnectionStrings:DefaultConnection"];

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string sql = query;
                SqlCommand sqlCommand = new SqlCommand(sql, con);
                SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                if (sqlDataReader.HasRows)
                {
                    help = true;
                }
                con.Close();
            }
            return help;
        }

        public int DMLTransaction(string query)
        {
            int result;
            string connectionString = configuration["ConnectionStrings:DefaultConnection"];
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string sql = query;
                SqlCommand sqlCommand = new SqlCommand(sql, con);
                result = sqlCommand.ExecuteNonQuery();
                con.Close();
            }
            return result;
        }
    }
}
