using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MySqlConnector;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Dto.Source;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class FornecedorService(AppDbContext appDbContext, IMapper mapper) : BaseService<FornecedorDto, FornecedorModel>(appDbContext, mapper) {
        public override async Task<Response> Alterar(FornecedorDto req) {
            var fornecedor = await _appDbContext.Fornecedores.FindAsync(req.Id);

            if (!req.TelefoneContato.IsNullOrEmpty())
                req.TelefoneContato = req.TelefoneContato.FormataTelefone();

            if (!req.TelefoneAlternativo.IsNullOrEmpty())
                req.TelefoneAlternativo = req.TelefoneAlternativo.FormataTelefone();
            req.GestorId = fornecedor.GestorId;
            _mapper.Map(req, fornecedor);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados da empresa alterados com sucesso.");
        }

        public override async Task<Response> Excluir(Guid Id) {
            var ret = await _appDbContext.Fornecedores.Include(f => f.Contatos).Include(f => f.Contratos).FirstOrDefaultAsync(f => f.Id.Equals(Id));
            if (!ret.Contatos.IsNullOrEmpty() || !ret.Contratos.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem contatos ou contratos vinculados que impossibilitam a exclusão.");

            _appDbContext.Fornecedores.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Fornecedor excluído com sucesso.");
        }

        public override async Task<Response> ObterSource() {
            return await ExecutarSource<FornecedorSourceDto>(SourceFactory.Fornecedores());
        }

        public override async Task<Response> Load(Guid id) {
            var parameters = new MySqlParameter[]
            {
                new("@Id", MySqlDbType.Guid) { Value = id },
            };
            return await ExecutarSource<FornecedorSourceDto>(CarregarFactory.Fornecedores(), parameters);
        }
    }
}
