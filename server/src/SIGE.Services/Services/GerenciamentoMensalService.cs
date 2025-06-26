using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Dto.GerenciamentoMensal;
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

        public async Task<Response> ObterDadodsMensais(DateTime mesReferencia)
        {
            var ret = new Response();

            var gerenciamento = new GerenciamentoMensalDto
            {
                MesReferencia = mesReferencia,
                BandeiraVigente = await ObterBandeiraVigente(mesReferencia),
                PisCofins = await ObterPisCofins(mesReferencia),
                ProinfaIcms = await ObterProinfaIcms(mesReferencia)
            };

            return ret.SetOk().SetData(gerenciamento);
        }

        public async Task<List<ProinfaIcmsMensalDto>> ObterProinfaIcms(DateTime mesReferencia) =>
            await _appDbContext.Database
                .SqlQueryRaw<ProinfaIcmsMensalDto>(GerenciamentoMensalFactory.ListaValoresMensaisPontosMedicao(), mesReferencia)
                .ToListAsync();

        public async Task<List<PisCofinsMensalDto>> ObterPisCofins(DateTime mesReferencia) =>
            await _appDbContext.Database
                .SqlQueryRaw<PisCofinsMensalDto>(GerenciamentoMensalFactory.ListaPisCofins(), mesReferencia)
                .ToListAsync();        

        public async Task<BandeiraTarifariaVigenteDto> ObterBandeiraVigente(DateTime mesReferencia)
        {
            var bandeira = await _appDbContext.BandeirasTarifarias
                .Where(b => b.VigenciaInicial <= mesReferencia &&
                            (b.VigenciaFinal == null || b.VigenciaFinal.Value >= mesReferencia))
                .OrderByDescending(b => b.VigenciaInicial)
                .Include(b => b.BandeirasTarifariasVigente
                                .Where(bv => bv.MesReferencia == mesReferencia)
                                .Take(1))
                .FirstOrDefaultAsync();

            if (bandeira != null)
            {
                var bandeiraVigente = await _appDbContext.BandeiraTarifariaVigente
                    .Where(bv => bv.BandeiraTarifariaId == bandeira.Id && bv.MesReferencia == mesReferencia)
                    .FirstOrDefaultAsync();

                var bandeiraDto = new BandeiraTarifariaVigenteDto { MesReferencia = mesReferencia, Bandeira = Core.Enumerators.ETipoBandeira.ND, BandeiraTarifariaId = bandeira.Id };
                if (bandeiraVigente != null)
                {
                    bandeiraVigente.BandeiraTarifaria = null;
                    bandeiraDto = _mapper.Map<BandeiraTarifariaVigenteDto>(bandeiraVigente);
                }

                return bandeiraDto;
            }
            return new BandeiraTarifariaVigenteDto { MesReferencia = mesReferencia };
        }

        public async Task<Response> IncluirBandeiraVigente(BandeiraTarifariaVigenteDto req)
        {
            var ret = new Response();

            var bandeira = await _appDbContext.BandeiraTarifariaVigente.FirstOrDefaultAsync(b => b.Id == req.Id);
            bandeira ??= new BandeiraTarifariaVigenteModel
                {
                    BandeiraTarifariaId = req.BandeiraTarifariaId,
                    MesReferencia = req.MesReferencia
                };

            bandeira.Bandeira = req.Bandeira;
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

        public Task<Response> IncluirProinfaIcms(ProinfaIcmsMensalDto req)
        {
            throw new NotImplementedException();
        }
    }
}
