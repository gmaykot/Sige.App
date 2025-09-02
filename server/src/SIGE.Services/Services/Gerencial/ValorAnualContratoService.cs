using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class ValorAnualContratoService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<ValorAnualContratoDto, ValorAnualContratoModel>(appDbContext, mapper, appLogger) {
        public override async Task<Response> Excluir(Guid Id) {
            var ret = await _appDbContext.ValoresAnuaisContrato.Include(v => v.ValoresMensaisContrato).FirstOrDefaultAsync(v => v.Id.Equals(Id));
            if (!ret.ValoresMensaisContrato.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem valores mensais vinculados que impossibilitam a exclusão.");

            _appDbContext.ValoresAnuaisContrato.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }
    }
}
