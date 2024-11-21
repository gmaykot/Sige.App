using System.Text.RegularExpressions;

namespace SIGE.Core.Extensions
{
    public static class Utils
    {
        public static string NullToString(this object? Value) =>
            Value.ToString() ?? string.Empty;

        public static DateTime ToDate(this DateTime? data)
        {
            if (data == null)
                return default(DateTime);

            return (DateTime)data;
        }

        public static Guid ToGuid(this Guid? guid)
        {
            if (guid == null)
                return default(Guid);

            return (Guid)guid;
        }

        public static double Round(this double value) =>
            Math.Round(value, 4);

        public static string FormataTelefone(this string telefone)
        {
            if (telefone.Length == 10)
            {
                return Regex.Replace(telefone, @"(\d{2})(\d{4})(\d{4})", "($1) $2-$3");
            }
            else if (telefone.Length == 11)
            {
                return Regex.Replace(telefone, @"(\d{2})(\d{5})(\d{4})", "($1) $2-$3");
            }
            return telefone; // Retorna o original se não for um número válido
        }
    }
}
