﻿using SIGE.Core.Models.Defaults;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Sistema.Geral.Medicao
{
    public class MedicoesModel : NewBaseModel
    {
        public DateTime Periodo { get; set; }
        public string? SubTipo { get; set; }
        public string? Status { get; set; }
        public float ConsumoAtivo { get; set; }

        [ForeignKey("ConsumoMensal")]
        public int ConsumoMensalId { get; set; }

        public virtual ConsumoMensalModel? ConsumoMensal { get; set; }

    }
}
