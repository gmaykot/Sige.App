﻿using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Contrato;

namespace SIGE.Core.Models.Sistema.Concessionaria
{
    public class ConcessionariaModel : BaseModel
    {
        public required string Nome { get; set; }
        public ETipoEstado Estado { get; set; }
        public Guid GestorId { get; set; }
        public virtual GestorModel? Gestor { get; set; }
        public virtual IEnumerable<ValorConcessionariaModel>? ValoresConcessionaria { get; set; }
        public virtual IEnumerable<ContratoModel>? Contratos { get; set; }
    }
}
