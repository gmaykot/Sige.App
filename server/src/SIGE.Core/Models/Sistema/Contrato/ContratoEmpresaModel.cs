﻿using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Empresa;

namespace SIGE.Core.Models.Sistema.Contrato
{
    public class ContratoEmpresaModel : BaseModel
    {
        public Guid ContratoId { get; set; }
        public virtual ContratoModel? Contrato { get; set; }
        public Guid EmpresaId { get; set; }
        public virtual EmpresaModel? Empresa { get; set; }
    }
}
