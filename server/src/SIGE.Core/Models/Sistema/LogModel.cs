using Microsoft.Extensions.Logging;

namespace SIGE.Core.Models.Sistema
{
    public class LogModel
    {
        public LogModel() { }
        public Guid Id { get; set; }
        public DateTime Timestamp { get; set; }
        public LogLevel LogLevel { get; set; }
        public required string Message { get; set; }
        public string? Source { get; set; }
        public string? RequestPath { get; set; }
        public string? RequestMethod { get; set; }
        public string? RequestUser { get; set; }
        public string? QueryString { get; set; }

        public LogModel ClearId()
        {
            Id = new Guid();
            return this;
        }

        public LogModel SetLevel(LogLevel logLevel)
        {
            LogLevel = logLevel;
            return this;
        }

        public LogModel SetMessage(string message)
        {
            Message = message;
            return this;
        }
    }
}
