using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.BandeiraTarifaria;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Gerencial
{
    public class BandeiraTarifariaService(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<BandeiraTarifariaDto>
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(BandeiraTarifariaDto req)
        {
            var empresa = await _appDbContext.BandeirasTarifarias.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.BandeirasTarifarias.FindAsync(Id);
            _appDbContext.BandeirasTarifarias.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(BandeiraTarifariaDto req)
        {
            var res = _mapper.Map<BandeiraTarifariaModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<BandeiraTarifariaDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.BandeirasTarifarias.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<BandeiraTarifariaDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.BandeirasTarifarias.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<BandeiraTarifariaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
