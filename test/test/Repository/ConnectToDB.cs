using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Repository
{
    public class ConnectToDB : DbContext
    {
        public ConnectToDB(DbContextOptions<ConnectToDB> options) : base(options)
        {
        }

        public DbSet<Table> Tables { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Можно добавить конфигурацию модели здесь
            modelBuilder.Entity<Table>().HasKey(t => t.Id);
        }
    }
}