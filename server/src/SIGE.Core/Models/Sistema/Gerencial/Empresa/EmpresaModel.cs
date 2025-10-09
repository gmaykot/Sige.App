using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;

namespace SIGE.Core.Models.Sistema.Gerencial.Empresa {

    public class EmpresaModel : BaseModel {
        public string CNPJ { get; set; }
        public string? InscricaoEstadual { get; set; }
        public string Nome { get; set; }
        public string NomeFantasia { get; set; }
        public string? DadosCtaUc { get; set; }
        public string? FonteEnergia { get; set; }
        public string? Cep { get; set; }
        public string? Logradouro { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? ResponsavelGestor { get; set; }
        public string? SubMercado { get; set; }
        public string? Conexao { get; set; }
        public bool UnirPontosMedicao { get; set; } = false;
        public ETipoEstado Estado { get; set; }
        public ETipoEmpresa Tipo { get; set; }

        public Guid? EmpresaMatrizId { get; set; }
        public EmpresaModel? EmpresaMatriz { get; set; }

        public virtual IEnumerable<ContratoEmpresaModel>? ContratosEmpresa { get; set; }
        public virtual IEnumerable<AgenteMedicaoModel>? AgentesMedicao { get; set; }
        public virtual IEnumerable<ContatoModel>? Contatos { get; set; }
    }
}