using AutoMapper;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial
{
    public class TarifaAplicacaoService(AppDbContext appDbContext, IMapper mapper) : BaseService<TarifaAplicacaoDto, TarifaAplicacaoModel>(appDbContext, mapper)
    {

        //public async Task<Response> Obter()
        //{
        //    var ret = new Response();
        //    var res = await _appDbContext.TarifasAplicacao.Include(t => t.Concessionaria).ToListAsync();
        //    if (res.Count > 0)
        //        return ret.SetOk().SetData(_mapper.Map<IEnumerable<TarifaAplicacaoDto>>(res));

        //    return ret.SetNotFound()
        //        .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        //}
    }
}
