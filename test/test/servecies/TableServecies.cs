using test.Models;
using test.Repository;

namespace test.servecies
{
    public class TableServecies
    {
        ITableCommand iTableCommand;

        public TableServecies(ITableCommand iTableCommand) => this.iTableCommand = iTableCommand;

        public void AddTable(Table table) => iTableCommand.createTable(table.PostId, table.Name, table.Email, table.Body);

        public Table GetTable(int id) => iTableCommand.GetTableById(id);

        public IEnumerable<Table> GetTableAll() => iTableCommand.GetAllTables();

        public void delete(int id) => iTableCommand.deleteById(id);

        public void update(int id, Table table) => iTableCommand.UpdateId(id, table.PostId, table.Name, table.Email, table.Body);
    }
}
