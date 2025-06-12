using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Email;

namespace SIGE.Services.Interfaces.Externo
{
    public interface IEmailService
    {
        Task<Response> SendEmail(EmailDataDto req);
        Task<Response> SendFullEmail(EmailFullDataDto req);
        Task<Response> OpenEmail(Guid req);
    }
}