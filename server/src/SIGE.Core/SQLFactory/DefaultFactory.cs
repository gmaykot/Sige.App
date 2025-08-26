namespace SIGE.Core.SQLFactory
{
    public static class DefaultFactory
    {
        public static string RegistroAtivo(string alias, bool filtroAtivo = true) =>
            filtroAtivo
                ? $@"{alias}.Ativo IS true AND {alias}.DataExclusao IS null"
                : $@"{alias}.DataExclusao IS null";
    }
}
