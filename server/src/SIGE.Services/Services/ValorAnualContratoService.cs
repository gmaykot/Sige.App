using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Contrato;
using SIGE.Core.Models.Sistema.Contrato;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Interfaces
{
    public class ValorAnualContratoService(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<ValorAnualContratoDto>
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ValorAnualContratoDto req)
        {
            var empresa = await _appDbContext.ValoresAnuaisContrato.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.ValoresAnuaisContrato.Include(v => v.ValoresMensaisContrato).FirstOrDefaultAsync(v => v.Id.Equals(Id));
            if (!ret.ValoresMensaisContrato.IsNullOrEmpty())
                return (new Response()).SetServiceUnavailable().AddError("Entity", "Existem valores mensais vinculados que impossibilitam a exclusão.");

            _appDbContext.ValoresAnuaisContrato.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(ValorAnualContratoDto req)
        {
            var res = _mapper.Map<ValorAnualContratoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetData(_mapper.Map<ValorAnualContratoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.ValoresAnuaisContrato.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ValorAnualContratoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.ValoresAnuaisContrato.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ValorAnualContratoDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
