namespace SIGE.Core.Extensions
{
    public static class EmailExtensions
    {
        public static string GetEmailTemplate(string recipientName, string month, string phoneNumber, string emailAddress, string empresa)
        {
            string template = @"
                <!DOCTYPE html>
                <html lang=""pt-BR"">
                <head>
                  <meta charset=""UTF-8"">
                  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                  <title>Relatório de Medição - {1} - {4}</title>
                  <style>
                    /* Estilos gerais */
                    body {{
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                      margin: 0;
                      padding: 0;
                    }}
                    .container {{
                      max-width: 600px;
                      margin: auto;
                      padding: 20px;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                      background-color: #f9f9f9;
                    }}
                    /* Estilos do cabeçalho */
                    header {{
                      text-align: center;
                    }}
                    header img {{
                      max-width: 300px;
                      height: auto;
                    }}
                    /* Estilos do corpo */
                    .content {{
                      padding-bottom: 10px;
                    }}
                    /* Estilos do rodapé */
                    footer {{
                      text-align: center;
                      font-size: 12px;
                      color: #666;
                    }}
                  </style>
                </head>
                <body>
                  <div class=""container"">
                    <header>
                      <img src=""https://sigeonline.icu/assets/images/logo.png"" alt=""Coenel - DE"">
                      <h2>Relatório de Medição</h2>
                    </header>
                    <div class=""content"">
                      <p><b>Prezados</b>,</p>
                      <p>Segue em anexo o relatório referente ao período de <b>{1}</b>.</p>
                      <p>Caso tenha alguma dúvida, entre em contato conosco pelos telefones <b>{2}</b> ou pelo e-mail <b>{3}</b></p>
                      <p>Atenciosamente,<br>Equipe Coenel</p>
                    </div>
                    <footer>
                      <p>© 2024 Coenel-DE – Assessoria em Energia Elétrica. Todos os direitos reservados.</p>
                    </footer>
                  </div>
                </body>
                </html>
            ";
            template = string.Format(template, recipientName, month, phoneNumber, emailAddress, empresa);

            return template;
        }
    }
}
