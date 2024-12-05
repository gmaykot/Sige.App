namespace SIGE.Core.Options
{
    public class SystemOption
    {
        public required bool EnableSchedule { get; set; }
        public required int DelaySchedule { get; set; }
        public required string JwtSecurityToken { get; set; }
    }
}
