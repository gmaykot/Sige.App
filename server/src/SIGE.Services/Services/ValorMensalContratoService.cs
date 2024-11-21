using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Contrato;
using SIGE.Core.Models.Sistema.Contrato;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Interfaces
{
    public class ValorMensalContratoService(AppDbContext appDbContext, IMapper mapper) : IValorMensalContratoService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ValorMensalContratoDto req)
        {
            var empresa = await _appDbContext.ValoresMensaisContrato.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.ValoresMensaisContrato.FindAsync(Id);
            _appDbContext.ValoresMensaisContrato.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(ValorMensalContratoDto req)
        {
            var res = _mapper.Map<ValorMensalContratoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetData(_mapper.Map<ValorMensalContratoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.ValoresMensaisContrato.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ValorMensalContratoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.ValoresMensaisContrato.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ValorMensalContratoDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }
    }
}
