namespace SIGE.Core.Models.Dto.Mail
{
    public class EmailFullDataDto : EmailDataDto
    {
        public string? Assunto { get; set; }
        public string? Body { get; set; }
    }
}
