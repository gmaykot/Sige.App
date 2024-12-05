using Microsoft.EntityFrameworkCore;
using SIGE.Core.Cache;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Dashboard;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Services.Services.Administrativo
{
    public class DashboardService(AppDbContext appDbContext, ICacheManager cacheManager) : IDashboardService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly ICacheManager _cacheManager = cacheManager;

        public async Task<Response> ObterChecklist(DateTime mesReferencia)
        {            
            var ret = new Response();
            var checklist = new List<ChecklistDashboardDto>();
            var cacheKey = $"ObterChecklist{mesReferencia:ddMMyyyy}";

            var cacheResult = await _cacheManager.Get<List<ChecklistDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.ColetaMedicoes(mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = "Coletar de medições de 11/2024", Finalizado = res.Total > 0, Link = "pages/medicao" });
            };

            res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.FaturamentoCoenel(mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = "Cadastrar Faturamento Coenel de 11/2024", Finalizado = res.Total > 0, Link = "pages/faturamento-coenel" });
            };

            res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.BandeirasVigentes(mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = "Cadastrar Bandeira Tarifária Vigente de 11/2024", Finalizado = res.Total > 0, Link = "pages/bandeira-tarifaria" });
            };

            await _cacheManager.Set(cacheKey, checklist);

            return ret.SetOk().SetData(checklist);
        }

        public async Task<Response> ObterConsumoMeses(DateTime mesReferencia, int meses)
        {
            var ret = new Response();
            var cacheKey = $"ObterConsumoMeses{mesReferencia:ddMMyyyy}";

            var cacheResult = await _cacheManager.Get<List<ConsumoMensalDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<ConsumoMensalDashboardDto>(DashboardFactory.ConsumoMeses(mesReferencia, meses)).ToListAsync();
            if (res != null)
            {
                await _cacheManager.Set(cacheKey, res);
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterContratosFinalizados(DateTime mesReferencia)
        {
            var ret = new Response();
            var cacheKey = $"ObterContratosFinalizados{mesReferencia:ddMMyyyy}";

            var cacheResult = await _cacheManager.Get<List<ContratoFinalizadoDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<ContratoFinalizadoDashboardDto>(DashboardFactory.ContratosFimVigencia(mesReferencia)).ToListAsync();
            if (res != null && res.Count != 0)
            {
                await _cacheManager.Set(cacheKey, res);
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterStatusMedicoes(DateTime mesReferencia)
        {
            var ret = new Response();
            var cacheKey = $"ObterStatusMedicoes{mesReferencia:ddMMyyyy}";

            var cacheResult = await _cacheManager.Get<List<StatusMedicaoDashboardDto>>(cacheKey);
            if (cacheResult != null)
                return ret.SetOk().SetData(cacheResult);

            var res = await _appDbContext.Database.SqlQueryRaw<StatusMedicaoDashboardDto>(DashboardFactory.ColetaMedicoes(mesReferencia, true)).ToListAsync();
            if (res != null)
            {
                await _cacheManager.Set(cacheKey, res);
                return ret.SetOk().SetData(res);
            };            
            return ret.SetNotFound();
        }
    }
}
