﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Custom
{
    public class CustomLoggerService(AppDbContext appDbContext, IHttpContextAccessor httpContextAccessor, RequestContext requestContext) : ICustomLoggerService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly RequestContext _requestContext = requestContext;

        public async Task LogAsync(LogLevel logLevel, string message)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var request = httpContext?.Request;
            var user = _requestContext.UsuarioId.ToString();

            var logModel = new LogModel
            {
                Timestamp = DataSige.Hoje(),
                LogLevel = logLevel,
                Message = message,
                Source = httpContext?.TraceIdentifier,
                RequestPath = request?.Path,
                RequestMethod = request?.Method,
                RequestUser = user,
                QueryString = request?.QueryString.ToString()
            };
            if (httpContext?.TraceIdentifier != null && request?.Method != null && !user.IsNullOrEmpty())
            {
                await _appDbContext.Logs.AddAsync(logModel);
                await _appDbContext.SaveChangesAsync();
            }
        }

        public async Task LogAsync(LogLevel logLevel, string message, string? query = null)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var request = httpContext?.Request;
            var user = _requestContext.UsuarioId.ToString();

            var logModel = new LogModel
            {
                Timestamp = DataSige.Hoje(),
                LogLevel = logLevel,
                Message = message,
                Source = httpContext?.TraceIdentifier,
                RequestPath = request?.Path,
                RequestMethod = request?.Method,
                RequestUser = user,
                QueryString = query ?? request?.QueryString.ToString()
            };
            if (httpContext?.TraceIdentifier != null && request?.Method != null && !user.IsNullOrEmpty())
            {
                await _appDbContext.Logs.AddAsync(logModel);
                await _appDbContext.SaveChangesAsync();
            }
        }

        public async Task LogAsync(LogModel log)
        {
            await _appDbContext.Logs.AddAsync(log);
            await _appDbContext.SaveChangesAsync();
        }
    }
}
