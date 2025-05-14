using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class PontoMedicaoService(AppDbContext appDbContext, IMapper mapper) : IPontoMedicaoService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(PontoMedicaoDto req)
        {
            var empresa = await _appDbContext.PontosMedicao.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.PontosMedicao.Include(p => p.ConsumosMensal).FirstOrDefaultAsync(p => p.Id.Equals(Id));
            if (!ret.ConsumosMensal.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem medições vinculadas que impossibilitam a exclusão.");

            _appDbContext.PontosMedicao.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(PontoMedicaoDto req)
        {
            var res = _mapper.Map<PontoMedicaoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<PontoMedicaoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.PontosMedicao.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<PontoMedicaoDto>(res));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.PontosMedicao.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<PontoMedicaoDto>>(res));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        async public Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.PontosMedicao.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        async public Task<Response> ObterDropDownPorEmpresa(Guid EmpresaId)
        {
            var ret = new Response();
            var res = await _appDbContext.PontosMedicao.Include(p => p.AgenteMedicao).Where(a => a.AgenteMedicao.EmpresaId.Equals(EmpresaId)).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        async public Task<Response> ObterDropDownComSegmento()
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<DropDownDto>(PontosMedicaoFactory.ObterDropDownComSegmento()).ToListAsync(); ;
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }
    }
}
