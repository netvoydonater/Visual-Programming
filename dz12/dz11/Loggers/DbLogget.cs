using dz11.Models;
using dz11.Repositories;

namespace dz11.Loggers
{
    public class DbLogget : IDblLogger
    {
        private readonly ConnectToDB _dbContext;

        public DbLogget(ConnectToDB dbContext) => _dbContext = dbContext;

        public async Task LogInformation(string action, string endpoint, string message, string? details = null) => await Log("Info", action, endpoint, message, details);

        public async Task LogWarning(string action, string endpoint, string message, string? details = null) => await Log("Warning", action, endpoint, message, details);

        public async Task LogError(string action, string endpoint, string message, string? details = null) => await Log("Error", action, endpoint, message, details);

        private async Task Log(string level, string action, string endpoint, string message, string? details)
        {
            var logEntry = new LogEntry
            {
                //id = 1,
                timestamp = DateTime.UtcNow,
                level = level,
                message = action,
                path = endpoint,
                method = message,
                exception = details
            };

            _dbContext.systemlogs.Add(logEntry);
            await _dbContext.SaveChangesAsync();
        }
        public IEnumerable<LogEntry> GetAllLog()
        {
            return _dbContext.systemlogs.ToList();
        }
    }
}
