using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace SIGE.Services.Schedule
{
    public class MedicaoCCEEScheduleService : BackgroundService
    {
        private readonly IConfiguration _config;
        private readonly IServiceProvider _serviceProvider;

        public MedicaoCCEEScheduleService(IConfiguration config, IServiceProvider serviceProvider)
        {
            _config = config;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (bool.Parse(_config.GetSection("System:Config:EnableSchedule").Value))
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
