using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Sistema.Geral.Economia;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class EnergiaAcumuladaService(AppDbContext appDbContext, IMapper mapper) : BaseService<EnergiaAcumuladaDto, EnergiaAcumuladaModel>(appDbContext, mapper), IEnergiaAcumuladaService
    {
        public async Task<Response> ObterPorPontoMedicao(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.EnergiasAcumuladas.Include(e => e.PontoMedicao).Where(b => b.PontoMedicaoId == Id).OrderByDescending(b => b.MesReferencia).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<EnergiaAcumuladaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> ObterPorMesReferencia(DateTime? MesReferencia)
        {
            var ret = new Response();
            IQueryable<EnergiaAcumuladaModel> query = _appDbContext.EnergiasAcumuladas.Include(e => e.PontoMedicao);

            if (MesReferencia != null)
            {
                query = query.Where(e => e.MesReferencia <= MesReferencia);
            }

            var res = await query
                .GroupBy(e => e.PontoMedicaoId)
                .Select(g => g.OrderByDescending(e => e.MesReferencia).First())
                .ToListAsync();

            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<EnergiaAcumuladaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com a referência {MesReferencia}.");
        }
    }
}
