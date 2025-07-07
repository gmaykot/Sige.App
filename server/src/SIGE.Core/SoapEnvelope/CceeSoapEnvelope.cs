// SoapEnvelope.cs
using System.Text;
using System.Xml.Serialization;
using SIGE.Core.Models.Dto.Administrativo.Ccee;

[XmlRoot(ElementName = "Envelope", Namespace = "http://schemas.xmlsoap.org/soap/envelope/")]
public class SoapEnvelope {
    [XmlNamespaceDeclarations]
    public XmlSerializerNamespaces Xmlns { get; set; }

    public SoapEnvelope() {
        Header = new SoapHeader();
        Body = new SoapBody();
        Xmlns = new XmlSerializerNamespaces();
        Xmlns.Add("soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
        Xmlns.Add("mhv2", "http://xmlns.energia.org.br/MH/v2");
        Xmlns.Add("oas", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd");
        Xmlns.Add("bmv2", "http://xmlns.energia.org.br/BM/v2");
        Xmlns.Add("bov2", "http://xmlns.energia.org.br/BO/v2");
    }

    [XmlElement(ElementName = "Header", Namespace = "http://schemas.xmlsoap.org/soap/envelope/")]
    public SoapHeader Header { get; set; }

    [XmlElement(ElementName = "Body", Namespace = "http://schemas.xmlsoap.org/soap/envelope/")]
    public SoapBody Body { get; set; }

    public static SoapEnvelope FromCredencial(CredencialCceeDto? credencial, string eventoCodigo, string relatorioId, string quadroId) {
        return new SoapEnvelope {
            Header = new SoapHeader {
                MessageHeader = new MessageHeader {
                    CodigoPerfilAgente = credencial.AuthCodigoPerfilAgente,
                    TransactionId = Guid.NewGuid().ToString(),
                    Versao = null
                },
                Paginacao = new Paginacao {
                    Numero = 1,
                    QuantidadeItens = 20
                },
                Security = new SecurityHeader {
                    UsernameToken = new UsernameToken {
                        Username = credencial.AuthUsername,
                        Password = credencial.AuthPassword
                    }
                }
            },
            Body = new SoapBody {
                ListarResultadoRelatorioRequest = new ListarResultadoRelatorioRequest {
                    EventoContabil = new EventoContabil { Codigo = eventoCodigo },
                    Relatorio = new Relatorio { Id = relatorioId },
                    Quadro = new Quadro {
                        Id = quadroId,
                        Parametros = new Parametros {
                            Parametro = new Parametro {
                                Nome = "CODIGO_AGENTE",
                                Valor = credencial.CodigoPonto
                            }
                        }
                    }
                }
            }
        };
    }
}

public class SoapHeader {
    [XmlElement(ElementName = "messageHeader", Namespace = "http://xmlns.energia.org.br/MH/v2")]
    public MessageHeader MessageHeader { get; set; } = new();

    [XmlElement(ElementName = "paginacao", Namespace = "http://xmlns.energia.org.br/MH/v2")]
    public Paginacao Paginacao { get; set; } = new();

    [XmlElement(ElementName = "Security", Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
    public SecurityHeader Security { get; set; } = new();
}

public class MessageHeader {
    [XmlElement(ElementName = "codigoPerfilAgente", Namespace = "http://xmlns.energia.org.br/MH/v2")]
    public string CodigoPerfilAgente { get; set; }

    [XmlElement(ElementName = "transactionId", Namespace = "http://xmlns.energia.org.br/MH/v2")]
    public string TransactionId { get; set; }

    [XmlElement(ElementName = "versao", Namespace = "http://xmlns.energia.org.br/MH/v2", IsNullable = true)]
    public string Versao { get; set; }
}

public class Paginacao {
    [XmlElement(ElementName = "numero", Namespace = "http://xmlns.energia.org.br/MH/v2")]
    public int Numero { get; set; }

    [XmlElement(ElementName = "quantidadeItens", Namespace = "http://xmlns.energia.org.br/MH/v2")]
    public int QuantidadeItens { get; set; }
}

public class Relatorio {
    [XmlElement(ElementName = "id", Namespace = "http://xmlns.energia.org.br/BO/v2")]
    public string Id { get; set; }
}

public class SecurityHeader {
    [XmlElement(ElementName = "UsernameToken", Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
    public UsernameToken UsernameToken { get; set; } = new();
}

public class UsernameToken {
    [XmlElement(ElementName = "Username", Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
    public string Username { get; set; }

    [XmlElement(ElementName = "Password", Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
    public string Password { get; set; }
}

public class SoapBody {
    [XmlElement(ElementName = "listarResultadoRelatorioRequest", Namespace = "http://xmlns.energia.org.br/BM/v2")]
    public ListarResultadoRelatorioRequest ListarResultadoRelatorioRequest { get; set; }
}

public class ListarResultadoRelatorioRequest {
    [XmlElement(ElementName = "eventoContabil", Namespace = "http://xmlns.energia.org.br/BM/v2")]
    public EventoContabil EventoContabil { get; set; } = new();

    [XmlElement(ElementName = "quadro", Namespace = "http://xmlns.energia.org.br/BM/v2")]
    public Quadro Quadro { get; set; } = new();

    [XmlElement(ElementName = "relatorio", Namespace = "http://xmlns.energia.org.br/BM/v2")]
    public Relatorio Relatorio { get; set; } = new();
}

public class EventoContabil {
    [XmlElement(ElementName = "codigo", Namespace = "http://xmlns.energia.org.br/BO/v2")]
    public string Codigo { get; set; }
}

public class Quadro {
    [XmlElement(ElementName = "id", Namespace = "http://xmlns.energia.org.br/BO/v2")]
    public string Id { get; set; }

    [XmlElement(ElementName = "parametros", Namespace = "http://xmlns.energia.org.br/BO/v2")]
    public Parametros Parametros { get; set; } = new();
}

public class Parametros {
    [XmlElement(ElementName = "parametro", Namespace = "http://xmlns.energia.org.br/BO/v2")]
    public Parametro Parametro { get; set; } = new();
}

public class Parametro {
    [XmlElement(ElementName = "nome", Namespace = "http://xmlns.energia.org.br/BO/v2")]
    public string Nome { get; set; }

    [XmlElement(ElementName = "valor", Namespace = "http://xmlns.energia.org.br/BO/v2")]
    public string Valor { get; set; }
}

public static class SoapXmlHelper {
    public static string SerializeSoapEnvelope(SoapEnvelope envelope) {
        var serializer = new XmlSerializer(typeof(SoapEnvelope));
        using var stringWriter = new Utf8StringWriter();
        serializer.Serialize(stringWriter, envelope, envelope.Xmlns);
        return stringWriter.ToString();
    }

    public static SoapEnvelope DeserializeSoapEnvelope(string xml) {
        var serializer = new XmlSerializer(typeof(SoapEnvelope));
        using var reader = new StringReader(xml);
        return (SoapEnvelope)serializer.Deserialize(reader);
    }
}

public class Utf8StringWriter : StringWriter {
    public override Encoding Encoding => Encoding.UTF8;
}