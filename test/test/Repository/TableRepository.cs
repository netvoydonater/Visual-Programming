using System.Reflection;
using test.Models;

namespace test.Repository
{
    public class TableRepository : ITableCommand
    {

        private Dictionary<int, Table> _tables = new Dictionary<int, Table>();
        private int _id = 1;

        public void createTable(int postId, string name, string email, string body)
        {
            Table table = new Table()
            {
                PostId = postId,
                Id = _id, 
                Name = name,
                Email = email,
                Body = body
            };

            _tables.Add(_id, table);
            _id++;
        }

        public void deleteById(int id)
        {
            if (_tables.ContainsKey(id))
            {
                _tables.Remove(id);
            }
        }

        public IEnumerable<Table> GetAllTables() => _tables.Values;

        public Table GetTableById(int id) => _tables[id];

        public void UpdateId(int id, int postId, string name, string email, string body)
        {
            if (_tables.ContainsKey(id))
            {
                _tables[id].PostId = postId;
                _tables[id].Name = name;
                _tables[id].Email = email;
                _tables[id].Body = body;
            }
        }
    }
}
