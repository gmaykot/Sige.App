using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class FaturamentoCoenelService(AppDbContext appDbContext, IMapper mapper) : BaseService<FaturamentoCoenelDto, FaturamentoCoenelModel>(appDbContext, mapper), IFaturamentoCoenelService
    {
        public override async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.FaturamentosCoenel.Include(f => f.PontoMedicao).ThenInclude(p => p.AgenteMedicao).ThenInclude(a => a.Empresa).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturamentoCoenelDto>>(res).OrderBy(f => f.DescEmpresa).ThenBy(f => f.DescPontoMedicao).ThenByDescending(f => f.VigenciaFinal).DistinctBy(f => f.PontoMedicaoId));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public async Task<Response> ObterPorPontoMedicao(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.FaturamentosCoenel.Include(f => f.PontoMedicao).ThenInclude(p => p.AgenteMedicao).ThenInclude(a => a.Empresa).Where(f => f.PontoMedicaoId.Equals(Id)).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturamentoCoenelDto>>(res).OrderBy(f => f.DescEmpresa).ThenBy(f => f.DescPontoMedicao).ThenByDescending(f => f.VigenciaFinal));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o ponto de medição {Id}.");
        }
    }
}
