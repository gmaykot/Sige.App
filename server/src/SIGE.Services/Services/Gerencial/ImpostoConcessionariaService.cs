using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Concessionaria;
using SIGE.Core.Models.Sistema.Concessionaria;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Gerencial
{
    public class ImpostoConcessionariaService(AppDbContext appDbContext, IMapper mapper) : IImpostoConcessionariaService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ImpostoConcessionariaDto req)
        {
            var empresa = await _appDbContext.ImpostosConcessionarias.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.ImpostosConcessionarias.FindAsync(Id);
            _appDbContext.ImpostosConcessionarias.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(ImpostoConcessionariaDto req)
        {
            var res = _mapper.Map<ImpostoConcessionariaModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<ImpostoConcessionariaDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.ImpostosConcessionarias.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ImpostoConcessionariaDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.ImpostosConcessionarias.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ImpostoConcessionariaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }

        public async Task<Response> ObterPorConcessionaria(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.ImpostosConcessionarias.Where(i => i.ConcessionariaId == Id).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ImpostoConcessionariaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }
    }
}
