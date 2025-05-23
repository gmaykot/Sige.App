﻿using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Ccee;

namespace SIGE.Services.Interfaces.Externo
{
    public interface IIntegracaoCceeService
    {
        public Task<Response> ListarMedicoes(IntegracaoCceeBaseDto req);
        public Task<Response> ListarMedicoesPorPonto(IntegracaoCceeBaseDto req);
    }
}
