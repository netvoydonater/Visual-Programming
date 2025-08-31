namespace dz11.Loggers
{
    public class LogEntry
    {
        public int id { get; set; }
        public DateTime timestamp { get; set; }
        public string level { get; set; } // "Info", "Warning", "Error"
        public string message { get; set; } // "Get", "Post", "Delete", "Patch"
        public string path { get; set; }
        public string method { get; set; }
        public string? exception { get; set; }
    }
}
