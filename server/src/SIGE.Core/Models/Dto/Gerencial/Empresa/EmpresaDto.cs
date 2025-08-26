using SIGE.Core.Enumerators;
using SIGE.Core.Models.Dto.Gerencial.Contrato;

namespace SIGE.Core.Models.Dto.Gerencial.Empresa {
    public class EmpresaDto {
        public Guid Id { get; set; }
        public Guid? GestorId { get; set; }
        public Guid? EmpresaMatrizId { get; set; }
        public required string CNPJ { get; set; }
        public string? InscricaoEstadual { get; set; }
        public required string Nome { get; set; }
        public required string NomeFantasia { get; set; }
        public string? DadosCtaUc { get; set; }
        public string? FonteEnergia { get; set; }
        public string? Cep { get; set; }
        public string? Logradouro { get; set; }
        public string? Cidade { get; set; }
        public string? Bairro { get; set; }
        public string? ResponsavelGestor { get; set; }
        public string? SubMercado { get; set; }
        public string? Conexao { get; set; }
        public required string Estado { get; set; }
        public ETipoEmpresa Tipo { get; set; }
        public IEnumerable<AgenteMedicaoDto>? AgentesMedicao { get; set; }
        public IEnumerable<ContatoDto>? Contatos { get; set; }
        public IEnumerable<ContratoEmpresaDto>? ContratosEmpresa { get; set; }
        public bool Ativo { get; set; } = true;

        public virtual bool IsMatriz() =>
            EmpresaMatrizId == null;
    }
}