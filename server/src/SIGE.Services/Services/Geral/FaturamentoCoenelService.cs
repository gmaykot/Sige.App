using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.BandeiraTarifaria;
using SIGE.Core.Models.Dto.FaturmentoCoenel;
using SIGE.Core.Models.Sistema.BandeiraTarifaria;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class FaturamentoCoenelService(AppDbContext appDbContext, IMapper mapper) : IFaturamentoCoenelService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(FaturamentoCoenelDto req)
        {
            var empresa = await _appDbContext.FaturamentosCoenel.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.FaturamentosCoenel.FindAsync(Id);
            _appDbContext.FaturamentosCoenel.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(FaturamentoCoenelDto req)
        {
            var res = _mapper.Map<BandeiraTarifariaModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<FaturamentoCoenelDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.FaturamentosCoenel.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<FaturamentoCoenelDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            //TODO SQL nativa, trazer apenas o último registro
            var ret = new Response();
            var res = await _appDbContext.FaturamentosCoenel.Include(f => f.PontoMedicao).ThenInclude(p => p.AgenteMedicao).ThenInclude(a => a.Empresa).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturamentoCoenelDto>>(res).OrderBy(f => f.DescEmpresa).ThenBy(f => f.DescPontoMedicao).ThenBy(f => f.VigenciaInicial));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }

        public async Task<Response> ObterPorPontoMedicao(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.FaturamentosCoenel.Include(f => f.PontoMedicao).ThenInclude(p => p.AgenteMedicao).ThenInclude(a => a.Empresa).Where(f => f.PontoMedicaoId.Equals(Id)).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturamentoCoenelDto>>(res).OrderBy(f => f.DescEmpresa).ThenBy(f => f.DescPontoMedicao).ThenBy(f => f.VigenciaInicial));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o ponto de medição {Id}.");
        }
    }
}
