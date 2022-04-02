using MVCProject.Services;
using System;
using System.Data.SqlClient;

namespace MVCProject.DBHelps
{
    public class DBHelp
    {
        private readonly SqlConnectionFactory _factory;
        public DBHelp(SqlConnectionFactory factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Zda uživatel již je v databázi
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public bool IsUserExist(SqlCommand command, SqlConnection con)
        {
            bool help = false;
            try
            {
                con.Open();

                //string sql = query;
                //SqlCommand sqlCommand = new SqlCommand(sql, con);
                using SqlDataReader sqlDataReader = command.ExecuteReader();
                if (sqlDataReader.HasRows)
                {
                    help = true;
                }
                con.Close();
            }
            catch (SqlException e)
            {
                Console.WriteLine("Error Generated. Details: " + e.ToString());
            }
            return help;
        }

        public int DMLTransaction(string query)
        {
            int result;
            using SqlConnection con = _factory.CreateConnection();
            con.Open();
            string sql = query;
            SqlCommand sqlCommand = new SqlCommand(sql, con);
            result = sqlCommand.ExecuteNonQuery();
            con.Close();
            return result;
        }
    }
}
