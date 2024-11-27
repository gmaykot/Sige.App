using AutoMapper;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Usuario;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Sistema.Usuario;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Models.Sistema.Menus;

namespace SIGE.Services.Services.Administrativo
{
    public class UsuarioService(AppDbContext appDbContext, IMapper mapper) : IUsuarioService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(UsuarioDto req)
        {
            var usuario = await _appDbContext.Usuarios.FindAsync(req.Id);
            var passwordHash = usuario.PasswordHash;
            var passwordSalt = usuario.PasswordSalt;

            _mapper.Map(req, usuario);
            if (req.Senha.IsNullOrEmpty())
            {
                usuario.PasswordSalt = passwordSalt;
                usuario.PasswordHash = passwordHash;
            }
            else
            {
                var hmac = new HMACSHA512();
                usuario.PasswordSalt = hmac.Key;
                usuario.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(req.Senha));
            }

            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        private static bool ValidarSenha(string senhaInput, byte[] hashArmazenado, byte[] saltArmazenado)
        {
            using var hmac = new HMACSHA512(saltArmazenado);
            var hashSenha = hmac.ComputeHash(Encoding.UTF8.GetBytes(senhaInput));

            // Comparar byte a byte
            for (int i = 0; i < hashSenha.Length; i++)
            {
                if (hashSenha[i] != hashArmazenado[i])
                    return false;
            }
            return true;
        }

        public async Task<Response> AlterarSenha(UsuarioSenhaDto req)
        {
            var ret = new Response();
            var usuario = await _appDbContext.Usuarios.FindAsync(req.Id);
            var hmac = new HMACSHA512(usuario.PasswordSalt);
            if (ValidarSenha(req.SenhaAntiga, usuario.PasswordHash, usuario.PasswordSalt))
            {
                usuario.PasswordSalt = hmac.Key;
                usuario.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(req.NovaSenha));

                _ = await _appDbContext.SaveChangesAsync();
            }
            else
            {
                return ret.SetBadRequest().AddError("Negócio", "O campo Senha Antiga não confere com a senha atual do usuário.");
            }

            return ret.SetOk().SetMessage("Senha alterada com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Usuarios.Include(e => e.MenusUsuario).FirstOrDefaultAsync(e => e.Id.Equals(Id));

            _appDbContext.Usuarios.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(UsuarioDto req)
        {
            var ret = new Response();
            var res = await _appDbContext.Usuarios.Include(u => u.MenusUsuario).FirstOrDefaultAsync(e => e.Email.Equals("coenel"));
            if (res != null)
            {
                var hmac = new HMACSHA512();
                var user = _mapper.Map<UsuarioModel>(req);
                user.GestorId = res.GestorId;
                user.Ativo = true;
                user.PasswordSalt = hmac.Key;
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(req.Senha));
                _ = await _appDbContext.AddAsync(user);


                var menusUsuario = new List<MenuUsuarioModel>();
                var menus = await _appDbContext.MenusSistema.Where(m => m.Ativo).ToListAsync();
                menus.ForEach(m =>
                {
                    menusUsuario.Add(new MenuUsuarioModel
                    {
                        MenuSistemaId = m.Id,
                        TipoPerfil = req.TipoPerfil,
                        UsuarioId = user.Id
                    });
                });

                await _appDbContext.MenusUsuarios.AddRangeAsync(menusUsuario);
                _ = await _appDbContext.SaveChangesAsync();

                return new Response().SetOk().SetData(_mapper.Map<UsuarioDto>(user)).SetMessage("Dados cadastrados com sucesso.");
            }

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe usuário base");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Usuarios.FirstOrDefaultAsync(e => e.Id.Equals(Id));
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<UsuarioDto>(res));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe usuário com o id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.Usuarios.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<UsuarioDto>>(res));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe usuário ativo.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
