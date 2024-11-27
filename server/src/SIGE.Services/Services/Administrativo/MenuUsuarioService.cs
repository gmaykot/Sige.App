using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Menus;
using SIGE.Core.Models.Sistema.Menus;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Administrativo
{
    public class MenuUsuarioService(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<MenuUsuarioDto>
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Obter()
        {
            var menus = await _appDbContext.MenusUsuarios.AsNoTracking().Include(m => m.MenuSistema).Where(m => m.Ativo).OrderBy(m => m.MenuSistema.Ordem).ToListAsync();
            var menuUsuarioDto = new List<MenuUsuarioDto>();
            foreach (var menu in menus)
            {
                var menuDto = _mapper.Map<MenuUsuarioDto>(menu);
                menuDto.DescPredecessor = menuUsuarioDto.Find(m => m.Id == menu.MenuSistema.MenuPredecessorId)?.DescPredecessor;
                menuUsuarioDto.Add(menuDto);
            }
            return new Response<IEnumerable<MenuUsuarioDto>>().SetOk().SetData(menuUsuarioDto);
        }

        public async Task<Response> Alterar(MenuUsuarioDto req)
        {
            var empresa = await _appDbContext.MenusUsuarios.FindAsync(req.Id);
            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados do menu alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var empresa = await _appDbContext.MenusUsuarios.FindAsync(Id);
            _appDbContext.MenusUsuarios.Remove(empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Menu excluído com sucesso.");
        }

        public async Task<Response> Incluir(MenuUsuarioDto req)
        {
            var empresa = _mapper.Map<MenuSistemaModel>(req);
            _ = await _appDbContext.AddAsync(empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Menu cadastrado com sucesso.");
        }

        public Task<Response> Obter(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
