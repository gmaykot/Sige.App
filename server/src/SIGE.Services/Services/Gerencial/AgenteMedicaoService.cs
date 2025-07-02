using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Gerencial
{
    public class AgenteMedicaoService(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<AgenteMedicaoDto>
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(AgenteMedicaoDto req)
        {
            var empresa = await _appDbContext.AgentesMedicao.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.AgentesMedicao.Include(a => a.PontosMedicao).FirstOrDefaultAsync(a => a.Id.Equals(Id));
            if (!ret.PontosMedicao.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError(ETipoErroResponse.DeleteCascadeError.GetValueString(), "Existem pontos de medição vinculados que impossibilitam a exclusão.");

            _appDbContext.AgentesMedicao.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(AgenteMedicaoDto req)
        {
            var res = _mapper.Map<AgenteMedicaoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<AgenteMedicaoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.AgentesMedicao.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<AgenteMedicaoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.AgentesMedicao.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<AgenteMedicaoDto>>(res));

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
