using Microsoft.Extensions.Configuration;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using SIGE.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using SIGE.DataAccess.Context;
using SIGE.Core.Setup;
using SIGE.Core.Models.Sistema.Usuario;
using SIGE.Core.Models.Dto.Usuario;
using AutoMapper;
using SIGE.Core.Extensions;
using SIGE.Services.Custom;
using Microsoft.Extensions.Logging;
using SIGE.Core.Models.Dto.Menus;
using SIGE.Core.Models.Sistema.Menus;

namespace SIGE.Services.Services
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

            foreach (var menu in menusUsuario)
            { 
                if (menu.MenuSistema?.MenuPredecessorId != null)
                {
                    var menuUsu = menuSistemaDto.Find(m => m.Id == menu.MenuSistema?.MenuPredecessorId);
                    menuUsu ??= menuSistemaDto.Where(m => m.children != null).SelectMany(m => m.children).ToList().Find(m => m.Id == menu.MenuSistema?.MenuPredecessorId);                       

                    if (menuUsu != null)
                    {
                        menuUsu.children ??= new List<MenuSistemaDto>();
                        menuUsu.children.Add(_mapper.Map<MenuSistemaDto>(menu.MenuSistema));
                    }                    
                } else 
                    menuSistemaDto.Add(_mapper.Map<MenuSistemaDto>(menu.MenuSistema));
            }

            var jwtSecurityToken = _config.GetSection("System:Config:JwtSecurityToken").Value;
            var token = new TokenDto
            {
                Payload = usuario.GetTokenJWT(jwtSecurityToken),
                MenusUsuario = menuSistemaDto.GetMenuJWT(jwtSecurityToken)
           };

            return ret.SetOk().SetData(token).SetMessage("Login efetuado com sucesso.");
        }

        public async Task<Response> SetupSige(string password)
        {
            var ret = new Response<TokenDto>();
            if (string.IsNullOrEmpty(password) || !password.Equals(_config.GetSection("System:Config:SetupPassoword").Value))
                return ret.SetBadRequest().AddError(ETipoErro.ATENCAO, "A senha de setup deve ser fornecida corretamente.");

            var gestorId = Guid.NewGuid();
            var gestor = AppSetupSige.Gestor(gestorId);
            await _appDbContext.AddAsync(gestor);

            var menuDashboard = new MenuSistemaModel() { Titulo = "Dashboard", Link = "/pages/dashboard", Home = true, Icone = "home-outline" };
            var menuGerencial = new MenuSistemaModel() { Titulo = "Gerencial", Icone = "settings-outline" };
            var menuGeral = new MenuSistemaModel() { Titulo = "Geral", Icone= "folder-outline" };
            var menuAdm = new MenuSistemaModel() { Titulo = "Administrativo", Icone = "lock-outline" };
            var menusGerais = new List<MenuSistemaModel> { menuDashboard, menuGerencial, menuGeral, menuAdm };
            await _appDbContext.AddRangeAsync(menusGerais);

            var menusSistema = new List<MenuSistemaModel>
            {
                new() { Titulo = "Empresas", Link = "/pages/empresas", Icone = "briefcase-outline", MenuPredecessorId = menuGerencial.Id },
                new() { Titulo = "Fornecedores", Link = "/pages/fornecedores", Icone = "people", MenuPredecessorId = menuGerencial.Id },
                new() { Titulo = "Contratos", Link = "/pages/contratos", Icone = "credit-card-outline", MenuPredecessorId = menuGerencial.Id },
                new() { Titulo = "Concessionarias", Link = "/pages/concessionarias", Icone = "flash", MenuPredecessorId = menuGerencial.Id},
                new() { Titulo = "Valores Concessionárias", Link = "/pages/valores-concessionarias", Icone = "keypad-outline", MenuPredecessorId = menuGerencial.Id },
                new() { Titulo = "Análise de Viabilidade", Link = "/pages/analise-viabilidade", Icone = "file-text-outline", MenuPredecessorId = menuGeral.Id, Ativo = false },
                new() { Titulo = "Medição", Link = "/pages/medicao", Icone = "file-text-outline", MenuPredecessorId = menuGeral.Id },
                new() { Titulo = "Relatório de Economia", Link = "/pages/relatorio-economia", Icone = "file-text-outline", MenuPredecessorId = menuGeral.Id },
                new() { Titulo = "Credenciais CCEE", Link = "/pages/credenciais-ccee", Icone = "bulb-outline", MenuPredecessorId = menuAdm.Id },
                new() { Titulo = "Usuários", Link = "/pages/usuarios", Icone = "people-outline", MenuPredecessorId = menuAdm.Id },
            };
            await _appDbContext.AddRangeAsync(menusSistema);

            var usuarios = new List<UsuarioModel>
            {
                AppSetupSige.Usuario(gestorId, "ASBServices", "asbservices", "Admin ASBServices", "asb@services2024"),
                AppSetupSige.Usuario(gestorId, "Conel-DE", "coenel", "Coenel-DE Acessoria em Energia Elétrica", "coenel@de2024")
            };
            await _appDbContext.AddRangeAsync(usuarios);

            menusGerais.AddRange(menusSistema);
            var menusUsuarios = menusGerais.SelectMany(m => usuarios.Select(u => AppSetupSige.MenuUsuario(u.Id, m.Id)));
            await _appDbContext.AddRangeAsync(menusUsuarios);

            await _appDbContext.SaveChangesAsync();

            return ret.SetOk().SetMessage($"Setup incial para '{gestor.Nome}' finalizado com sucesso.");
        }
    }
}
