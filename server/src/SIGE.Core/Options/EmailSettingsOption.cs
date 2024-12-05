namespace SIGE.Core.Options
{
    public class EmailSettingsOption
    {
        public required string Server { get; set; }
        public string? Imap { get; set; }
        public required int Port { get; set; }
        public int? ImapPort { get; set; }
        public required string SenderName { get; set; }
        public required string SenderEmail { get; set; }
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public required string ContactPhone { get; set; }
        public required string ContactMail { get; set; }
    }
}
