using Microsoft.Extensions.Logging;
using SIGE.Core.Models.Sistema;

namespace SIGE.Services.Custom
{
    public interface ICustomLoggerService
    {
        Task LogAsync(LogLevel logLevel, string message);
        Task LogAsync(LogModel log);
    }
}
