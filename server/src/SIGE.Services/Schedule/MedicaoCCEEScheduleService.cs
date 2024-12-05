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
            if (_option.EnableSchedule)
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var service = scope.ServiceProvider.GetRequiredService<MedicaoCCEEScheduleEscoped>();
                        service.DoWorkAsync();

                        await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
                    }
                }               
            }
        }
    }
}
