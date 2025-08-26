using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class ContratoService(AppDbContext appDbContext, IMapper mapper) : BaseService<ContratoDto, ContratoModel>(appDbContext, mapper), IContratoService
    {
        public override async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Contratos.Include(c => c.ValoresAnuaisContrato).FirstOrDefaultAsync(c => c.Id.Equals(Id));
            if (!ret.ValoresAnuaisContrato.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem valores anuais vinculados que impossibilitam a exclusão.");

            _appDbContext.Contratos.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Contrato excluído com sucesso.");
        }

        public async Task<Response> ExcluirEmpresaGrupo(Guid Id)
        {
            var ret = await _appDbContext.ContratoEmpresas.FirstOrDefaultAsync(c => c.Id.Equals(Id));
            if (ret == null)
                return new Response().SetServiceUnavailable().AddError("Entity", "Não foi possível desvincular a empresa do grupo.");

            _appDbContext.ContratoEmpresas.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Empresa desvinculada do grupo com sucesso.");
        }

        public async Task<Response> IncluirEmpresaGrupo(ContratoEmpresaDto req)
        {
            var ret = new Response();
            var res = await _appDbContext.ContratoEmpresas.FirstOrDefaultAsync(c => c.ContratoId.Equals(req.ContratoId) && c.EmpresaId.Equals(req.EmpresaId));
            if (res == null)
            {
                var cont = _mapper.Map<ContratoEmpresaModel>(req);

                _ = await _appDbContext.AddAsync(cont);
                _ = await _appDbContext.SaveChangesAsync();

                return ret.SetCreated().SetData(_mapper.Map<ContratoEmpresaDto>(cont)).SetMessage("Empresa incluída no grupo com sucesso.");
            }
            return ret.SetBadRequest().AddError("Existente", "Empresa já pertence ao grupo.");
        }
    }
}
