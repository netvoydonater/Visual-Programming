using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;
using dz11.Models;

namespace dz11.Repositories
{
    public class ConnectToDB : DbContext
    {
        public ConnectToDB(DbContextOptions<ConnectToDB> options) : base(options)
        {
        }

        public DbSet<Comment> comments { get; set; }//виртуальная таблица

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Можно добавить конфигурацию модели здесь
            modelBuilder.Entity<Comment>().HasKey(t => t.Id);
        }
    }
}
