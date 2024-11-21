using SIGE.Core.Enumerators;

namespace SIGE.Core.Extensions
{
    public static class CceeSoapExtension
    {
        public static string CreateSoapEnvelope(this ETipoMedicaoCcee tipoMedicaoCCEE, string AuthCodigoPerfilAgente, string AuthUsername, string AuthPassword, string CodigoPonto, DateTime dataInicial, DateTime dataFinal)
        {
            return string.Format(@"<?xml version=""1.0"" encoding=""UTF-8""?>
                                        {0}
                                    <soapenv:Header>
                                        {1}
                                        {2}
                                    </soapenv:Header>
                                    <soapenv:Body>
                                        {3}
                                    </soapenv:Body>
                                </soapenv:Envelope>",
                                tipoMedicaoCCEE.CreateXmlHeaderSoapEnvelope(),
                                tipoMedicaoCCEE.CreateHeaderSoapEnvelope(AuthCodigoPerfilAgente),
                                tipoMedicaoCCEE.CreateSecuritySoapEnvelope(AuthUsername, AuthPassword),
                                tipoMedicaoCCEE.CreateBodySoapEnvelope(CodigoPonto, dataInicial, dataFinal));
        }

        public static string CreateXmlHeaderSoapEnvelope(this ETipoMedicaoCcee tipoMedicaoCCEE)
        {
            switch (tipoMedicaoCCEE)
            {
                case ETipoMedicaoCcee.FINAL:
                case ETipoMedicaoCcee.CONSOLIDADA:
                    return string.Format(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:oas=""http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"" xmlns:v1=""http://xmlns.energia.org.br/MH/v1"" xmlns:v11=""http://xmlns.energia.org.br/BM/v1"" xmlns:v12=""http://xmlns.energia.org.br/BO/v1"">");
                case ETipoMedicaoCcee.FALTANTES:
                    return string.Format(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:oas=""http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"" xmlns:mh=""http://xmlns.energia.org.br/MH/v1"" xmlns:bm=""http://xmlns.energia.org.br/BM/v1"" xmlns:bo=""http://xmlns.energia.org.br/BO/v1"">");
            }
            return string.Empty;
        }

        public static string CreateHeaderSoapEnvelope(this ETipoMedicaoCcee tipoMedicaoCCEE, string AuthCodigoPerfilAgente)
        {
            switch (tipoMedicaoCCEE)
            {
                case ETipoMedicaoCcee.FINAL:
                case ETipoMedicaoCcee.CONSOLIDADA:
                    return string.Format(@"<v1:messageHeader>
                                             <v1:codigoPerfilAgente>{0}</v1:codigoPerfilAgente>
                                           </v1:messageHeader>", AuthCodigoPerfilAgente);
                case ETipoMedicaoCcee.FALTANTES:
                    return string.Format(@"<mh:messageHeader>
                                             <mh:codigoPerfilAgente>{0}</mh:codigoPerfilAgente>
                                           </mh:messageHeader>", AuthCodigoPerfilAgente);
            }
            return string.Empty;
        }

        public static string CreateSecuritySoapEnvelope(this ETipoMedicaoCcee tipoMedicaoCCEE, string AuthUsername, string AuthPassword)
        {
            switch (tipoMedicaoCCEE)
            {
                case ETipoMedicaoCcee.FINAL:
                case ETipoMedicaoCcee.CONSOLIDADA:
                case ETipoMedicaoCcee.FALTANTES:
                    return string.Format(@"<oas:Security>
                                             <oas:UsernameToken>
                                             <oas:Username>{0}</oas:Username>
                                             <oas:Password>{1}</oas:Password>
                                             </oas:UsernameToken>
                                           </oas:Security>", AuthUsername, AuthPassword);
            }
            return string.Empty;
        }

        public static string CreateBodySoapEnvelope(this ETipoMedicaoCcee tipoMedicaoCCEE, string CodigoPonto, DateTime dataInicial, DateTime dataFinal)
        {
            switch (tipoMedicaoCCEE)
            {
                case ETipoMedicaoCcee.FINAL:
                case ETipoMedicaoCcee.CONSOLIDADA:
                    return string.Format(@"<v11:listarMedida>
                                                <v11:pontoMedicao>
                                                <v12:codigo>{0}</v12:codigo>
                                                </v11:pontoMedicao>
                                                <v11:tipoMedida>{1}</v11:tipoMedida>
                                                <v11:periodo>
                                                <v12:inicio>{2}</v12:inicio>
                                                <v12:fim>{3}</v12:fim>
                                                </v11:periodo>
                                            </v11:listarMedida>", CodigoPonto, tipoMedicaoCCEE.GetDescription(), dataInicial.ToString("yyyy-MM-ddTHH:mm:ss"), dataFinal.ToString("yyyy-MM-ddTHH:mm:ss"));
                case ETipoMedicaoCcee.FALTANTES:
                    return string.Format(@"<bm:listarMedida>
                                                <bm:medidor>
                                                  <bo:codigo>{0}</bo:codigo>
                                                </bm:medidor>
                                                <bm:tipoMedida>{1}</bm:tipoMedida>
                                                <bm:periodo>
                                                  <bo:inicio>{2}</bo:inicio>
                                                  <bo:fim>{3}</bo:fim>
                                                </bm:periodo>
                                            </bm:listarMedida>", CodigoPonto, tipoMedicaoCCEE.GetDescription(), dataInicial.ToString("yyyy-MM-ddTHH:mm:ss"), dataFinal.ToString("yyyy-MM-ddTHH:mm:ss"));
            }
            return string.Empty;
        }

        public static string XmlSanitazer(this string xmlContent) =>
            xmlContent.Replace(":", "");
    }
}
