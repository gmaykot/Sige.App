namespace SIGE.Core.Options
{
    public class EmailSettingsOptions
    {
        public string Server { get; set; }
        public string Imap { get; set; }
        public int Port { get; set; }
        public int ImapPort { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ContactPhone { get; set; }
        public string ContactMail { get; set; }
    }
}
