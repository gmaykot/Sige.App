using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;

namespace SIGE.Core.Models.Sistema.Gerencial {

    public class FornecedorModel : BaseModel {
        public string Nome { get; set; }
        public string CNPJ { get; set; }
        public string? TelefoneContato { get; set; }
        public string? TelefoneAlternativo { get; set; }
        public virtual IEnumerable<ContatoModel>? Contatos { get; set; }
        public virtual IEnumerable<ContratoModel>? Contratos { get; set; }
        public virtual IEnumerable<DescontoTusdModel>? DescontosTusd { get; set; }
    }
}