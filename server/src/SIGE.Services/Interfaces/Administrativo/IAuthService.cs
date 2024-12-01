﻿using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IAuthService
    {
        Task<Response> Login(LoginRequest req);
    }
}
