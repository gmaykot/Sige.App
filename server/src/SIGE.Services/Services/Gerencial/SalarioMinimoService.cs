using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Gerencial
{
    public class SalarioMinimoService(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<SalarioMinimoDto>
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(SalarioMinimoDto req)
        {
            var empresa = await _appDbContext.SalariosMinimos.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.SalariosMinimos.FindAsync(Id);
            _appDbContext.SalariosMinimos.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(SalarioMinimoDto req)
        {
            var res = _mapper.Map<SalarioMinimoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<SalarioMinimoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.SalariosMinimos.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<SalarioMinimoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.SalariosMinimos.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<SalarioMinimoDto>>(res).OrderByDescending(s => s.VigenciaFinal));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }

        public Task<Response> ObterSource()
        {
            throw new NotImplementedException();
        }
    }
}
