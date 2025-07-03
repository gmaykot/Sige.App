using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class ConcessionariaService(AppDbContext appDbContext, IMapper mapper) : BaseService<ConcessionariaDto, ConcessionariaModel>(appDbContext, mapper), IConcessionariaService
    {
        public override async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Concessionarias.Include(c => c.ValoresConcessionaria).Include(c => c.PontosMedicao).FirstOrDefaultAsync(c => c.Id.Equals(Id));
            if (!ret.ValoresConcessionaria.IsNullOrEmpty() || !ret.PontosMedicao.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem valores ou pontos de medição vinculados que impossibilitam a exclusão.");

            _appDbContext.Concessionarias.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Concessonária excluída com sucesso.");
        }

        public async Task<Response> ObterPorPontoMedicao(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<DropDownDto>(ConcessionariasFactory.ConcessionariasPorPontoMedicao(Id)).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(res);

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existe concessionária cadastrada.");
        }
    }
}
