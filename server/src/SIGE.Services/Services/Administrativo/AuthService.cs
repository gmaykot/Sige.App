﻿using Microsoft.Extensions.Configuration;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using Microsoft.EntityFrameworkCore;
using SIGE.DataAccess.Context;
using AutoMapper;
using SIGE.Core.Extensions;
using SIGE.Services.Custom;
using Microsoft.Extensions.Logging;
using SIGE.Services.Interfaces.Administrativo;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Dto.Administrativo.Usuario;

namespace SIGE.Services.Services.Administrativo
{
    public class AuthService(AppDbContext appDbContext, IConfiguration config, IMapper mapper, ICustomLoggerService loggerService) : IAuthService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IConfiguration _config = config;
        private readonly IMapper _mapper = mapper;
        private readonly ICustomLoggerService _loggerService = loggerService;

        public async Task<Response> Login(LoginRequest req)
        {
            var ret = new Response<TokenDto>();

            await _loggerService.LogAsync(LogLevel.Information, $"Login solicitado por {req.Email}.");

            if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Os dados obrigatorios devem ser preenchidos.");

            var usuario = await _appDbContext.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Email.Equals(req.Email) && u.DataExclusao == null);

            if (usuario == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Usuário não encontrado.");

            if (!usuario.Ativo)
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Usuário não está ativo no sistema.");

            if (!req.Password.VerifyPasswordHash(usuario.PasswordHash, usuario.PasswordSalt))
                return ret.SetUnauthorized().AddError(ETipoErro.ERRO, "A senha digitada não está correta.");

            var menusUsuario = await _appDbContext.MenusUsuarios.AsNoTracking().Include(m => m.MenuSistema).Where(m => m.UsuarioId == usuario.Id && m.MenuSistema.Ativo).OrderBy(m => m.MenuSistema.Ordem).ToListAsync();

            var menuSistemaDto = new List<MenuSistemaDto>();
            foreach (var menu in menusUsuario.Where(m => m.MenuSistema.MenuPredecessorId == null).OrderBy(m => m.MenuSistema.Ordem))
            {
                var menuSistema = _mapper.Map<MenuSistemaDto>(menu.MenuSistema);
                menuSistema.Perfil = menu.TipoPerfil;
                menuSistemaDto.Add(menuSistema);
            }

            foreach (var menu in menusUsuario.Where(m => m.MenuSistema.MenuPredecessorId != null).OrderBy(m => m.MenuSistema.Ordem))
            {
                var menuUsu = menuSistemaDto.Find(m => m.Id == menu.MenuSistema?.MenuPredecessorId);
                menuUsu ??= menuSistemaDto.Where(m => m.children != null).SelectMany(m => m.children).ToList().Find(m => m.Id == menu.MenuSistema?.MenuPredecessorId);

                if (menuUsu != null)
                {
                    menuUsu.children ??= new List<MenuSistemaDto>();
                    var menuSistema = _mapper.Map<MenuSistemaDto>(menu.MenuSistema);
                    menuSistema.Perfil = menu.TipoPerfil;
                    menuUsu.children.Add(menuSistema);
                }
            }

            var jwtSecurityToken = _config.GetSection("System:Config:JwtSecurityToken").Value;
            var token = new TokenDto
            {
                Payload = usuario.GetTokenJWT(jwtSecurityToken),
                MenusUsuario = menuSistemaDto.GetMenuJWT(jwtSecurityToken)
            };

            return ret.SetOk().SetData(token).SetMessage("Login efetuado com sucesso.");
        }
    }
}
