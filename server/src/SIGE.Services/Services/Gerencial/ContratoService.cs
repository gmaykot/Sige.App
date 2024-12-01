using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class ContratoService(AppDbContext appDbContext, IMapper mapper) : IContratoService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ContratoDto req)
        {
            var contrato = await _appDbContext.Contratos.FindAsync(req.Id);

            _mapper.Map(req, contrato);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados do contrato alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
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

        public async Task<Response> Incluir(ContratoDto req)
        {
            var res = _mapper.Map<ContratoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<ContratoDto>(res)).SetMessage("Contrato cadastrado com sucesso.");
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

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Contratos.FirstOrDefaultAsync(e => e.Id.Equals(Id));
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ContratoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe contrato com o id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.Contratos.AsNoTracking()
                .Include(c => c.Fornecedor)
                .Include(c => c.Concessionaria)
                .Include(c => c.ContratoEmpresas).ThenInclude(c => c.Empresa)
                .Include(c => c.ValoresAnuaisContrato)
                .ThenInclude(c => c.ValoresMensaisContrato)
                .ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ContratoDto>>(res.OrderBy(c => c.DscGrupo)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe contrato ativo.");
        }

        public async Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.Contratos.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existe fornecedor ativa.");
        }
    }
}
