using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SIGE.Core.Cache;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Dashboard;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Options;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Services.Services.Administrativo
{
    public class DashboardService(AppDbContext appDbContext, ICacheManager cacheManager, IOptions<CacheOption> option) : IDashboardService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly ICacheManager _cacheManager = cacheManager;
        private readonly CacheDashboardOption _option = option.Value.Dashboard;

        public async Task<Response> ObterChecklist(DateTime mesReferencia)
        {            
            var ret = new Response();
            var checklist = new List<ChecklistDashboardDto>();
            var cacheKey = string.Format(_option.Checklist.Key, mesReferencia.GetCacheKey());

            var cacheResult = await _cacheManager.Get<List<ChecklistDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.ColetaMedicoes(mesReferencia)).OrderBy(s => s.Total).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = $"Coletar de medições de {mesReferencia.AddMonths(-1):MM/yyyy}", Finalizado = res.Total > 0, Link = "pages/medicao" });
            };

            res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.FaturamentoCoenel(mesReferencia)).OrderBy(s => s.Total).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = $"Cadastrar Faturamento Coenel de {mesReferencia.AddMonths(-1):MM/yyyy}", Finalizado = res.Total > 0, Link = "pages/faturamento-coenel" });
            };

            res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.BandeirasVigentes(mesReferencia)).OrderBy(s => s.Total).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = $"Cadastrar Bandeira Tarifária Vigente de {mesReferencia.AddMonths(-1):MM/yyyy}", Finalizado = res.Total > 0, Link = "pages/bandeira-tarifaria" });
            };

            await _cacheManager.Set(cacheKey, checklist, _option.Checklist.Expiration);

            return ret.SetOk().SetData(checklist);
        }

        public async Task<Response> ObterConsumoMeses(DateTime mesReferencia, int meses)
        {
            var ret = new Response();
            var cacheKey = string.Format(_option.ConsumoMeses.Key, mesReferencia.GetCacheKey());

            var cacheResult = await _cacheManager.Get<List<ConsumoMensalDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<ConsumoMensalDashboardDto>(DashboardFactory.ConsumoMeses(mesReferencia, meses)).ToListAsync();
            if (res != null)
            {
                await _cacheManager.Set(cacheKey, res, _option.ConsumoMeses.Expiration);
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterContratosFinalizados(DateTime mesReferencia)
        {
            var ret = new Response();
            var cacheKey = string.Format(_option.ContratosFinalizados.Key, mesReferencia.GetCacheKey());

            var cacheResult = await _cacheManager.Get<List<ContratoFinalizadoDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<ContratoFinalizadoDashboardDto>(DashboardFactory.ContratosFimVigencia(mesReferencia)).ToListAsync();
            if (res != null && res.Count != 0)
            {
                await _cacheManager.Set(cacheKey, res, _option.ContratosFinalizados.Expiration);
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterStatusMedicoes(DateTime mesReferencia)
        {
            var ret = new Response();
            var cacheKey = string.Format(_option.StatusMedicoes.Key, mesReferencia.GetCacheKey());

            var cacheResult = await _cacheManager.Get<List<StatusMedicaoDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<StatusMedicaoDashboardDto>(DashboardFactory.ColetaMedicoes(mesReferencia, true)).ToListAsync();
            if (res != null)
            {
                await _cacheManager.Set(cacheKey, res, _option.StatusMedicoes.Expiration);
                return ret.SetOk().SetData(res);
            };            
            return ret.SetNotFound();
        }
    }
}
