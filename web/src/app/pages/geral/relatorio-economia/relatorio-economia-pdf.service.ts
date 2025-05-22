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

    /* MÉTODOS HELPERS ---------------------------------------------------------------- */
    const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const formatadorNumero = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatarValorComUnidade = (
      valor: number | undefined,
      unidade: string
    ): string => {
      return valor === undefined || valor === null || valor === 0
        ? "-"
        : `${formatadorNumero.format(valor)} ${unidade}`;
    };

    const criarTituloSecao = (texto: string, marginTop: number) => {
      return this.pdfConfig.adicionarTextoMultilinha(doc, [texto], {
        fontStyle: "bold",
        textColor: "#000",
        inicioMarginTop: marginTop,
        inicioMarginLeft: margins.marginLeft,
      });
    };

    /* LOGO ---------------------------------------------------------------- */
    const logoImage = new Image();
    logoImage.src = "assets/images/logo.png";

    let logoWidth = 140; // Largura padrão
    let logoHeight = 57; // Altura padrão

    const logoMarginTop = margins.marginTop;

    this.pdfConfig.addImagem(doc, {
      src: "assets/images/logo.png",
      marginLeft: margins.marginLeft,
      marginTop: logoMarginTop,
      width: logoWidth,
      height: logoHeight,
    });

    const imageBottomY = logoMarginTop + logoHeight + 10;

    const estilosTabela = {
      headStyles: {
        fontSize: 7,
        lineWidth: 0.5,
        lineColor: "#DDDDDD",
        fillColor: "#f5f9fc",
        textColor: "#4285F4",
        fontStyle: "bold" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 7,
        lineWidth: 0.5,
        lineColor: "#DDDDDD",
        textColor: "#333333",
        fontStyle: "normal" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: "#f5f9fc",
      },
      footStyles: {
        fillColor: "#E9E9E9",
        textColor: "#000000",
        fontStyle: "bold" as const,
      },
    };

    /* SEÇÃO DADOS EMPRESA ---------------------------------------------------------------------------- */
    const secaoEmpresaMarginTop = criarTituloSecao(
      "DADOS EMPRESA",
      Math.max(imageBottomY, margins.sectionMarginTop)
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
      ...estilosTabela,
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
      ...estilosTabela,
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
                fillColor: "#f5f9fc",
              },
              colSpan: 3,
            },
            {
              content: valorFormatado,
              styles: { fontStyle: "bold", fillColor: "#f5f9fc" },
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
            formatarValorComUnidade(lancamento.montante, "kW"),
            formatarValorComUnidade(lancamento.tarifa, "kWh"),
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
                  colSpan: 3,
                  styles: { halign: "left", fontStyle: "bold" },
                },
                {
                  content: totalFormatado,
                  styles: { halign: "center", fontStyle: "bold" },
                },
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
          ...estilosTabela,
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
      colunas: [
        [{ content: "Comparativo", styles: { halign: "center" }, colSpan: 3 }],
      ],
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
              fillColor: "#f5f9fc",
            },
          },
          {
            content: "10,79 %",
            styles: { fontStyle: "bold" as const, fillColor: "#f5f9fc" },
          },
          {
            content: "R$ 7.887,03",
            styles: { fontStyle: "bold" as const, fillColor: "#f5f9fc" },
          },
        ],
        [
          {
            content: "Economia acumulada",
            styles: {
              halign: "left" as const,
              fontStyle: "bold" as const,
              fillColor: "#f5f9fc",
            },
            colSpan: 2,
          },
          {
            content: "R$ 1.262.582,18",
            styles: { fontStyle: "bold" as const, fillColor: "#f5f9fc" },
          },
        ],
      ],
      inicioMarginTop: secaoComparativoMarginTop,
      ...estilosTabela,
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
      ...estilosTabela,
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
        tarifaFornecimento: "",
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
