using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace MVCProject.Services
{
    public class SqlConnectionFactory
    {
        private readonly IConfiguration _configuration;
        public const string ConnectionStringName = "DefaultConnection";
        public SqlConnectionFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public SqlConnection CreateConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString(ConnectionStringName));
        }
    }
}
