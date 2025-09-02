using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.AppLogger;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class AgenteMedicaoService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<AgenteMedicaoDto, AgenteMedicaoModel>(appDbContext, mapper, appLogger) {
        public override async Task<Response> Excluir(Guid Id) {
            var ret = await _appDbContext.AgentesMedicao.Include(a => a.PontosMedicao).FirstOrDefaultAsync(a => a.Id.Equals(Id));
            if (!ret.PontosMedicao.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError(ETipoErroResponse.DeleteCascadeError.GetValueString(), "Existem pontos de medição vinculados que impossibilitam a exclusão.");

            _appDbContext.AgentesMedicao.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            _appLogger.LogDeleteObject($"Agente de Medição {ret.Nome}", Id);

            return new Response().SetOk().SetMessage("Registro excluído com sucesso.");
        }
    }
}
