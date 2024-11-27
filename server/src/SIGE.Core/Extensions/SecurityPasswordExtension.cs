using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Sistema.Administrativo;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SIGE.Core.Extensions
{
    public static class SecurityPasswordExtension
    {
        public static void CreatePasswordHash(this UsuarioModel usuario, string password)
        {
            using var hmac = new HMACSHA512();
            usuario.PasswordSalt = hmac.Key;
            usuario.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
        
        public static bool VerifyPasswordHash(this string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512(passwordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(passwordHash);
        }

        public static string GetJWTEncoded(this List<Claim> claims, string? securityToken)
        {
            if (securityToken == null)
                return string.Empty;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityToken));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(
                                   claims: claims,
                                   expires: DateTime.UtcNow.AddMinutes(120),
                                   signingCredentials: cred
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public static string GetMenuJWT(this IEnumerable<MenuSistemaDto> menusUsuario, string? securityToken)
        {
            List<Claim> claims = new()
            {
                new Claim("menus", JsonConvert.SerializeObject(menusUsuario).Replace("Title", "title"))
            };

            return claims.GetJWTEncoded(securityToken);
        }

        public static string GetTokenJWT(this UsuarioModel usuario, string? securityToken)
        {
            List<Claim> claims = new()
            {
                new Claim("id", usuario.Id.ToString()),
                new Claim("name", usuario.Apelido),
                new Claim("gestor_id", usuario.GestorId.ToString())
            };

            return claims.GetJWTEncoded(securityToken);
        }
    }
}
