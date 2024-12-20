﻿using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial
{
    public class SalarioMinimoModel : BaseModel
    {
        public required DateTime VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }
        public required double Valor { get; set; }
    }
}
