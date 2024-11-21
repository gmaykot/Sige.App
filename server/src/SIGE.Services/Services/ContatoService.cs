using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Fornecedor;
using SIGE.Core.Models.Sistema.Fornecedor;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services
{
    public class ContatoService(AppDbContext appDbContext, IMapper mapper) : IContatoService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ContatoDto req)
        {
            var ret = await _appDbContext.Contatos.FindAsync(req.Id);

            if (!req.Telefone.IsNullOrEmpty())
                req.Telefone = req.Telefone.FormataTelefone();         

            _mapper.Map(req, ret);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Contatos.FindAsync(Id);
            _appDbContext.Contatos.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(ContatoDto req)
        {
            if (!req.Telefone.IsNullOrEmpty())
                req.Telefone = req.Telefone.FormataTelefone();

            var res = _mapper.Map<ContatoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetData(_mapper.Map<ContatoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Contatos.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ContatoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.Contatos.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ContatoDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public async Task<Response> ObterPorFornecedor(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Contatos.Where(c => c.FornecedorId.Equals(Id) && c.RecebeEmail).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ContatoDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }
    }
}
