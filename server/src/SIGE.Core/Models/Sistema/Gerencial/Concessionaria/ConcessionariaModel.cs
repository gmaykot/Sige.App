using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Models.Sistema.Gerencial.Concessionaria {

    public class ConcessionariaModel : BaseModel {
        public string Nome { get; set; }
        public ETipoEstado Estado { get; set; }
        public virtual IEnumerable<ImpostoConcessionariaModel>? ImpostosConcessinaria { get; set; }
        public virtual IEnumerable<ValorConcessionariaModel>? ValoresConcessionaria { get; set; }
        public virtual IEnumerable<PontoMedicaoModel>? PontosMedicao { get; set; }
    }
}