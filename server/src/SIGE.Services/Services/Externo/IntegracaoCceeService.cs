﻿using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Services.HttpConfiguration.Ccee;
using SIGE.Services.HttpConfiguration;
using System.Text;
using Newtonsoft.Json;
using System.Xml.Linq;
using SIGE.DataAccess.Context;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SIGE.Core.Extensions;
using SIGE.Services.Interfaces.Externo;
using SIGE.Core.Models.Dto.Administrativo.Ccee;
using SIGE.Core.Options;
using Microsoft.Extensions.Options;

namespace SIGE.Services.Services.Externo
{
    public class IntegracaoCceeService(IHttpClient<CceeHttpClient> httpClient, AppDbContext appDbContext, IMapper mapper, IOptions<CceeOption> option) : IIntegracaoCceeService
    {
        public readonly IMapper _mapper = mapper;
        public readonly IHttpClient<CceeHttpClient> _httpClient = httpClient;
        public readonly CceeOption? _option = option.Value;
        private readonly AppDbContext _appDbContext = appDbContext;

        public async Task<Response> ListarMedicoes(IntegracaoCceeBaseDto req)
        {
            var ret = new Response();

            var empresa = await _appDbContext.Empresas.AsNoTracking().Include(e => e.AgentesMedicao).FirstOrDefaultAsync(e => e.Id == req.EmpresaId);
            if (empresa == null)
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "A empresa selecionada não existe.");

            var credenciais = await _appDbContext.CredenciaisCcee.AsNoTracking().Include(c => c.Gestor).FirstOrDefaultAsync(c => c.GestorId == empresa.GestorId);
            if (credenciais == null)
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Sem credenciais cadastradas no sistema.");

            var medicoes = new List<IntegracaoCceeMedidasDto>();

            foreach (var agente in empresa.AgentesMedicao)
            {
                var pontosMedicao = await _appDbContext.PontosMedicao.AsNoTracking().Where(p => p.AgenteMedicao.Id == agente.Id).ToListAsync();
                foreach (var ponto in pontosMedicao)
                {
                    var xmlEnvelope = req.TipoMedicao.CreateSoapEnvelope(agente.CodigoPerfilAgente, credenciais.AuthUsername, credenciais.AuthPassword, ponto.Codigo, req.Periodo.GetPrimeiraHoraMes(), req.Periodo.GetUltimaHoraMes());
                    var httpContent = new StringContent(xmlEnvelope, Encoding.UTF8, "text/xml");
                    httpContent.Headers.Add("SOAPAction", _option.ListarMedidas.SoapAction);
                    try
                    {
                        var res = await _httpClient.PostAsync(_option.ListarMedidas.Url, httpContent);
                        if (res.IsSuccessStatusCode)
                        {
                            var content = await res.Content.ReadAsStringAsync();
                            if (string.IsNullOrEmpty(content))
                                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Retorno do serviço 'Listar Medidas' inválido.");

                            XDocument doc = XDocument.Parse(content.XmlSanitazer());
                            var medidas = doc.DescendantNodes().FirstOrDefault(n => n.ToString().Contains("outmedidas"));
                            var json = JsonConvert.SerializeXNode(medidas, Formatting.None, true);

                            var resXml = JsonConvert.DeserializeObject<IntegracaoCceeXmlDto>(json);
                            if (resXml == null || resXml.ListaMedidas != null || !resXml.ListaMedidas.Any())
                                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Nenhuma medida listada no serviço.");

                            medicoes.AddRange(_mapper.Map<IEnumerable<IntegracaoCceeMedidasDto>>(resXml.ListaMedidas.OrderBy(n => n.PeriodoFinal).ToList()));
                        }
                    }
                    catch (Exception ex)
                    {
                        return ret.SetInternalServerError().AddError(ETipoErro.ERRO, "Erro ao executar a integração com a Ccee")
                                                           .AddError("Message", ex.Message)
                                                           .AddError("InnerException", ex.InnerException.Message);
                    }
                }
            }
            var resCcee = new IntegracaoCceeDto
            {
                EmpresaId = req.EmpresaId,
                Periodo = req.Periodo,
                TipoMedicao = req.TipoMedicao,
                ListaMedidas = medicoes.OrderBy(m => m.PontoMedicao).ThenBy(m => m.PeriodoFinal)
            };
            if (resCcee.ListaMedidas.Any())
                resCcee.Totais = new IntegracaoCceeTotaisDto()
                {
                    MediaConsumoAtivo = resCcee.ListaMedidas.Average(m => m.ConsumoAtivo),
                    SomaConsumoAtivo = resCcee.ListaMedidas.Sum(m => m.ConsumoAtivo),
                };

            return ret.SetOk().SetData(resCcee).SetMessage("Integração efetuada com sucesso.");
        }

        public async Task<Response> ListarMedicoesPorPonto(IntegracaoCceeBaseDto req)
        {
            var ret = new Response();

            var empresa = await _appDbContext.Empresas.AsNoTracking().Include(e => e.AgentesMedicao).FirstOrDefaultAsync(e => e.Id == req.EmpresaId);
            if (empresa == null)
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "A empresa selecionada não existe.");

            var credenciais = await _appDbContext.CredenciaisCcee.AsNoTracking().Include(c => c.Gestor).FirstOrDefaultAsync(c => c.GestorId == empresa.GestorId);
            if (credenciais == null)
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Sem credenciais cadastradas no sistema.");

            var medicoes = new List<IntegracaoCceeMedidasDto>();

            var xmlEnvelope = req.TipoMedicao.CreateSoapEnvelope(req.CodAgente.Trim(), credenciais.AuthUsername.Trim(), credenciais.AuthPassword.Trim(), req.PontoMedicao.Trim(), req.Periodo.GetPrimeiraHoraMes(), req.Periodo.GetUltimaHoraMes());
            var httpContent = new StringContent(xmlEnvelope, Encoding.UTF8, "text/xml");
            httpContent.Headers.Add("SOAPAction", _option.ListarMedidas.SoapAction);
            try
            {
                var res = await _httpClient.PostAsync(_option.ListarMedidas.Url, httpContent);
                if (res.IsSuccessStatusCode)
                {
                    var content = await res.Content.ReadAsStringAsync();
                    if (string.IsNullOrEmpty(content))
                        return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Retorno do serviço 'Listar Medidas' inválido.");

                    XDocument doc = XDocument.Parse(content.XmlSanitazer());
                    var medidas = doc.DescendantNodes().FirstOrDefault(n => n.ToString().Contains("bmmedidas"));
                    var json = JsonConvert.SerializeXNode(medidas, Formatting.None, true);

                    var resXml = JsonConvert.DeserializeObject<IntegracaoCceeXmlDto>(json);
                    if (resXml == null || resXml.ListaMedidas == null || !resXml.ListaMedidas.Any())
                        return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Nenhuma medida listada no período.");

                    medicoes.AddRange(_mapper.Map<IEnumerable<IntegracaoCceeMedidasDto>>(resXml.ListaMedidas.OrderBy(n => n.PeriodoFinal).ToList()));
                }
                else
                {
                    return ret.SetBadRequest().AddError(ETipoErro.ERRO, "Erro ao executar a integração com a Ccee")
                                    .AddError("RequestMessage", res.RequestMessage.ToString())
                                    .AddError("ReasonPhrase", res.ReasonPhrase);
                }
            }
            catch (Exception ex)
            {
                return ret.SetInternalServerError().AddError(ETipoErro.ERRO, "Erro ao executar a integração com a Ccee")
                                                    .AddError("Message", ex.Message)
                                                    .AddError("InnerException", ex.InnerException.Message);
            }

            var resCcee = new IntegracaoCceeDto
            {
                EmpresaId = req.EmpresaId,
                Periodo = req.Periodo,
                TipoMedicao = req.TipoMedicao,
                ListaMedidas = medicoes.OrderBy(m => m.PontoMedicao).ThenBy(m => m.PeriodoFinal)
            };
            if (resCcee.ListaMedidas.Any())
            {
                resCcee.Totais = new IntegracaoCceeTotaisDto()
                {
                    MediaConsumoAtivo = resCcee.ListaMedidas.Average(m => m.ConsumoAtivo),
                    SomaConsumoAtivo = resCcee.ListaMedidas.Sum(m => m.ConsumoAtivo),
                };
            } else
            {
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "SemNenhuma medida listada no período.");
            }                

            return ret.SetOk().SetData(resCcee).SetMessage("Integração efetuada com sucesso.");
        }
    }
}
