using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class PontoMedicaoService(AppDbContext appDbContext, IMapper mapper) : BaseService<PontoMedicaoDto, PontoMedicaoModel>(appDbContext, mapper), IPontoMedicaoService
    {
        public override async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.PontosMedicao.Include(p => p.ConsumosMensal).FirstOrDefaultAsync(p => p.Id.Equals(Id));
            if (!ret.ConsumosMensal.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError(ETipoErroResponse.DeleteCascadeError.GetValueString(), "Existem medições vinculadas que impossibilitam a exclusão.");

            _appDbContext.PontosMedicao.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        async public Task<Response> ObterDropDownComSegmento()
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<DropDownDto>(PontosMedicaoFactory.ObterDropDownComSegmento()).ToListAsync(); ;
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }
    }
}
