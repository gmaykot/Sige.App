import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  CustomUserOptions,
  margins,
  PdfConfigService,
} from "../../../@core/services/util/pdf-config.service";
import { IRelatorioFinal } from "../../../@core/data/geral/relatorio-economia/relatorio-final";

@Injectable({ providedIn: "root" })
export class RelatorioEconomiaPdfService {
  constructor(private pdfConfig: PdfConfigService) {}

  public downloadPDF(response: IRelatorioFinal) {
    const pdf = this.createPDF(response);
    pdf.save(
      `relatorio_economia_${response.cabecalho.unidade
        .replace(" ", "_")
        .toLocaleLowerCase()}.pdf`
    );
  }

  private createPDF(response?: IRelatorioFinal): jsPDF {
    // TAMANHO A4 EM PT: 595.35 x 841.995
    const doc = new jsPDF("p", "pt", "a4");

    const cabecalho = response.cabecalho;
    const relatorio = response;

    const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const formatadorNumero = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    /* CABEÇALHO COM IMAGEM E TITULO ---------------------------------------------------------------- */
    this.pdfConfig.addImagem(doc, {
      src: "assets/images/logo.png",
      marginLeft: margins.marginLeft,
    });

    const criarTituloSecao = (texto: string, marginTop: number) => {
      return this.pdfConfig.adicionarTextoMultilinha(doc, [texto], {
        fontStyle: "bold",
        textColor: "#6C6C6C",
        inicioMarginTop: marginTop,
        inicioMarginLeft: margins.marginLeft,
      });
    };

    const cabecalhoMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      [cabecalho.titulo, cabecalho.subTitulo],
      {
        fontStyle: "bold",
        align: "right",
        textColor: "#666666",
        inicioMarginTop: margins.sectionMarginTop,
        inicioMarginLeft: margins.right,
      }
    );

    /* SEÇÃO DADOS EMPRESA ---------------------------------------------------------------------------- */
    const secaoEmpresaMarginTop = criarTituloSecao(
      "DADOS EMPRESA",
      cabecalhoMarginTop + margins.sectionMarginTop
    );

    /* EMPRESA TABELA 1 */
    const dadosEmpresaTabela1: CustomUserOptions = {
      colunas: [["Unidade", "Submercado", "Conexão", "Concessão"]],
      linhas: [
        [
          { content: cabecalho.unidade },
          { content: cabecalho.subMercado },
          { content: cabecalho.conexao },
          { content: cabecalho.concessao },
        ],
      ],
      inicioMarginTop: secaoEmpresaMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela1);
    let margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* EMPRESA TABELA 2 */
    const dadosEmpresaTabela2: CustomUserOptions = {
      colunas: [["CNPJ", "Inscrição Estadual", "Endereço", "Município", "UF"]],
      linhas: [
        [
          { content: relatorio.cabecalho.cnpj },
          { content: relatorio.cabecalho.inscricaoEstadual },
          { content: relatorio.cabecalho.endereco },
          { content: relatorio.cabecalho.municipio },
          { content: relatorio.cabecalho.uf },
        ],
      ],
      inicioMarginTop: margintTopTabelaDinamico + margins.headerMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela2);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO MERCADO CATIVO E LIVE ----------------------------------------------------------------------------- */
    const criarLinhaLancamento = (lancamento: any) => {
      const valorFormatado = formatadorMoeda.format(lancamento.total ?? 0);

      if (!lancamento.observacao) {
        if (lancamento.totalizador) {
          return [
            {
              content: lancamento.descricao,
              styles: {
                halign: "left",
                fontStyle: "bold",
                fillColor: "#F2F2F2",
              },
              colSpan: 3,
            },
            {
              content: valorFormatado,
              styles: { fontStyle: "bold", fillColor: "#F2F2F2" },
            },
          ];
        } else if (lancamento.subTotalizador) {
          return [
            {
              content: lancamento.descricao,
              styles: {
                halign: "left",
                fontStyle: lancamento.descricao.startsWith("Subvenção")
                  ? "italic"
                  : "normal",
              },
              colSpan: 3,
            },
            { content: valorFormatado },
          ];
        } else {
          return [
            { content: lancamento.descricao, styles: { halign: "left" } },
            formatadorNumero.format(lancamento.montante ?? 0),
            formatadorNumero.format(lancamento.tarifa ?? 0),
            valorFormatado,
          ];
        }
      } else {
        return [
          { content: lancamento.descricao, styles: { halign: "left" } },
          "",
          { content: lancamento.observacao, colSpan: 2 },
        ];
      }
    };

    if (relatorio.grupos && relatorio.grupos.length > 0) {
      for (const grupo of relatorio.grupos) {
        const secaoGrupoMarginTop = criarTituloSecao(
          grupo.titulo,
          margintTopTabelaDinamico + margins.sectionMarginTop
        );

        const linhas: any[] = [];

        if (grupo.subGrupos && grupo.subGrupos.length > 0) {
          grupo.subGrupos.forEach((subGrupo) => {
            if (subGrupo.lancamentos && subGrupo.lancamentos.length > 0) {
              subGrupo.lancamentos.forEach((lancamento) => {
                linhas.push(criarLinhaLancamento(lancamento));
              });
            }

            if (subGrupo.total) {
              const totalFormatado = formatadorMoeda.format(
                subGrupo.total.total ?? 0
              );
              linhas.push([
                {
                  content: subGrupo.total.descricao,
                  styles: { halign: "left", fontStyle: "bold" },
                },
                formatadorNumero.format(subGrupo.total.montante ?? 0),
                formatadorNumero.format(subGrupo.total.tarifa ?? 0),
                totalFormatado,
              ]);
            }
          });
        }

        const dadosTabela: CustomUserOptions = {
          colunas: [
            [
              { content: "", styles: { cellWidth: 180 } },
              { content: grupo.colunaQuantidade, styles: { cellWidth: 90 } },
              { content: grupo.colunaValor },
              { content: grupo.colunaTotal },
            ],
          ],
          linhas: linhas,
          inicioMarginTop: secaoGrupoMarginTop,
        };

        this.pdfConfig.criarTabela(doc, dadosTabela);
        margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;
      }
    }

    /* SEÇÃO COMPARATIVO CATIVO X LIVRE --------------------------------------------------------------- */
    const secaoComparativoMarginTop = criarTituloSecao(
      "COMPARAÇÃO MERCADO CATIVO X LIVRE",
      margintTopTabelaDinamico + margins.sectionMarginTop
    );

    /* COMPARATIVO TABELA */
    const dadosComparativoTabela: CustomUserOptions = {
      linhas: [
        [
          {
            content: "Diferença cativo versus livre",
            styles: { halign: "left" as const },
          },
          { content: "Economia = 16,00 %" },
          { content: "R$ 11.696,70" },
        ],
        [
          {
            content: "Valor devido a Coenel-DE",
            styles: { halign: "left" as const },
          },
          { content: "2 Sal. Mín. + 10% economia" },
          { content: "Venc.: 16/01/2024 10% " },
          { content: "R$ 11.696,70" },
        ],
        [
          {
            content: "Economia mensal líquida",
            styles: {
              halign: "left" as const,
              fontStyle: "bold" as const,
              fillColor: "#F2F2F2",
            },
          },
          {
            content: "10,79 %",
            styles: { fontStyle: "bold" as const, fillColor: "#F2F2F2" },
          },
          {
            content: "R$ 7.887,03",
            styles: { fontStyle: "bold" as const, fillColor: "#F2F2F2" },
          },
        ],
        [
          {
            content: "Economia acumulada",
            styles: {
              halign: "left" as const,
              fontStyle: "bold" as const,
              fillColor: "#F2F2F2",
            },
            colSpan: 2,
          },
          {
            content: "R$ 1.262.582,18",
            styles: { fontStyle: "bold" as const, fillColor: "#F2F2F2" },
          },
        ],
      ],
      inicioMarginTop: secaoComparativoMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosComparativoTabela);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO OBSERVAÇÃO ------------------------------------------------------------------------------- */
    this.pdfConfig.criarTabela(doc, {
      colunas: [
        [
          {
            content:
              "Observação: todos os valores deste demonstrativo contemplam PIS/COFINS e ICMS",
            styles: { fontStyle: "bold", halign: "center" },
            colSpan: 2,
          },
        ],
      ],
      linhas: [
        [
          {
            content: "Valor devido a esta Coenel-DE",
            styles: { halign: "left" },
          },
          { content: "R$ 2.640,00" },
        ],
      ],
      inicioMarginTop: margintTopTabelaDinamico + margins.sectionMarginTop,
    });

    return doc;
  }

  public linhaValida(linha: any[]): boolean {
    const item = linha[1];
    const valor = typeof item === "string" ? item : item?.content;
    return valor !== "-" && valor !== "" && valor !== null;
  }

  public mock(): IRelatorioFinal {
    const relatorioFinal: IRelatorioFinal = {
      cabecalho: {
        titulo: "",
        subTitulo: "",
        unidade: "",
        subMercado: "",
        conexao: "",
        concessao: "",
        cnpj: "",
        inscricaoEstadual: "",
        endereco: "",
        municipio: "",
        uf: "",
        dataAnalise: new Date().toISOString(),
        mesReferencia: "",
        numerorDiasMes: 0,
        periodoHoroSazonal: "",
        tarifaFornecimento: ""
      },
      grupos: [],
      comparativo: {
        // preencher os campos conforme a interface correspondente
      },
      grafico: {
        // preencher os campos conforme a interface correspondente
      },
    };

    return relatorioFinal;
  }
}
