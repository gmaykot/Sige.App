using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SIGE.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class a : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BandeirasTarifarias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ValorBandeiraVerde = table.Column<double>(type: "double", nullable: false),
                    ValorBandeiraAmarela = table.Column<double>(type: "double", nullable: false),
                    ValorBandeiraVermelha1 = table.Column<double>(type: "double", nullable: false),
                    ValorBandeiraVermelha2 = table.Column<double>(type: "double", nullable: false),
                    VigenciaInicial = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    VigenciaFinal = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BandeirasTarifarias", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Gestores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NomeFantasia = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CNPJ = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefone = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmailContato = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gestores", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    LogLevel = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Source = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestPath = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestMethod = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestUser = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    QueryString = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MenusSistema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Titulo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Link = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Icone = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Home = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    Expandido = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    Ordem = table.Column<int>(type: "int", nullable: false),
                    MenuPredecessorId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenusSistema", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenusSistema_MenusSistema_MenuPredecessorId",
                        column: x => x.MenuPredecessorId,
                        principalTable: "MenusSistema",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SalariosMinimos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    VigenciaInicial = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    VigenciaFinal = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Valor = table.Column<double>(type: "double", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalariosMinimos", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UsuarioId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    GestorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DataExpiracao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tokens", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BandeiraTarifariaVigente",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Bandeira = table.Column<int>(type: "int", nullable: false),
                    BandeiraTarifariaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BandeiraTarifariaVigente", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BandeiraTarifariaVigente_BandeirasTarifarias_BandeiraTarifar~",
                        column: x => x.BandeiraTarifariaId,
                        principalTable: "BandeirasTarifarias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Concessionarias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Estado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GestorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Concessionarias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Concessionarias_Gestores_GestorId",
                        column: x => x.GestorId,
                        principalTable: "Gestores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CredenciaisCcee",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AuthUsername = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AuthPassword = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GestorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CredenciaisCcee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CredenciaisCcee_Gestores_GestorId",
                        column: x => x.GestorId,
                        principalTable: "Gestores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Empresas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CNPJ = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    InscricaoEstadual = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NomeFantasia = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DadosCtaUc = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FonteEnergia = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Cep = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Logradouro = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Bairro = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Cidade = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResponsavelGestor = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubMercado = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Conexao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UnirPontosMedicao = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Estado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GestorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    EmpresaMatrizId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Empresas_Empresas_EmpresaMatrizId",
                        column: x => x.EmpresaMatrizId,
                        principalTable: "Empresas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Empresas_Gestores_GestorId",
                        column: x => x.GestorId,
                        principalTable: "Gestores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Fornecedores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CNPJ = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TelefoneContato = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TelefoneAlternativo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GestorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fornecedores_Gestores_GestorId",
                        column: x => x.GestorId,
                        principalTable: "Gestores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Apelido = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<byte[]>(type: "longblob", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "longblob", nullable: false),
                    GestorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    SysAdm = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_Gestores_GestorId",
                        column: x => x.GestorId,
                        principalTable: "Gestores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ImpostosConcessionarias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ConcessionariaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ValorPis = table.Column<double>(type: "double", nullable: false),
                    ValorCofins = table.Column<double>(type: "double", nullable: false),
                    MesReferencia = table.Column<DateOnly>(type: "date", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImpostosConcessionarias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImpostosConcessionarias_Concessionarias_ConcessionariaId",
                        column: x => x.ConcessionariaId,
                        principalTable: "Concessionarias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TarifasAplicacao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ConcessionariaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    NumeroResolucao = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubGrupo = table.Column<int>(type: "int", nullable: false),
                    Segmento = table.Column<int>(type: "int", nullable: false),
                    DataUltimoReajuste = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    KWPonta = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    KWForaPonta = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    KWhPontaTUSD = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    KWhForaPontaTUSD = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    KWhPontaTE = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    KWhForaPontaTE = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ReatKWhPFTE = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TarifasAplicacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TarifasAplicacao_Concessionarias_ConcessionariaId",
                        column: x => x.ConcessionariaId,
                        principalTable: "Concessionarias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ValoresConcessionaria",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ConcessionariaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    NumeroResolucao = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubGrupo = table.Column<int>(type: "int", nullable: false),
                    DataUltimoReajuste = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    KWhPSVerde = table.Column<double>(type: "double", nullable: false),
                    KWhFPSVerde = table.Column<double>(type: "double", nullable: false),
                    DemVerde = table.Column<double>(type: "double", nullable: false),
                    KWhPSAzul = table.Column<double>(type: "double", nullable: false),
                    KWhFPSAzul = table.Column<double>(type: "double", nullable: false),
                    DemPAzul = table.Column<double>(type: "double", nullable: false),
                    DemFPAzul = table.Column<double>(type: "double", nullable: false),
                    KWhBT = table.Column<double>(type: "double", nullable: false),
                    TusdFPKWhAzul0 = table.Column<double>(type: "double", nullable: false),
                    CusdFPAzul50 = table.Column<double>(type: "double", nullable: false),
                    TusdFPAzul100 = table.Column<double>(type: "double", nullable: false),
                    TusdPAzul100 = table.Column<double>(type: "double", nullable: false),
                    TusdPKWhCalcVerde0 = table.Column<double>(type: "double", nullable: false),
                    TusdPVerde0 = table.Column<double>(type: "double", nullable: false),
                    CusdPCalcVerde50 = table.Column<double>(type: "double", nullable: false),
                    TusdVerde100 = table.Column<double>(type: "double", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValoresConcessionaria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValoresConcessionaria_Concessionarias_ConcessionariaId",
                        column: x => x.ConcessionariaId,
                        principalTable: "Concessionarias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AgentesMedicao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CodigoPerfilAgente = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CodigoAgente = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmpresaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgentesMedicao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AgentesMedicao_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Contatos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefone = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Cargo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RecebeEmail = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FornecedorId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    EmpresaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contatos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contatos_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Contatos_Fornecedores_FornecedorId",
                        column: x => x.FornecedorId,
                        principalTable: "Fornecedores",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Contratos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Numero = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DscGrupo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataBase = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataVigenciaInicial = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataVigenciaFinal = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TakeMinimo = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    TakeMaximo = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TipoEnergia = table.Column<int>(type: "int", nullable: false),
                    Segmento = table.Column<int>(type: "int", nullable: false),
                    FornecedorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contratos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contratos_Fornecedores_FornecedorId",
                        column: x => x.FornecedorId,
                        principalTable: "Fornecedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DescontosTusd",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateOnly>(type: "date", nullable: true),
                    ValorDescontoTUSD = table.Column<double>(type: "double", nullable: true),
                    TipoEnergia = table.Column<int>(type: "int", nullable: false),
                    FornecedorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DescontosTusd", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DescontosTusd_Fornecedores_FornecedorId",
                        column: x => x.FornecedorId,
                        principalTable: "Fornecedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MenusUsuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TipoPerfil = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UsuarioId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MenuSistemaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenusUsuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenusUsuarios_MenusSistema_MenuSistemaId",
                        column: x => x.MenuSistemaId,
                        principalTable: "MenusSistema",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MenusUsuarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PontosMedicao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Codigo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AcumulacaoLiquida = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IncideICMS = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Segmento = table.Column<int>(type: "int", nullable: false),
                    Conexao = table.Column<int>(type: "int", nullable: false),
                    TipoEnergia = table.Column<int>(type: "int", nullable: false),
                    ConcessionariaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    AgenteMedicaoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PontosMedicao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PontosMedicao_AgentesMedicao_AgenteMedicaoId",
                        column: x => x.AgenteMedicaoId,
                        principalTable: "AgentesMedicao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PontosMedicao_Concessionarias_ConcessionariaId",
                        column: x => x.ConcessionariaId,
                        principalTable: "Concessionarias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ContratoEmpresas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ContratoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    EmpresaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContratoEmpresas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContratoEmpresas_Contratos_ContratoId",
                        column: x => x.ContratoId,
                        principalTable: "Contratos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContratoEmpresas_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RelatoriosMedicao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataEmissao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Fase = table.Column<int>(type: "int", nullable: false),
                    TotalMedido = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ValorCompraCurtoPrazo = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    ValorVendaCurtoPrazo = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    Observacao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Validado = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    ObservacaoValidacao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ContratoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UsuarioResponsavelId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RelatoriosMedicao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RelatoriosMedicao_Contratos_ContratoId",
                        column: x => x.ContratoId,
                        principalTable: "Contratos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RelatoriosMedicao_Usuarios_UsuarioResponsavelId",
                        column: x => x.UsuarioResponsavelId,
                        principalTable: "Usuarios",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ValoresAnuaisContrato",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DataVigenciaInicial = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataVigenciaFinal = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ValorUnitarioKwh = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ContratoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValoresAnuaisContrato", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValoresAnuaisContrato_Contratos_ContratoId",
                        column: x => x.ContratoId,
                        principalTable: "Contratos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ConsumosMensais",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MesReferencia = table.Column<DateOnly>(type: "date", nullable: false),
                    DataMedicao = table.Column<DateOnly>(type: "date", nullable: false),
                    Icms = table.Column<float>(type: "float", nullable: false),
                    Proinfa = table.Column<float>(type: "float", nullable: false),
                    StatusMedicao = table.Column<int>(type: "int", nullable: false),
                    PontoMedicaoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateOnly>(type: "date", nullable: true),
                    DataRegistro = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsumosMensais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsumosMensais_PontosMedicao_PontoMedicaoId",
                        column: x => x.PontoMedicaoId,
                        principalTable: "PontosMedicao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EnergiasAcumuladas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ValorMensalAcumulado = table.Column<double>(type: "double", nullable: false),
                    ValorTotalAcumulado = table.Column<double>(type: "double", nullable: false),
                    PontoMedicaoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergiasAcumuladas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergiasAcumuladas_PontosMedicao_PontoMedicaoId",
                        column: x => x.PontoMedicaoId,
                        principalTable: "PontosMedicao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FaturamentosCoenel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    VigenciaInicial = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    VigenciaFinal = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ValorFixo = table.Column<double>(type: "double", nullable: false),
                    QtdeSalarios = table.Column<double>(type: "double", nullable: false),
                    Porcentagem = table.Column<double>(type: "double", nullable: false),
                    PontoMedicaoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaturamentosCoenel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FaturamentosCoenel_PontosMedicao_PontoMedicaoId",
                        column: x => x.PontoMedicaoId,
                        principalTable: "PontosMedicao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FaturasEnergia",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateOnly>(type: "date", nullable: false),
                    DataVencimento = table.Column<DateOnly>(type: "date", nullable: false),
                    Segmento = table.Column<int>(type: "int", nullable: false),
                    Validado = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ValorDemandaContratadaPonta = table.Column<double>(type: "double", nullable: true),
                    ValorDemandaContratadaForaPonta = table.Column<double>(type: "double", nullable: false),
                    ValorDemandaFaturadaPontaConsumida = table.Column<double>(type: "double", nullable: true),
                    ValorDemandaFaturadaForaPontaConsumida = table.Column<double>(type: "double", nullable: false),
                    ValorDemandaFaturadaPontaNaoConsumida = table.Column<double>(type: "double", nullable: true),
                    ValorDemandaFaturadaForaPontaNaoConsumida = table.Column<double>(type: "double", nullable: false),
                    ValorDemandaUltrapassagemPonta = table.Column<double>(type: "double", nullable: false),
                    ValorDemandaUltrapassagemForaPonta = table.Column<double>(type: "double", nullable: false),
                    ValorDemandaReativaPonta = table.Column<double>(type: "double", nullable: true),
                    ValorDemandaReativaForaPonta = table.Column<double>(type: "double", nullable: false),
                    ValorConsumoTUSDPonta = table.Column<double>(type: "double", nullable: true),
                    ValorConsumoTUSDForaPonta = table.Column<double>(type: "double", nullable: false),
                    ValorConsumoTEPonta = table.Column<double>(type: "double", nullable: true),
                    ValorConsumoTEForaPonta = table.Column<double>(type: "double", nullable: false),
                    ValorConsumoMedidoReativoPonta = table.Column<double>(type: "double", nullable: true),
                    ValorConsumoMedidoReativoForaPonta = table.Column<double>(type: "double", nullable: false),
                    TarifaMedidaReativaPonta = table.Column<double>(type: "double", nullable: true),
                    TarifaMedidaReativaForaPonta = table.Column<double>(type: "double", nullable: false),
                    ValorDescontoTUSD = table.Column<double>(type: "double", nullable: false),
                    ValorDescontoRETUSD = table.Column<double>(type: "double", nullable: false),
                    PontoMedicaoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ConcessionariaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaturasEnergia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FaturasEnergia_Concessionarias_ConcessionariaId",
                        column: x => x.ConcessionariaId,
                        principalTable: "Concessionarias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FaturasEnergia_PontosMedicao_PontoMedicaoId",
                        column: x => x.PontoMedicaoId,
                        principalTable: "PontosMedicao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RelatoriosEconomia",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Observacao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Validado = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    ObservacaoValidacao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PontoMedicaoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UsuarioResponsavelId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RelatoriosEconomia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RelatoriosEconomia_PontosMedicao_PontoMedicaoId",
                        column: x => x.PontoMedicaoId,
                        principalTable: "PontosMedicao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RelatoriosEconomia_Usuarios_UsuarioResponsavelId",
                        column: x => x.UsuarioResponsavelId,
                        principalTable: "Usuarios",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ValoresMensaisPontoMedicao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateOnly>(type: "date", nullable: true),
                    Proinfa = table.Column<double>(type: "double", nullable: false),
                    Icms = table.Column<double>(type: "double", nullable: false),
                    ValorDescontoRETUSD = table.Column<double>(type: "double", nullable: false),
                    PontoMedicaoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValoresMensaisPontoMedicao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValoresMensaisPontoMedicao_PontosMedicao_PontoMedicaoId",
                        column: x => x.PontoMedicaoId,
                        principalTable: "PontosMedicao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LogsEnvioEmails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CcoEmail = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Response = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    InnerException = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UsuarioEnvioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    RelatorioMedicaoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Aberto = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataAbertura = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogsEnvioEmails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogsEnvioEmails_RelatoriosMedicao_RelatorioMedicaoId",
                        column: x => x.RelatorioMedicaoId,
                        principalTable: "RelatoriosMedicao",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LogsEnvioEmails_Usuarios_UsuarioEnvioId",
                        column: x => x.UsuarioEnvioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ValoresMensaisContrato",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MesReferencia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    HorasMes = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    EnergiaContratada = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ValorAnualContratoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValoresMensaisContrato", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValoresMensaisContrato_ValoresAnuaisContrato_ValorAnualContr~",
                        column: x => x.ValorAnualContratoId,
                        principalTable: "ValoresAnuaisContrato",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Medicoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Periodo = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    SubTipo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ConsumoAtivo = table.Column<float>(type: "float", nullable: false),
                    ConsumoMensalId = table.Column<int>(type: "int", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateOnly>(type: "date", nullable: true),
                    DataRegistro = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Medicoes_ConsumosMensais_ConsumoMensalId",
                        column: x => x.ConsumoMensalId,
                        principalTable: "ConsumosMensais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LancamentosAdicionais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Descricao = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Valor = table.Column<double>(type: "double", nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    NaturezaMercado = table.Column<int>(type: "int", nullable: false),
                    ContabilizaFatura = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TipoCCEE = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FaturaEnergiaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DataExclusao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LancamentosAdicionais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LancamentosAdicionais_FaturasEnergia_FaturaEnergiaId",
                        column: x => x.FaturaEnergiaId,
                        principalTable: "FaturasEnergia",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AgentesMedicao_EmpresaId",
                table: "AgentesMedicao",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_BandeiraTarifariaVigente_BandeiraTarifariaId",
                table: "BandeiraTarifariaVigente",
                column: "BandeiraTarifariaId");

            migrationBuilder.CreateIndex(
                name: "IX_Concessionarias_GestorId",
                table: "Concessionarias",
                column: "GestorId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumosMensais_PontoMedicaoId",
                table: "ConsumosMensais",
                column: "PontoMedicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Contatos_EmpresaId",
                table: "Contatos",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Contatos_FornecedorId",
                table: "Contatos",
                column: "FornecedorId");

            migrationBuilder.CreateIndex(
                name: "IX_ContratoEmpresas_ContratoId",
                table: "ContratoEmpresas",
                column: "ContratoId");

            migrationBuilder.CreateIndex(
                name: "IX_ContratoEmpresas_EmpresaId",
                table: "ContratoEmpresas",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Contratos_FornecedorId",
                table: "Contratos",
                column: "FornecedorId");

            migrationBuilder.CreateIndex(
                name: "IX_CredenciaisCcee_GestorId",
                table: "CredenciaisCcee",
                column: "GestorId");

            migrationBuilder.CreateIndex(
                name: "IX_DescontosTusd_FornecedorId",
                table: "DescontosTusd",
                column: "FornecedorId");

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_EmpresaMatrizId",
                table: "Empresas",
                column: "EmpresaMatrizId");

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_GestorId",
                table: "Empresas",
                column: "GestorId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergiasAcumuladas_PontoMedicaoId",
                table: "EnergiasAcumuladas",
                column: "PontoMedicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_FaturamentosCoenel_PontoMedicaoId",
                table: "FaturamentosCoenel",
                column: "PontoMedicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_FaturasEnergia_ConcessionariaId",
                table: "FaturasEnergia",
                column: "ConcessionariaId");

            migrationBuilder.CreateIndex(
                name: "IX_FaturasEnergia_PontoMedicaoId",
                table: "FaturasEnergia",
                column: "PontoMedicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Fornecedores_GestorId",
                table: "Fornecedores",
                column: "GestorId");

            migrationBuilder.CreateIndex(
                name: "IX_ImpostosConcessionarias_ConcessionariaId",
                table: "ImpostosConcessionarias",
                column: "ConcessionariaId");

            migrationBuilder.CreateIndex(
                name: "IX_LancamentosAdicionais_FaturaEnergiaId",
                table: "LancamentosAdicionais",
                column: "FaturaEnergiaId");

            migrationBuilder.CreateIndex(
                name: "IX_LogsEnvioEmails_RelatorioMedicaoId",
                table: "LogsEnvioEmails",
                column: "RelatorioMedicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_LogsEnvioEmails_UsuarioEnvioId",
                table: "LogsEnvioEmails",
                column: "UsuarioEnvioId");

            migrationBuilder.CreateIndex(
                name: "IX_Medicoes_ConsumoMensalId",
                table: "Medicoes",
                column: "ConsumoMensalId");

            migrationBuilder.CreateIndex(
                name: "IX_MenusSistema_MenuPredecessorId",
                table: "MenusSistema",
                column: "MenuPredecessorId");

            migrationBuilder.CreateIndex(
                name: "IX_MenusUsuarios_MenuSistemaId",
                table: "MenusUsuarios",
                column: "MenuSistemaId");

            migrationBuilder.CreateIndex(
                name: "IX_MenusUsuarios_UsuarioId",
                table: "MenusUsuarios",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_PontosMedicao_AgenteMedicaoId",
                table: "PontosMedicao",
                column: "AgenteMedicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_PontosMedicao_ConcessionariaId",
                table: "PontosMedicao",
                column: "ConcessionariaId");

            migrationBuilder.CreateIndex(
                name: "IX_RelatoriosEconomia_PontoMedicaoId",
                table: "RelatoriosEconomia",
                column: "PontoMedicaoId");

            migrationBuilder.CreateIndex(
                name: "IX_RelatoriosEconomia_UsuarioResponsavelId",
                table: "RelatoriosEconomia",
                column: "UsuarioResponsavelId");

            migrationBuilder.CreateIndex(
                name: "IX_RelatoriosMedicao_ContratoId",
                table: "RelatoriosMedicao",
                column: "ContratoId");

            migrationBuilder.CreateIndex(
                name: "IX_RelatoriosMedicao_UsuarioResponsavelId",
                table: "RelatoriosMedicao",
                column: "UsuarioResponsavelId");

            migrationBuilder.CreateIndex(
                name: "IX_TarifasAplicacao_ConcessionariaId",
                table: "TarifasAplicacao",
                column: "ConcessionariaId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_GestorId",
                table: "Usuarios",
                column: "GestorId");

            migrationBuilder.CreateIndex(
                name: "IX_ValoresAnuaisContrato_ContratoId",
                table: "ValoresAnuaisContrato",
                column: "ContratoId");

            migrationBuilder.CreateIndex(
                name: "IX_ValoresConcessionaria_ConcessionariaId",
                table: "ValoresConcessionaria",
                column: "ConcessionariaId");

            migrationBuilder.CreateIndex(
                name: "IX_ValoresMensaisContrato_ValorAnualContratoId",
                table: "ValoresMensaisContrato",
                column: "ValorAnualContratoId");

            migrationBuilder.CreateIndex(
                name: "IX_ValoresMensaisPontoMedicao_PontoMedicaoId",
                table: "ValoresMensaisPontoMedicao",
                column: "PontoMedicaoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BandeiraTarifariaVigente");

            migrationBuilder.DropTable(
                name: "Contatos");

            migrationBuilder.DropTable(
                name: "ContratoEmpresas");

            migrationBuilder.DropTable(
                name: "CredenciaisCcee");

            migrationBuilder.DropTable(
                name: "DescontosTusd");

            migrationBuilder.DropTable(
                name: "EnergiasAcumuladas");

            migrationBuilder.DropTable(
                name: "FaturamentosCoenel");

            migrationBuilder.DropTable(
                name: "ImpostosConcessionarias");

            migrationBuilder.DropTable(
                name: "LancamentosAdicionais");

            migrationBuilder.DropTable(
                name: "Logs");

            migrationBuilder.DropTable(
                name: "LogsEnvioEmails");

            migrationBuilder.DropTable(
                name: "Medicoes");

            migrationBuilder.DropTable(
                name: "MenusUsuarios");

            migrationBuilder.DropTable(
                name: "RelatoriosEconomia");

            migrationBuilder.DropTable(
                name: "SalariosMinimos");

            migrationBuilder.DropTable(
                name: "TarifasAplicacao");

            migrationBuilder.DropTable(
                name: "Tokens");

            migrationBuilder.DropTable(
                name: "ValoresConcessionaria");

            migrationBuilder.DropTable(
                name: "ValoresMensaisContrato");

            migrationBuilder.DropTable(
                name: "ValoresMensaisPontoMedicao");

            migrationBuilder.DropTable(
                name: "BandeirasTarifarias");

            migrationBuilder.DropTable(
                name: "FaturasEnergia");

            migrationBuilder.DropTable(
                name: "RelatoriosMedicao");

            migrationBuilder.DropTable(
                name: "ConsumosMensais");

            migrationBuilder.DropTable(
                name: "MenusSistema");

            migrationBuilder.DropTable(
                name: "ValoresAnuaisContrato");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "PontosMedicao");

            migrationBuilder.DropTable(
                name: "Contratos");

            migrationBuilder.DropTable(
                name: "AgentesMedicao");

            migrationBuilder.DropTable(
                name: "Concessionarias");

            migrationBuilder.DropTable(
                name: "Fornecedores");

            migrationBuilder.DropTable(
                name: "Empresas");

            migrationBuilder.DropTable(
                name: "Gestores");
        }
    }
}
