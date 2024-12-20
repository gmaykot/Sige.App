﻿using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial;

namespace SIGE.Core.Models.Sistema.Geral.Medicao
{
    public class AgenteMedicaoModel : BaseModel
    {
        public required string Nome { get; set; }
        public required string CodigoPerfilAgente { get; set; }
        public Guid EmpresaId { get; set; }
        public EmpresaModel? Empresa { get; set; }
        public virtual IEnumerable<PontoMedicaoModel>? PontosMedicao { get; set; }

    }
}
