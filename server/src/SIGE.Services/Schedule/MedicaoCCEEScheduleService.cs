using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using SIGE.Core.Options;

namespace SIGE.Services.Schedule
{
    public class MedicaoCCEEScheduleService(IServiceProvider serviceProvider, IOptions<SystemOption> option) : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;
        private readonly SystemOption _option = option.Value;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!_option.EnableSchedule)
                return;

            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.Now;

                if (IsDiaUtil(now) && IsNos5PrimeirosDiasUteis(now))
                {
                    if (now.Hour == 0 || now.Hour == _option.DelaySchedule)
                    {
                        using var scope = _serviceProvider.CreateScope();
                        var service = scope.ServiceProvider.GetRequiredService<MedicaoCCEEScheduleEscoped>();
                        await service.DoWorkAsync();

                        await Task.Delay(TimeSpan.FromHours(_option.DelaySchedule), stoppingToken);
                        continue;
                    }
                }

                // Aguarda até o próximo minuto
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private bool IsDiaUtil(DateTime date) =>
            date.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday;

        private bool IsNos5PrimeirosDiasUteis(DateTime dataAtual)
        {
            var primeiroDia = new DateTime(dataAtual.Year, dataAtual.Month, 1);
            var diasUteis = new List<DateTime>();

            for (int i = 0; diasUteis.Count < 5 && i < 31; i++)
            {
                var dia = primeiroDia.AddDays(i);
                if (dia.Month != dataAtual.Month) break; // passou pro próximo mês
                if (IsDiaUtil(dia))
                    diasUteis.Add(dia);
            }

            return diasUteis.Any(d => d.Date == dataAtual.Date);
        }
    }
}
