using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class ConcessionariaService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<ConcessionariaDto, ConcessionariaModel>(appDbContext, mapper, appLogger) {
        public override async Task<Response> Excluir(Guid Id) {
            var ret = await _appDbContext.Concessionarias.Include(c => c.ValoresConcessionaria).Include(c => c.PontosMedicao).FirstOrDefaultAsync(c => c.Id.Equals(Id));
            if (!ret.ValoresConcessionaria.IsNullOrEmpty() || !ret.PontosMedicao.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem valores ou pontos de medição vinculados que impossibilitam a exclusão.");

            _appDbContext.Concessionarias.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Concessonária excluída com sucesso.");
        }
    }
}
