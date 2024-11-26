﻿using Microsoft.EntityFrameworkCore;
using SIGE.Core.Converter;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Sistema;
using SIGE.Core.Models.Sistema.Ccee;
using SIGE.Core.Models.Sistema.Concessionaria;
using SIGE.Core.Models.Sistema.Contrato;
using SIGE.Core.Models.Sistema.Empresa;
using SIGE.Core.Models.Sistema.Fornecedor;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.Medicao;
using SIGE.Core.Models.Sistema.Menus;
using SIGE.Core.Models.Sistema.RelatorioEconomia;
using SIGE.Core.Models.Sistema.TarifaAplicacao;
using SIGE.Core.Models.Sistema.Usuario;

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

        public DbSet<ConsumoMensalModel> ConsumosMensais { get; set; }
        public DbSet<MedicoesModel> Medicoes { get; set; }
        public DbSet<ContratoModel> Contratos { get; set; }
        public DbSet<ValorAnualContratoModel> ValoresAnuaisContrato { get; set; }
        public DbSet<ValorMensalContratoModel> ValoresMensaisContrato { get; set; }
        public DbSet<GestorModel> Gestores { get; set; }
        public DbSet<EmpresaModel> Empresas { get; set; }
        public DbSet<AgenteMedicaoModel> AgentesMedicao { get; set; }
        public DbSet<PontoMedicaoModel> PontosMedicao { get; set; }
        public DbSet<MenuSistemaModel> MenusSistema { get; set; }
        public DbSet<MenuUsuarioModel> MenusUsuarios { get; set; }
        public DbSet<UsuarioModel> Usuarios { get; set; }
        public DbSet<ValorConcessionariaModel> ValoresConcessionaria { get; set; }
        public DbSet<ConcessionariaModel> Concessionarias { get; set; }
        public DbSet<FornecedorModel> Fornecedores { get; set; }
        public DbSet<ContatoModel> Contatos { get; set; }
        public DbSet<CredencialCceeModel> CredenciaisCcee { get; set; }
        public DbSet<RelatorioEconomiaModel> RelatoriosEconomia { get; set; }
        public DbSet<LogModel> Logs { get; set; }
        public DbSet<ContratoEmpresaModel> ContratoEmpresas { get; set; }
        public DbSet<ValorPadraoModel> ValoresPadroes { get; set; }
        public DbSet<TarifaAplicacaoModel> TarifasAplicacao { get; set; }
    }
}
