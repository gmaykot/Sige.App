using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class EmpresaService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<EmpresaDto, EmpresaModel>(appDbContext, mapper, appLogger) {
        public override async Task<Response> Excluir(Guid Id) {
            var ret = await _appDbContext.Empresas.Include(e => e.Contatos).Include(e => e.ContratosEmpresa).Include(e => e.AgentesMedicao).FirstOrDefaultAsync(e => e.Id.Equals(Id));
            if (!ret.Contatos.IsNullOrEmpty() || !ret.ContratosEmpresa.IsNullOrEmpty() || !ret.AgentesMedicao.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem contatos, contratos ou agentes de medição vinculados que impossibilitam a exclusão.");

            _appDbContext.Empresas.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }
    }
}
