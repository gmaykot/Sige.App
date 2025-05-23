﻿using Microsoft.EntityFrameworkCore;
using SIGE.Core.Converter;
using SIGE.Core.Models.Sistema;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Models.Sistema.Externo;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;

namespace SIGE.DataAccess.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<MenuUsuarioModel>().Property(p => p.TipoPerfil).HasConversion(new ETipoPerfilConverter());
            modelBuilder.Entity<EmpresaModel>().Property(c => c.Estado).HasConversion(new ETipoEstadoConverter());
            modelBuilder.Entity<ConcessionariaModel>().Property(c => c.Estado).HasConversion(new ETipoEstadoConverter());

            var assembly = typeof(AppDbContext).Assembly;
            modelBuilder.ApplyConfigurationsFromAssembly(assembly);
        }
        
        // Método para obter um DbSet genérico
        public DbSet<T> Set<T>() where T : class
        {
            return base.Set<T>();
        }

        // Propriedades padrão para DbSets específicos
        public DbSet<AgenteMedicaoModel> AgentesMedicao { get; set; }
        public DbSet<BandeiraTarifariaModel> BandeirasTarifarias { get; set; }
        public DbSet<BandeiraTarifariaVigenteModel> BandeiraTarifariaVigente { get; set; }
        public DbSet<ContatoModel> Contatos { get; set; }
        public DbSet<ConcessionariaModel> Concessionarias { get; set; }
        public DbSet<ContratoEmpresaModel> ContratoEmpresas { get; set; }
        public DbSet<ContratoModel> Contratos { get; set; }
        public DbSet<ConsumoMensalModel> ConsumosMensais { get; set; }
        public DbSet<CredencialCceeModel> CredenciaisCcee { get; set; }
        public DbSet<EmpresaModel> Empresas { get; set; }
        public DbSet<FaturamentoCoenelModel> FaturamentosCoenel { get; set; }
        public DbSet<FornecedorModel> Fornecedores { get; set; }
        public DbSet<GestorModel> Gestores { get; set; }
        public DbSet<ImpostoConcessionariaModel> ImpostosConcessionarias { get; set; }
        public DbSet<LogModel> Logs { get; set; }
        public DbSet<MenuSistemaModel> MenusSistema { get; set; }
        public DbSet<MenuUsuarioModel> MenusUsuarios { get; set; }
        public DbSet<MedicoesModel> Medicoes { get; set; }
        public DbSet<PontoMedicaoModel> PontosMedicao { get; set; }
        public DbSet<RelatorioMedicaoModel> RelatoriosMedicao { get; set; }
        public DbSet<SalarioMinimoModel> SalariosMinimos { get; set; }
        public DbSet<TarifaAplicacaoModel> TarifasAplicacao { get; set; }
        public DbSet<UsuarioModel> Usuarios { get; set; }
        public DbSet<ValorAnualContratoModel> ValoresAnuaisContrato { get; set; }
        public DbSet<ValorConcessionariaModel> ValoresConcessionaria { get; set; }
        public DbSet<ValorMensalContratoModel> ValoresMensaisContrato { get; set; }
        public DbSet<TokenModel> Tokens { get; set; }
    }
}
