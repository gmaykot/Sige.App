using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SIGE.Core.AppLogger;
using SIGE.Core.Cache;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Dto.Administrativo.OAuth2;
using SIGE.Core.Models.Dto.Administrativo.Usuario;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Options;
using SIGE.DataAccess.Context;
using SIGE.Services.Custom;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Services.Services.Administrativo {
    public class OAuth2Service(ICustomLoggerService loggerService, AppDbContext appDbContext, IMapper mapper, RequestContext requestContext, ICacheManager cacheManager, IOptions<CacheOption> cacheOption, IAppLogger appLogger) : IOAuth2Service {
        private readonly ICustomLoggerService _loggerService = loggerService;
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;
        private readonly RequestContext _requestContext = requestContext;
        private readonly ICacheManager _cacheManager = cacheManager;
        private readonly CacheAuthOption _cacheOption = cacheOption.Value.Auth;
        private readonly IAppLogger _appLogger = appLogger;

        public async Task<TokenDto> Introspect(Guid req) {
            var token = await _appDbContext.Tokens.Include(t => t.Usuario).FirstOrDefaultAsync(t => t.Id.Equals(req));

            if (token == null)
                return new TokenDto();

            if (token.DataExpiracao < DataSige.Hoje())
                token.Ativo = false;
            var res = _mapper.Map<TokenDto>(token);
            res.Usuario = token.Usuario?.Email;
            return res;
        }

        public async Task<Response> Login(LoginRequest req) {
            var ret = new Response();
            await _loggerService.LogAsync(LogLevel.Information, $"Login solicitado por {req.Email}.");

            if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Os dados obrigatorios devem ser preenchidos.");

            var usuario = await _appDbContext.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Email.Equals(req.Email) && u.DataExclusao == null);

            if (usuario == null) {
                _appLogger.LoginSuccess(req.Email, false, "Usuário não encontrado.");
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Usuário não encontrado.");
            }

            if (!usuario.Ativo) {
                _appLogger.LoginSuccess(usuario.Apelido, false, "Usuário não está ativo no sistema.");
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "Usuário não está ativo no sistema.");
            }

            if (!req.Password.VerifyPasswordHash(usuario.PasswordHash, usuario.PasswordSalt)) {
                _appLogger.LoginSuccess(usuario.Apelido, false, "A senha digitada não está correta.");
                return ret.SetUnauthorized().AddError(ETipoErro.ERRO, "A senha digitada não está correta.");
            }

            var token = await _appDbContext.Tokens.FirstOrDefaultAsync(t => t.UsuarioId.Equals(usuario.Id));
            if (token == null) {
                token = new TokenModel() {
                    Ativo = true,
                    UsuarioId = usuario.Id,
                    GestorId = usuario.GestorId,
                    DataExpiracao = DataSige.Hoje().AddHours(8)
                };
                _ = await _appDbContext.Tokens.AddAsync(token);
            }
            else {
                token.Ativo = true;
                token.DataExpiracao = DataSige.Hoje().AddHours(8);
                _appDbContext.Tokens.Update(token);
            }

            _appDbContext.SaveChanges();
            var oauth2 = new OAuth2Dto {
                Auth = new TokenOAuth2Dto { Token = token.Id, RefreshToken = Guid.NewGuid() },
                Menus = await GetMenus(usuario.Id),
                Usuario = new UsuarioOAuth2Dto { UsuarioId = usuario.Id, Apelido = usuario.Apelido, SysAdm = usuario.SysAdm }
            };

            _appLogger.LoginSuccess(usuario.Apelido);

            return ret.SetOk().SetData(oauth2).SetMessage("Login efetuado com sucesso.");
        }

        public async Task<bool> Logout() {
            var tokenModel = await _appDbContext.Tokens.FirstOrDefaultAsync(t => t.Id.Equals(_requestContext.Authorization));
            if (tokenModel != null) {
                tokenModel.Ativo = false;
                tokenModel.DataExpiracao = DataSige.Hoje();

                _appDbContext.Tokens.Update(tokenModel);
                await _appDbContext.SaveChangesAsync();
            }
            return true;
        }

        private async Task<List<MenuSistemaDto>> GetMenus(Guid usuarioId) {
            var cacheKey = string.Format(_cacheOption.MenuUsuario.Key, usuarioId);
            var menusUsuario = await _cacheManager.Get<List<MenuUsuarioModel>>(cacheKey);

            if (menusUsuario == null) {
                menusUsuario = await _appDbContext.MenusUsuarios.AsNoTracking().Include(m => m.MenuSistema).Where(m => m.UsuarioId == usuarioId && m.MenuSistema.Ativo).OrderBy(m => m.MenuSistema.Ordem).ToListAsync();
                await _cacheManager.Set(cacheKey, menusUsuario, _cacheOption.MenuUsuario.Expiration);
            }

            var menuSistemaDto = new List<MenuSistemaDto>();
            foreach (var menu in menusUsuario.Where(m => m.MenuSistema.MenuPredecessorId == null).OrderBy(m => m.MenuSistema.Ordem)) {
                var menuSistema = _mapper.Map<MenuSistemaDto>(menu.MenuSistema);
                menuSistema.Perfil = menu.TipoPerfil;
                menuSistemaDto.Add(menuSistema);
            }

            foreach (var menu in menusUsuario.Where(m => m.MenuSistema.MenuPredecessorId != null).OrderBy(m => m.MenuSistema.Ordem)) {
                var menuUsu = menuSistemaDto.Find(m => m.Id == menu.MenuSistema?.MenuPredecessorId);
                menuUsu ??= menuSistemaDto.Where(m => m.children != null).SelectMany(m => m.children).ToList().Find(m => m.Id == menu.MenuSistema?.MenuPredecessorId);

                if (menuUsu != null) {
                    menuUsu.children ??= new List<MenuSistemaDto>();
                    var menuSistema = _mapper.Map<MenuSistemaDto>(menu.MenuSistema);
                    menuSistema.Perfil = menu.TipoPerfil;
                    menuUsu.children.Add(menuSistema);
                }
            }

            return menuSistemaDto;
        }
    }
}
