using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Gerencial.Contrato
{
    public class ContratoDto
    {
        public Guid? Id { get; set; }
        public required string Numero { get; set; }
        public required string DscGrupo { get; set; }
        public DateTime? DataBase { get; set; }
        public DateTime? DataVigenciaInicial { get; set; }
        public DateTime? DataVigenciaFinal { get; set; }
        public required decimal TakeMinimo { get; set; }
        public required decimal TakeMaximo { get; set; }
        public required EStatusContrato Status { get; set; }
        public required ETipoEnergia TipoEnergia { get; set; }
        public required ETipoSegmento Segmento { get; set; }
        public Guid? FornecedorId { get; set; }
        public string? DescFornecedor { get; set; }
        public Guid? ConcessionariaId { get; set; }
        public string? DescConcessionaria { get; set; }
        public IEnumerable<ContratoEmpresaDto>? ContratoEmpresas { get; set; }
        public IEnumerable<ValorAnualContratoDto>? ValoresAnuaisContrato { get; set; }
    }
}
