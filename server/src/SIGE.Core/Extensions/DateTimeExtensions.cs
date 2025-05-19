namespace SIGE.Core.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime GetHoraInicial(this DateTime dataInicial) =>
            new(dataInicial.Year, dataInicial.Month, dataInicial.Day, 0, 0, 0);

        public static DateTime GetHoraFinal(this DateTime dataFinal) =>
            new(dataFinal.Year, dataFinal.Month, dataFinal.Day, 23, 59, 59);

        public static DateTime GetPrimeiraHoraMes(this DateTime dataInicial) =>
            new(dataInicial.Year, dataInicial.Month, 1, 0, 0, 0);

        public static DateTime GetPrimeiraHoraMes(this DateOnly dataInicial) =>
            new(dataInicial.Year, dataInicial.Month, 1, 0, 0, 0);

        public static DateOnly GetPrimeiroDiaMes(this DateOnly dataInicial) =>
            new(dataInicial.Year, dataInicial.Month, 1);

        public static DateTime GetUltimaHoraMes(this DateTime dataInicial) =>
            dataInicial.GetPrimeiraHoraMes().AddMonths(1).AddSeconds(-1);

        public static DateTime GetUltimaHoraMes(this DateOnly dataInicial) =>
            dataInicial.GetPrimeiraHoraMes().AddMonths(1).AddSeconds(-1);

        public static string GetDiaMes(this DateTime dataInicial) =>
            string.Format("{0}-{1}", dataInicial.Day, dataInicial.Month);

        public static DateTime GetPeriodo(this string periodo) =>
            DateTime.Parse(string.Format("01/{0}", periodo));

        public static string GetCacheKey(this DateTime data) =>
            data.ToString("yyyyMMdd");
    }
}
