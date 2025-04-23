using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Ocsp;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Geral.Medicao;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class ConcessionariaService(
        AppDbContext appDbContext,
        IMapper mapper,
        RequestContext requestContext
    ) : IConcessionariaService
    {
        private readonly RequestContext _requestContext = requestContext;
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(ConcessionariaDto req)
        {
            var conces = await _appDbContext.Concessionarias.FindAsync(req.Id);
            _mapper.Map(req, conces);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response()
                .SetOk()
                .SetMessage("Dados da concessoinária alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Concessionarias.Include(c => c.ValoresConcessionaria).Include(c => c.Contratos).FirstOrDefaultAsync(c => c.Id.Equals(Id));
            if (!ret.ValoresConcessionaria.IsNullOrEmpty() || !ret.Contratos.IsNullOrEmpty())
                return new Response().SetServiceUnavailable().AddError("Entity", "Existem valores ou contratos vinculados que impossibilitam a exclusão.");

            _appDbContext.Concessionarias.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Concessonária excluída com sucesso.");
        }

        public async Task<Response> Incluir(ConcessionariaDto req)
        {
            req.GestorId = _requestContext.GestorId;
            var res = _mapper.Map<ConcessionariaModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<ConcessionariaDto>(res)).SetMessage("Concessionária cadastrada com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Concessionarias.FirstOrDefaultAsync(c => c.Id.Equals(Id));
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<ConcessionariaDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe concessionária com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.Concessionarias.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<ConcessionariaDto>>(res.OrderBy(c => c.Nome)));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existe concessionária cadastrada.");
        }

        public async Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.Concessionarias.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existe concessionária cadastrada.");
        }

        public async Task<Response> ObterPorPontoMedicao(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<DropDownDto>(ConcessionariasFactory.ConcessionariasPorPontoMedicao(Id)).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(res);

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existe concessionária cadastrada.");
        }
    }
}
