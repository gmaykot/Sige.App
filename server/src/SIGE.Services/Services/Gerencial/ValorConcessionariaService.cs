using AutoMapper;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial
{
    public class ValorConcessionariaService(AppDbContext appDbContext, IMapper mapper) : BaseService<ValorConcessionariaDto, ValorConcessionariaModel>(appDbContext, mapper)
    {
        //public async Task<Response> Obter()
        //{
        //    var ret = new Response();
        //    var res = await _appDbContext
        //        .ValoresConcessionaria.AsNoTracking()
        //        .Include(v => v.Concessionaria)
        //        .ToListAsync();
        //    if (res.Count > 0)
        //        return ret.SetOk().SetData(_mapper.Map<IEnumerable<ValorConcessionariaDto>>(res));

        //    return ret.SetNotFound()
        //        .AddError(ETipoErro.INFORMATIVO, "Não existe valor de concessionária ativo.");
        //}
    }
}
