using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Email;
using SIGE.Core.Models.Dto.Geral.Medicao;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema;
using SIGE.Services.Custom;
using SIGE.Services.Interfaces.Externo;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Schedule
{
    public class MedicaoCCEEScheduleEscoped(IMedicaoService medicaoService, ICustomLoggerService loggerService, IHttpContextAccessor httpContextAccessor, IEmailService emailService, RequestContext requestContext)
    {
        private readonly IMedicaoService _medicaoService = medicaoService;
        private readonly IEmailService _emailService = emailService;
        private readonly ICustomLoggerService _loggerService = loggerService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly RequestContext _requestContext = requestContext;

        public async void DoWorkAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var request = httpContext?.Request;
            var user = _requestContext.UsuarioId.ToString();

            var logModel = new LogModel
            {
                Timestamp = DataSige.Hoje(),
                Source = httpContext?.TraceIdentifier ?? "ScheduleService",
                Message = string.Empty,
                RequestPath = request?.Path,
                RequestMethod = request?.Method ?? "DoWorkAsync",
                RequestUser = user.IsNullOrEmpty() ? "application" : user,
                QueryString = request?.QueryString.ToString()
            };

            await _loggerService.LogAsync(logModel.ClearId().SetLevel(LogLevel.Information).SetMessage("Coleta de Dados INICIADA."));
            try
            {
                var medicoes = await _medicaoService.ListarMedicoes(new MedicaoDto());

                var res = await _medicaoService.ColetarMedicoes(new ColetaMedicaoDto()
                {
                    Periodo = DataSige.HojeDO(),
                    Medicoes = medicoes.Data
                });
                if (res != null)
                {
                    if (!res.Success)
                        res.Errors.ToList().ForEach(async x => await _loggerService.LogAsync(logModel.ClearId().SetLevel(LogLevel.Error).SetMessage($"Erro => {x}")));
                }
                else
                    await _loggerService.LogAsync(logModel.ClearId().SetLevel(LogLevel.Error).SetMessage("Sem response na coleta dos dados."));
            }
            catch (Exception ex)
            {
                await _loggerService.LogAsync(logModel.ClearId().SetLevel(LogLevel.Error).SetMessage($"Erro na coleta dos dados automáticos. Message => {ex.Message}. InnerException => {ex.InnerException}"));

                EmailFullDataDto email = new()
                {
                    MesReferencia = DataSige.HojeString(),
                    Contato = new ContatoEmailDto()
                    {
                        EmailContato = "gmaykot@gmail.com",
                        NomeContato = "Gabriel Michels"
                    },
                    ContatosCCO = 
                    [
                      new ContatoEmailDto()
                        {
                            EmailContato = "asbservices.ti@gmail.com",
                            NomeContato = "Andrey Basso"
                        },
                    ],
                    Assunto = "[SIGE] SCHEDULE - Erro ao Gerar Medições",
                    Body = ex.Message
                };
                
                _= await _emailService.SendFullEmail(email);
            }
            finally
            {
                await _loggerService.LogAsync(logModel.ClearId().SetLevel(LogLevel.Information).SetMessage("Coleta de Dados FINALIZADA."));
            }
        }
    }
}
