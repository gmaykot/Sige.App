using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Mail;

namespace SIGE.Services.Interfaces
{
    public interface IEmailService
    {
        Task<Response> SendEmail(EmailDataDto req);
        Task<Response> SendFullEmail(EmailFullDataDto req);
    }
}