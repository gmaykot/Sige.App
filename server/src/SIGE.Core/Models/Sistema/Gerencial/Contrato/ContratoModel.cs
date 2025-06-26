using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial.Contrato
{
    public class ContratoModel : BaseModel
    {
        public required string Numero { get; set; }
        public required string DscGrupo { get; set; }
        public required DateTime DataBase { get; set; }
        public required DateTime DataVigenciaInicial { get; set; }
        public required DateTime DataVigenciaFinal { get; set; }
        public required decimal TakeMinimo { get; set; }
        public required decimal TakeMaximo { get; set; }
        public required EStatusContrato Status { get; set; }
        public required ETipoEnergia TipoEnergia { get; set; }
        public required ETipoSegmento Segmento { get; set; }

        public Guid FornecedorId { get; set; }
        public virtual FornecedorModel? Fornecedor { get; set; }
        public IEnumerable<ContratoEmpresaModel>? ContratoEmpresas { get; set; }
        public virtual IEnumerable<ValorAnualContratoModel>? ValoresAnuaisContrato { get; set; }
    }
}