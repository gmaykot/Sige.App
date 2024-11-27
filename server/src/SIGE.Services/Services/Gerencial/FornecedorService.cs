using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Fornecedor;
using SIGE.Core.Models.Sistema.Fornecedor;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Gerencial
{
    public class FornecedorService(AppDbContext appDbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor) : IBaseInterface<FornecedorDto>
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(FornecedorDto req)
        {
            var fornecedor = await _appDbContext.Fornecedores.FindAsync(req.Id);

            if (!req.TelefoneContato.IsNullOrEmpty())
                req.TelefoneContato = req.TelefoneContato.FormataTelefone();

            if (!req.TelefoneAlternativo.IsNullOrEmpty())
                req.TelefoneAlternativo = req.TelefoneAlternativo.FormataTelefone();

            _mapper.Map(req, fornecedor);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados da empresa alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Fornecedores.Include(f => f.Contatos).Include(f => f.Contratos).FirstOrDefaultAsync(f => f.Id.Equals(Id));
            if (!ret.Contatos.IsNullOrEmpty() || !ret.Contratos.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem contatos ou contratos vinculados que impossibilitam a exclusão.");

            _appDbContext.Fornecedores.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Fornecedor excluído com sucesso.");
        }

        public async Task<Response> Incluir(FornecedorDto req)
        {
            req.GestorId = _httpContextAccessor.GetGestorId();
            if (!req.TelefoneContato.IsNullOrEmpty())
                req.TelefoneContato = req.TelefoneContato.FormataTelefone();

            if (!req.TelefoneAlternativo.IsNullOrEmpty())
                req.TelefoneAlternativo = req.TelefoneAlternativo.FormataTelefone();

            var fornecedor = _mapper.Map<FornecedorModel>(req);
            _ = await _appDbContext.AddAsync(fornecedor);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<FornecedorDto>(fornecedor)).SetMessage("Fornecedor cadastrado com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Fornecedores.FirstOrDefaultAsync(e => e.Id.Equals(Id));
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<FornecedorDto>(res));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe fornecedor com o id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.Fornecedores.Include(f => f.Contatos).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FornecedorDto>>(res.OrderBy(f => f.Nome)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe fornecedor ativo.");
        }

        public async Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.Fornecedores.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe fornecedor ativa.");
        }
    }
}
