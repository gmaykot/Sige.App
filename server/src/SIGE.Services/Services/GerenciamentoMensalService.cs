using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MySqlConnector;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Dto.GerenciamentoMensal;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services
{
    public class GerenciamentoMensalService(AppDbContext appDbContext, IMapper mapper) : IGerenciamentoMensalService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> ObterDadodsMensais(DateTime mesReferencia, Guid? empresaId = null)
        {
            var ret = new Response();

            var gerenciamento = new GerenciamentoMensalDto
            {
                MesReferencia = mesReferencia,
                BandeiraVigente = await ObterBandeiraVigente(mesReferencia),
                PisCofins = await ObterPisCofins(mesReferencia),
                ProinfaIcms = await ObterProinfaIcms(mesReferencia, empresaId),
                DescontoTUSD = await ObterDescontoTusd(mesReferencia)
            };

            return ret.SetOk().SetData(gerenciamento);
        }

        public async Task<List<ProinfaIcmsMensalDto>> ObterProinfaIcms(DateTime mesReferencia, Guid? empresaId)
        {
            var parameters = new MySqlParameter[]
            {
                new("@MesReferencia", MySqlDbType.Date) { Value = mesReferencia },
                new("@EmpresaId", MySqlDbType.Guid) { Value = empresaId },
            };

            var retorno = await _appDbContext.Database
                .SqlQueryRaw<ProinfaIcmsMensalDto>(GerenciamentoMensalFactory.ListaValoresMensaisPontosMedicao(), parameters)
                .ToListAsync();

            if (!empresaId.HasValue)
                return await IncluirIcmsLote(retorno, mesReferencia);

            return retorno;
        }

        public async Task<List<PisCofinsMensalDto>> ObterPisCofins(DateTime mesReferencia)
        {
            return await _appDbContext.Database
                .SqlQueryRaw<PisCofinsMensalDto>(GerenciamentoMensalFactory.ListaPisCofins(), mesReferencia)
                .ToListAsync();
        }

        public async Task<List<DescontoTUSDDto>> ObterDescontoTusd(DateTime mesReferencia) =>
            await _appDbContext.Database
                .SqlQueryRaw<DescontoTUSDDto>(GerenciamentoMensalFactory.ListaDescontoTusd(), mesReferencia)
                .ToListAsync();

        public async Task<BandeiraTarifariaVigenteDto?> ObterBandeiraVigente(DateTime mesReferencia)
        {
            var parameters = new MySqlParameter[]
            {
                new("@MesReferencia", MySqlDbType.Date) { Value = mesReferencia },
                new("@VigenciaInicialFiltro", MySqlDbType.Date) { Value = mesReferencia.GetPrimeiraHoraMes() },
                new("@VigenciaFinalFiltro", MySqlDbType.Date) { Value = mesReferencia.GetUltimaHoraMes() }
            };
            var a = await _appDbContext.Database
                        .SqlQueryRaw<BandeiraTarifariaVigenteDto>(GerenciamentoMensalFactory.ObterBandeiraMesReferencia(), parameters)
                        .ToListAsync();

            return a.FirstOrDefault();
        }


        public async Task<Response> IncluirBandeiraVigente(BandeiraTarifariaVigenteDto req)
        {
            var ret = new Response();

            var bandeira = await _appDbContext.BandeiraTarifariaVigente.FirstOrDefaultAsync(b => b.Id == req.Id);
            bandeira ??= new BandeiraTarifariaVigenteModel
                {
                    BandeiraTarifariaId = req.BandeiraTarifariaId,
                    MesReferencia = req.MesReferencia.Value
                };

            bandeira.Bandeira = req.Bandeira.Value;
            _ = _appDbContext.Update(bandeira);
            _ = await _appDbContext.SaveChangesAsync();

            return ret.SetOk();
        }

        public async Task<Response> IncluirPisCofins(PisCofinsMensalDto req)
        {
            var ret = new Response();

            var bandeira = await _appDbContext.ImpostosConcessionarias.FirstOrDefaultAsync(b => b.Id == req.Id);
            bandeira ??= new ImpostoConcessionariaModel
            {
                ConcessionariaId = req.ConcessionariaId,
                MesReferencia = req.MesReferencia.Value,
                ValorPis = req.Pis ?? 0,
                ValorCofins = req.Cofins ?? 0
            };

            bandeira.ValorPis = req.Pis ?? 0;
            bandeira.ValorCofins = req.Cofins ?? 0;

            _ = _appDbContext.Update(bandeira);
            _ = await _appDbContext.SaveChangesAsync();

            return ret.SetOk();
        }

        private async Task<List<ProinfaIcmsMensalDto>> IncluirIcmsLote(List<ProinfaIcmsMensalDto> req, DateTime mesReferencia, double icmsBase = 17)
        {
            foreach (var r in req)
            {
                if (r.Id == null)
                {
                    r.Icms = icmsBase;
                    var valor = new ValorMensalPontoMedicaoModel
                    {
                        Proinfa = r.Proinfa ?? 0,
                        Icms = r.Icms ?? 0,
                        PontoMedicaoId = r.PontoMedicaoId,
                        MesReferencia = DateOnly.FromDateTime(mesReferencia)
                    };
                    await _appDbContext.AddAsync(valor);
                }
            }
            await _appDbContext.SaveChangesAsync();

            return req;
        }

        public async Task<Response> IncluirProinfaIcms(ProinfaIcmsMensalDto req)
        {
            var ret = new Response();

            var valor = await _appDbContext.ValoresMensaisPontoMedicao.FirstOrDefaultAsync(b => b.Id == req.Id);
            valor ??= new ValorMensalPontoMedicaoModel
            {
                Proinfa = req.Proinfa ?? 0,
                Icms = req.Icms ?? 0,
                PontoMedicaoId = req.PontoMedicaoId,
                MesReferencia = req.MesReferencia
            };

            valor.Proinfa = req.Proinfa ?? 0;
            valor.Icms = req.Icms ?? 0;

            _ = _appDbContext.Update(valor);
            _ = await _appDbContext.SaveChangesAsync();

            return ret.SetOk();
        }

        public async Task<Response> IncluirDescontoTusd(DescontoTUSDDto req)
        {
            var ret = new Response();

            var desconto = await _appDbContext.DescontosTusd.FirstOrDefaultAsync(b => b.Id == req.Id);
            desconto ??= new DescontoTusdModel
            {
                MesReferencia = req.MesReferencia,
                AgenteMedicaoId = req.AgenteMedicaoId,
                ValorDescontoTUSD = req.ValorDescontoTUSD ?? 0,
                ValorDescontoRETUSD = req.ValorDescontoRETUSD ?? 0,
            };

            desconto.ValorDescontoTUSD = req.ValorDescontoTUSD?? 0;
            desconto.ValorDescontoRETUSD = req.ValorDescontoRETUSD ?? 0;

            _ = _appDbContext.Update(desconto);
            _ = await _appDbContext.SaveChangesAsync();

            return ret.SetOk();
        }
    }
}
