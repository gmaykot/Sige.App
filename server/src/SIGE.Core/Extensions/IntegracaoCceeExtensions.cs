﻿using SIGE.Core.Enumerators.Medicao;
using SIGE.Core.Models.Dto.Administrativo.Ccee;
using SIGE.Core.Models.Sistema.Geral.Medicao;

namespace SIGE.Core.Extensions
{
    public static class IntegracaoCceeExtensions
    {
        public static bool StatusValidoMedicao(this IntegracaoCceeMedidasDto value)
        {
            string[] statusValidos = ["HCC", "HE"];
            return statusValidos.Contains(value.Status);
        }

        public static bool StatusValidoMedicao(this MedicaoModel value)
        {
            return value.Status is EStatusMedicao.HCC or EStatusMedicao.HE;
        }
    }
}
