namespace SIGE.Core.Options
{
    public class CacheOption
    {
        public int AbsoluteExpiration { get; set; }
        public int Expiration { get; set; }
        public int Priority { get; set; }
        public required CacheAuthOption Auth { get; set; }
        public required CacheDashboardOption Dashboard { get; set; }
    }

    public class CacheAuthOption
    {
        public required CacheChildrenKeysOption MenuUsuario { get; set; }
    }

    public class CacheDashboardOption
    {
        public required CacheChildrenKeysOption Checklist { get; set; }
        public required CacheChildrenKeysOption ConsumoMeses { get; set; }
        public required CacheChildrenKeysOption ContratosFinalizados { get; set; }
        public required CacheChildrenKeysOption StatusMedicoes { get; set; }
    }

    public class CacheChildrenKeysOption
    {
        public required string Key { get; set; }
        public int? Expiration { get; set; }
    }
}
