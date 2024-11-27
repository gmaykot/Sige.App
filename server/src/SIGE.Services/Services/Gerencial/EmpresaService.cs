using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Empresa;
using SIGE.Core.Models.Sistema.Empresa;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Gerencial
{
    public class EmpresaService(
        AppDbContext appDbContext,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor
    ) : IBaseInterface<EmpresaDto>
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(EmpresaDto req)
        {
            var empresa = await _appDbContext.Empresas.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Empresas.Include(e => e.Contatos).Include(e => e.ContratosEmpresa).Include(e => e.AgentesMedicao).FirstOrDefaultAsync(e => e.Id.Equals(Id));
            if (!ret.Contatos.IsNullOrEmpty() || !ret.ContratosEmpresa.IsNullOrEmpty() || !ret.AgentesMedicao.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem contatos, contratos ou agentes de medição vinculados que impossibilitam a exclusão.");

            _appDbContext.Empresas.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");

        }

        public async Task<Response> Incluir(EmpresaDto req)
        {
            req.GestorId = _httpContextAccessor.GetGestorId();
            var res = _mapper.Map<EmpresaModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<EmpresaDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Empresas.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<EmpresaDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.Empresas.Include(e => e.Contatos).Include(e => e.AgentesMedicao)
                .ThenInclude(a => a.PontosMedicao)
                .ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<EmpresaDto>>(res.OrderBy(e => e.NomeFantasia)));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados");
        }

        public async Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.Empresas.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }
    }
}
