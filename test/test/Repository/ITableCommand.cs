using test.Models;

namespace test.Repository
{
    public interface ITableCommand
    {
        void createTable(int postId, string name, string email, string body);
        void UpdateId(int id, int postId, string name, string email, string body);
        void deleteById(int id);
        Table GetTableById(int id);
        IEnumerable<Table> GetAllTables();
    }
}
