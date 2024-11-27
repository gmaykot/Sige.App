using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Gerencial
{
    public class ValorConcessionariaService(AppDbContext appDbContext, IMapper mapper)
        : IBaseInterface<ValorConcessionariaDto>
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ValorConcessionariaDto req)
        {
            var valores = await _appDbContext.ValoresConcessionaria.FindAsync(req.Id);
            _mapper.Map(req, valores);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados dos valores alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var valores = await _appDbContext.ValoresConcessionaria.FindAsync(Id);
            _appDbContext.ValoresConcessionaria.Remove(valores);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Valores excluídos com sucesso.");
        }

        public async Task<Response> Incluir(ValorConcessionariaDto req)
        {
            var res = _mapper.Map<ValorConcessionariaModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<ValorConcessionariaDto>(res)).SetMessage("Valores cadastradados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.ValoresConcessionaria.FirstOrDefaultAsync(v =>
                v.Id.Equals(Id)
            );
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ConcessionariaDto>(res));

            return ret.SetNotFound()
                .AddError(
                    ETipoErro.INFORMATIVO,
                    $"Não existe valor de concessionária com o id {Id}."
                );
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext
                .ValoresConcessionaria.AsNoTracking()
                .Include(v => v.Concessionaria)
                .ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ValorConcessionariaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existe valor de concessionária ativo.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
