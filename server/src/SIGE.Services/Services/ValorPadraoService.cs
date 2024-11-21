using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services
{
    public class ValorPadraoService(AppDbContext appDbContext, IMapper mapper) : IValorPadraoService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ValorPadraoDto req)
        {
            var empresa = await _appDbContext.ValoresPadroes.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.ValoresPadroes.FindAsync(Id);
            _appDbContext.ValoresPadroes.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(ValorPadraoDto req)
        {
            var res = _mapper.Map<ValorPadraoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetData(_mapper.Map<ValorPadraoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.ValoresPadroes.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ValorPadraoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.ValoresPadroes.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ValorPadraoDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }
    }
}
