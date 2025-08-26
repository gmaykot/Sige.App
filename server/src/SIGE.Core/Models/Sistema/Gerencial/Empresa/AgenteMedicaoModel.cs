using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial.Empresa {
    public class AgenteMedicaoModel : BaseModel {
        public required string Nome { get; set; }
        public required string CodigoPerfilAgente { get; set; }
        public required string CodigoAgente { get; set; }
        public Guid EmpresaId { get; set; }
        public EmpresaModel? Empresa { get; set; }

        public virtual IEnumerable<PontoMedicaoModel>? PontosMedicao { get; set; }

    }
}
