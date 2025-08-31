namespace dz11.Loggers
{
    public interface IDblLogger
    {
        Task LogInformation(string action, string endpoint, string message, string? details = null);
        Task LogWarning(string action, string endpoint, string message, string? details = null);
        Task LogError(string action, string endpoint, string message, string? details = null);

        public IEnumerable<LogEntry> GetAllLog();
    }
}
