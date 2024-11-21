﻿using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Mail;
using SIGE.Core.Models.Dto.Medicao;
using SIGE.Core.Options;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;
using System.Text;

namespace SIGE.Services.Services
{
    public class EmailService(IOptions<EmailSettingsOptions> mailSettingsOptions, AppDbContext appDbContext, IMedicaoService medicaoService) : IEmailService
    {
        private readonly EmailSettingsOptions _opt = mailSettingsOptions.Value;
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMedicaoService _medicaoService = medicaoService;

        public async Task<Response> SendEmail(EmailDataDto req)
        {
            var ret = new Response();
            try
            {
                using (var mensagem = new MimeMessage())
                {
                    mensagem.Subject = string.Format("Relatório de Medição - {0} - {1}", req.Competencia, req.DescEmpresa);
                    mensagem.InReplyTo = _opt.ContactMail;

                    var emailFrom = new MailboxAddress(_opt.SenderName, _opt.SenderEmail);
                    mensagem.From.Add(emailFrom);
                    var emailTo = new MailboxAddress(req.Contato.NomeContato, req.Contato.EmailContato);
                    mensagem.To.Add(emailTo);

                    req.ContatosCCO?.ForEach(c => mensagem.Bcc.Add(new MailboxAddress(c.NomeContato, c.EmailContato)));

                    var builder = new BodyBuilder
                    {
                        HtmlBody = EmailExtensions.GetEmailTemplate(req.Contato.NomeContato, req.Competencia, _opt.ContactPhone, _opt.ContactMail, req.DescEmpresa)
                    };

                    if (req.Relatorios != null)
                    {
                        req.Relatorios.ForEach(async r =>
                        {
                            byte[] byteArray = Convert.FromBase64String(r.Split("base64,")[1]);
                            builder.Attachments.Add(string.Format("relatorio_medicao_{0}_{1}.pdf", req.DescCompetencia, req.DescEmpresa).ToLower(), byteArray);
                        });

                        StringBuilder stringBuilder = new StringBuilder("Empresa;Dia Medição;Agente Medição, Ponto Medição;Sub Tipo;Status;Consumo Ativo;Consumo Reativo");
                        stringBuilder.AppendLine();

                        var res = await _medicaoService.ListaMedicoesPorContrato(req.ContratoId.ToGuid(), req.Competencia.GetPeriodo());

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
                                builderRow.Append(medida.TotalConsumoReativo);

                                stringBuilder.AppendLine(builderRow.ToString());
                            }
                        }                       

                        var byteArray = Encoding.GetEncoding("ISO-8859-1").GetBytes(stringBuilder.ToString());
                        builder.Attachments.Add(string.Format("relatorio_medicao_{0}_{1}.csv", req.DescCompetencia, req.DescEmpresa).ToLower(), byteArray);
                    }
                                        
                    
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
    }
}
