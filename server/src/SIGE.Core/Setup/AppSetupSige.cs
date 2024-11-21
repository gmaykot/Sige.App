using SIGE.Core.Enumerators;
using SIGE.Core.Models.Sistema;
using SIGE.Core.Models.Sistema.Ccee;
using SIGE.Core.Models.Sistema.Concessionaria;
using SIGE.Core.Models.Sistema.Contrato;
using SIGE.Core.Models.Sistema.Empresa;
using SIGE.Core.Models.Sistema.Fornecedor;
using SIGE.Core.Models.Sistema.Medicao;
using SIGE.Core.Models.Sistema.Menus;
using SIGE.Core.Models.Sistema.Usuario;
using System.Security.Cryptography;
using System.Text;

namespace SIGE.Core.Setup
{
    public static class AppSetupSige
    {
        public static GestorModel Gestor(Guid id) =>
            new()
            {
                Id = id,
                Nome = "Coenel DE - Acessoria em Energia Elétrica",
                NomeFantasia = "Coenel",
                CNPJ = "33.050.074/0001.58",
                EmailContato = "coenel-de@coenel-de.com.br",
                Telefone = "(54) 3452-7735"
            };

        public static EmpresaModel Empresa(Guid gestorId, string cnpj, string nome, string nomeFantasia, ETipoEstado estado) =>
           new()
           {
               Nome = nome,
               NomeFantasia = nomeFantasia,
               CNPJ = cnpj,
               GestorId = gestorId,
               Estado = estado,
               Conexao = "A4 (13.8 - 23 KV) - Industrial",
               DadosCtaUc = "00000",
               FonteEnergia = "THS Verde Cat. (CATIVO)",
               SubMercado = "SUL",
               UnirPontosMedicao = false
           };

        public static AgenteMedicaoModel AgenteMedicao(Guid empresaId, string nome, string codigoPerfilAgente) =>
           new()
           {
               Nome = nome,
               EmpresaId = empresaId,
               CodigoPerfilAgente = codigoPerfilAgente
           };

        public static PontoMedicaoModel PontoMedicao(Guid agendeMedicaoId, string nome, string codigo) =>
           new()
           {
               Nome = nome,
               Codigo = codigo,
               AgenteMedicaoId = agendeMedicaoId
           };

        public static MenuSistemaModel MenusSistema(string titulo, string link, bool expandido, bool home = false, string icone = "") =>
            new()
            {                
                Titulo = titulo,
                Link = link,
                Icone = icone,
                Expandido = expandido,
                Home = home
            };

        public static MenuUsuarioModel MenuUsuario(Guid usuarioId, Guid menuSistemaId, ETipoPerfil tipoPerfil = ETipoPerfil.CONSULTIVO) =>
            new()
            {
                UsuarioId = usuarioId,
                MenuSistemaId = menuSistemaId,
                TipoPerfil = tipoPerfil
            };

        public static UsuarioModel Usuario(Guid gestorId, string apelido, string email, string nome, string password)
        {
            var hmac = new HMACSHA512();
            var usuario = new UsuarioModel
            {
                Apelido = apelido,
                Email = email,
                Nome = nome,
                GestorId = gestorId,
                PasswordSalt = hmac.Key,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password))
        };

            return usuario;
        }

        public static ConcessionariaModel Concessionaria(Guid gestorId, string nome, ETipoEstado tipoEstado) =>
            new()
            {
                GestorId = gestorId,
                Nome = nome,
                Estado = tipoEstado
            };

        public static CredencialCceeModel CredencialCCEE(Guid gestorId) =>
            new()
            {
                GestorId = gestorId,
                Nome = "Câmara de Comercialização de Energia Elétrica",
                AuthUsername = "c_e_c_coenel",
                AuthPassword = "@coene25"
            };

        public static FornecedorModel Fornecedor(Guid gestorId) =>
            new()
            {
                GestorId = gestorId,
                Nome = "BOVEN",
                CNPJ = "14.609.649/0001-19",
                TelefoneContato = "(11) 2663-2910"
            };

        public static ContratoModel Contrato(Guid fornecedorId, Guid concessionariaId) =>
            new()
            { 
                Numero = "C001-2024",
                DscGrupo = "GRUPO 1",
                DataBase= DateTime.Now,
                DataVigenciaInicial= DateTime.Now,
                DataVigenciaFinal = DateTime.Now.AddYears(1),
                TakeMinimo = 10,
                TakeMaximo = 50,
                Status = EStatusContrato.ATIVO,
                FornecedorId = fornecedorId,
                ConcessionariaId = concessionariaId,
                TipoEnergia = ETipoEnergia.CONVENCIONAL_LP
            };

        public static ConsumoMensalModel ConsumoMensal(Guid pontoMedicaoId) =>
            new()
            {
                DataMedicao= DateTime.Now,
                MesReferencia = DateTime.Now,
                StatusMedicao = EStatusMedicao.COMPLETA,
                PontoMedicaoId = pontoMedicaoId
            };            

        public static ValorConcessionariaModel ValorConcessionaria(Guid concessionariaId) =>
            new()
            {
                ConcessionariaId = concessionariaId,               
                NumeroResolucao = "3.206 de 13/06/23",
                SubGrupo = ESubGrupo.A4_138_23KV,
                DataUltimoReajuste = DateTime.Now,
                KWhPSVerde = 2.03763,
                KWhFPSVerde = 0.37046,
                DemVerde = 25.68,
                KWhPSAzul = 0.52786,
                KWhFPSAzul = 0.37046,
                DemPAzul = 62.16,
                DemFPAzul = 25.68,
                KWhBT = 0.69916,
                TusdFPKWhAzul0 = 0.09421,
                CusdFPAzul50 = 0.9421,
                TusdPKWhCalcVerde0 = 1.60398,
                CusdPCalcVerde50 = 1.60398
            };
       
    }
}
