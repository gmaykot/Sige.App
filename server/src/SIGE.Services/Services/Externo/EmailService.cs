using MailKit;
using MailKit.Net.Imap;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using Org.BouncyCastle.Asn1.Ocsp;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Email;
using SIGE.Core.Models.Dto.Geral.Medicao;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Options;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Externo;
using SIGE.Services.Interfaces.Geral;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace SIGE.Services.Services.Externo
{
    public class EmailService(IOptions<EmailSettingsOption> mailSettingsOptions, AppDbContext appDbContext, IMedicaoService medicaoService, IHttpContextAccessor httpContextAccessor, RequestContext requestContext) : IEmailService
    {
        private readonly EmailSettingsOption _opt = mailSettingsOptions.Value;
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMedicaoService _medicaoService = medicaoService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly RequestContext _requestContext = requestContext;

        public async Task<Response> SendEmail(EmailDataDto req)
        {
            var ret = new Response();
            try
            {
                using (var mensagem = new MimeMessage())
                {
                    mensagem.Subject = string.Format("Relatório de Medição - {0} - {1}", req.MesReferencia, req.DescEmpresa);
                    mensagem.InReplyTo = _opt.ContactMail;

                    var emailFrom = new MailboxAddress(_opt.SenderName, _opt.SenderEmail);
                    mensagem.From.Add(emailFrom);
                    var emailTo = new MailboxAddress(req.Contato.NomeContato, req.Contato.EmailContato);
                    mensagem.To.Add(emailTo);

                    req.ContatosCCO?.ForEach(c => mensagem.Cc.Add(new MailboxAddress(c.NomeContato, c.EmailContato)));

                    var request = _httpContextAccessor.HttpContext?.Request;
                    var baseUrl = $"{request?.Scheme}://{request?.Host}";
                    var pixelUrl = $"{baseUrl}/email/open/{req.RelatorioMedicaoId}";

                    var builder = new BodyBuilder
                    {
                        HtmlBody = EmailExtensions.GetEmailTemplate(req.Contato.NomeContato, req.MesReferencia, _opt.ContactPhone, _opt.ContactMail, req.DescEmpresa, pixelUrl, baseUrl)
                    };

                    if (req.Relatorios != null)
                    {
                        req.Relatorios.ForEach(async r =>
                        {
                            byte[] byteArray = Convert.FromBase64String(r.Split("base64,")[1]);
                            builder.Attachments.Add(string.Format("relatorio_medicao_{0}_{1}.pdf", req.DescMesReferencia, req.DescEmpresa).ToLower(), byteArray);
                        });

                        StringBuilder stringBuilder = new StringBuilder("Empresa;Dia Medição;Agente Medição, Ponto Medição;Sub Tipo;Status;Consumo Ativo;Consumo Reativo");
                        stringBuilder.AppendLine();

                        var res = await _medicaoService.ListaMedicoesPorContrato(req.ContratoId.ToGuid(), req.MesReferencia.GetPeriodo());

                        if (res.Success)
                        {
                            var medicoes = (IEnumerable<ListaMedicoesPorContratoDto>)res.Data;
                            foreach (var medida in medicoes)
                            {
                                StringBuilder builderRow = new StringBuilder();
                                builderRow.Append(medida.DescEmpresa.ToUpper()); builderRow.Append(';');
                                builderRow.Append(medida.DiaMedicaoo); builderRow.Append(';');
                                builderRow.Append(medida.DescAgenteMedicao); builderRow.Append(';');
                                builderRow.Append(medida.DescPontoMedicao); builderRow.Append(';');
                                builderRow.Append(medida.SubTipo); builderRow.Append(';');
                                builderRow.Append(medida.Status); builderRow.Append(';');
                                builderRow.Append(medida.TotalConsumoAtivo); builderRow.Append(';');

                                stringBuilder.AppendLine(builderRow.ToString());
                            }
                        }

                        var byteArray = Encoding.GetEncoding("ISO-8859-1").GetBytes(stringBuilder.ToString());
                        builder.Attachments.Add(string.Format("relatorio_medicao_{0}_{1}.csv", req.DescMesReferencia, req.DescEmpresa).ToLower(), byteArray);
                    }


                    mensagem.Body = builder.ToMessageBody();

                    var logEmail = await _appDbContext.LogsEnvioEmails.FirstOrDefaultAsync(l => l.RelatorioMedicaoId == req.RelatorioMedicaoId) ?? new LogEnvioEmail
                    {
                        Email = req.Contato.EmailContato,
                        CcoEmail = req.ContatosCCO.Count != 0 ? string.Join(",", req.ContatosCCO.Select(c => c.EmailContato)) : null,
                        RelatorioMedicaoId = req.RelatorioMedicaoId,
                        UsuarioEnvioId = _requestContext.UsuarioId
                    };

                    try
                    {
                        using var mailClient = new SmtpClient();
                        await mailClient.ConnectAsync(_opt.Server, _opt.Port, SecureSocketOptions.Auto);
                        await mailClient.AuthenticateAsync(_opt.UserName, _opt.Password);
                        logEmail.Response = await mailClient.SendAsync(mensagem);
                    }
                    catch (Exception e)
                    {
                        logEmail.InnerException = e.InnerException?.Message ?? e.Message;
                    }

                    if (logEmail?.Id != null)
                        _= _appDbContext.LogsEnvioEmails.Update(logEmail);
                    else
                        _= await _appDbContext.LogsEnvioEmails.AddAsync(logEmail);
                    
                    _ = await _appDbContext.SaveChangesAsync();

                    if (!_opt.Imap.IsNullOrEmpty())
                    {
                        using var imapClient = new ImapClient();

                        // Conecte ao servidor IMAP
                        imapClient.Connect(_opt.Imap, _opt.ImapPort.NullToInt(), SecureSocketOptions.SslOnConnect);
                        imapClient.Authenticate(_opt.UserName, _opt.Password);

                        // Selecione a pasta de "Itens Enviados"
                        var sentFolder = imapClient.GetFolder(SpecialFolder.Sent);
                        sentFolder.Open(FolderAccess.ReadWrite);

                        // Copie o e-mail para a pasta
                        sentFolder.Append(mensagem);

                        imapClient.Disconnect(true);
                    }
                    
                }


                var relatorio = await _appDbContext.RelatoriosMedicao.FindAsync(req.RelatorioMedicaoId);
                if (relatorio != null)
                {
                    relatorio.Fase = EFaseMedicao.ENVIO_EMAIL;
                    _appDbContext.RelatoriosMedicao.Update(relatorio);
                    _= await _appDbContext.SaveChangesAsync();
                }

                return ret.SetOk();
            }
            catch (Exception ex)
            {
                return ret.SetInternalServerError().AddError("Message", ex.Message).AddError("InnerException", ex.InnerException?.Message);
            }
        }

        public async Task<Response> SendFullEmail(EmailFullDataDto req)
        {
            var ret = new Response();
            try
            {
                using (var mensagem = new MimeMessage())
                {
                    mensagem.Subject = req.Assunto;
                    mensagem.InReplyTo = _opt.SenderEmail;

                    var emailFrom = new MailboxAddress(_opt.SenderName, _opt.SenderEmail);
                    mensagem.From.Add(emailFrom);
                    var emailTo = new MailboxAddress(req.Contato.NomeContato, req.Contato.EmailContato);
                    mensagem.To.Add(emailTo);

                    req.ContatosCCO?.ForEach(c => mensagem.Bcc.Add(new MailboxAddress(c.NomeContato, c.EmailContato)));

                    var builder = new BodyBuilder
                    {
                        TextBody = req.Body
                    };

                    mensagem.Body = builder.ToMessageBody();

                    using var mailClient = new SmtpClient();
                    await mailClient.ConnectAsync(_opt.Server, _opt.Port, MailKit.Security.SecureSocketOptions.Auto);
                    await mailClient.AuthenticateAsync(_opt.UserName, _opt.Password);
                    await mailClient.SendAsync(mensagem);
                }

                return ret.SetOk();
            }
            catch (Exception ex)
            {
                return ret.SetInternalServerError().AddError("Message", ex.Message).AddError("InnerException", ex.InnerException?.Message);
            }
        }

        public async Task<Response> OpenEmail(Guid req)
        {
            var ret = new Response();

            var logEmail = await _appDbContext.LogsEnvioEmails.FirstOrDefaultAsync(l => l.RelatorioMedicaoId == req);
            if (logEmail != null)
            {
                logEmail.Aberto = true;
                logEmail.DataAbertura = DataSige.Hoje();
                _= _appDbContext.LogsEnvioEmails.Update(logEmail);
                _ = await _appDbContext.SaveChangesAsync();
            }

            return ret.SetOk();
        }

        public async Task<Response> ObterHistorico()
        {
            var ret = new Response();
            var res = await _appDbContext.LogsEnvioEmails.Include(l => l.UsuarioEnvio).Include(l => l.RelatorioMedicao).ThenInclude(r => r.Contrato).OrderByDescending(l => l.RelatorioMedicao.MesReferencia).ToListAsync();
            if (res != null)
            {
                var resultado = res
                    .GroupBy(a => a.RelatorioMedicao.MesReferencia)
                    .Select(g => new
                    {
                        data = new
                        {
                            mesReferencia = g.Key.ToString("MM/yyyy"),
                            tipo = "group",
                            qtdItens = g.Count()
                        },
                        children = g.Select(a => new
                        {
                            data = new
                            {
                                grupoEmpresa = a.RelatorioMedicao.Contrato.DscGrupo,
                                usuario = a.UsuarioEnvio.Apelido,
                                dataEnvio = a.DataRegistro.ToString("dd/MM/yyyy HH:mm"),
                                dataAbertura = a.DataAbertura?.ToString("dd/MM/yyyy HH:mm"),
                                aberto = a.Aberto ? "SIM" : "NÃO",
                                observacao = a.Response ?? a.InnerException,
                            }
                        }).ToList()
                    })
                    .ToList();
                return ret.SetOk().SetData(resultado);
            }

            return ret.SetNotFound();
        }
    }
}
