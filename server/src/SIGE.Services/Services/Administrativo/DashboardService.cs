using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Dashboard;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Geral.Medicao;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Services.Services.Administrativo
{
    public class DashboardService(AppDbContext appDbContext, IMapper mapper) : IDashboardService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> ObterChecklist(DateTime mesReferencia)
        {
            var ret = new Response();
            var checklist = new List<ChecklistDashboardDto>();

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

            return ret.SetOk().SetData(checklist);
        }

        public async Task<Response> ObterConsumoMeses(DateTime mesReferencia, int meses)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<ConsumoMensalDashboardDto>(DashboardFactory.ConsumoMeses(mesReferencia, meses)).ToListAsync();
            if (res != null)
            {
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterContratosFinalizados(DateTime mesReferencia)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<ContratoFinalizadoDashboardDto>(DashboardFactory.ContratosFimVigencia(mesReferencia)).ToListAsync();
            if (res != null && res.Count != 0)
            {
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterStatusMedicoes(DateTime mesReferencia)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<StatusMedicaoDashboardDto>(DashboardFactory.ColetaMedicoes(mesReferencia, true)).ToListAsync();
            if (res != null)
            {
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }
    }
}
