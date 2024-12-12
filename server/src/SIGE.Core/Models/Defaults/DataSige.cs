using SIGE.Core.Extensions;

namespace SIGE.Core.Models.Defaults
{
    public static class DataSige
    {
        public static DateTime? GetPrimeiraHoraMes() =>
            Hoje().GetPrimeiraHoraMes();

        public static DateTime Hoje()
        {
            string formato = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
            return DateTime.ParseExact(formato, "yyyy-MM-ddTHH:mm:ss", null);
        }

        public static DateOnly HojeDO()
        {
            string formato = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
            return DateOnly.FromDateTime(DateTime.ParseExact(formato, "yyyy-MM-ddTHH:mm:ss", null));
        }

        public static string HojeString()
        {
            string formato = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
            return DateTime.ParseExact(formato, "yyyy-MM-ddTHH:mm:ss", null).ToString();
        }
    }
}
