import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  CustomUserOptions,
  margins,
  PdfConfigService,
} from "../../../@core/services/util/pdf-config.service";
import { IRelatorioFinal } from "../../../@core/data/geral/relatorio-economia/relatorio-final";
import { ILancamentoRelatorioFinal } from "../../../@core/data/geral/relatorio-economia/lancamento-relatorio-final";

@Injectable({ providedIn: "root" })
export class RelatorioEconomiaPdfService {
  constructor(private pdfConfig: PdfConfigService) {}

  public downloadPDF(response: IRelatorioFinal, graficoImagem: string) {
    const pdf = this.createPDF(response, graficoImagem);
    pdf.save(
      `relatorio_economia_${response.cabecalho.unidade
        .replace(" ", "_")
        .toLocaleLowerCase()}.pdf`
    );
  }

  private createPDF(response?: IRelatorioFinal, graficoImagem?: string): jsPDF {
    // TAMANHO A4 EM PT: 595.35 x 841.995
    const doc = new jsPDF("p", "pt", "a4");
    let pdfWidth = doc.internal.pageSize.getWidth();
    let graficoPdfHeight = 0;

    if (graficoImagem) {
      const imgProps = doc.getImageProperties(graficoImagem);
      graficoPdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    }

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
      maximumFractionDigits: 3,
    });

    const formatarTotal = (valor: number | undefined): string => {
      if (valor === undefined || valor === null || valor === 0) return "-";

      if (valor < 0) {
        return `(${formatadorMoeda.format(Math.abs(valor))})`;
      }

      return formatadorMoeda.format(valor);
    };

    const formatarValorComUnidade = (tipo: number, valor: number) => {
      if (valor === undefined || valor === null || valor === 0) return "-";

      const tipos = {
        0: "MWh",
        1: "kW",
        2: "kWh",
        3: "%",
      };

      return `${formatadorNumero.format(valor)} ${tipos[tipo]}`;
    };

    const criarTituloSecao = (texto: string, marginTop: number) => {
      return this.pdfConfig.adicionarTextoMultilinha(doc, [texto], {
        fontSize: 7,
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

    const desenharBordasPersonalizadas = {
      willDrawCell: function (data) {
        if (data.cell.styles) {
          data.cell.styles.lineWidth = 0;
        }
        return true;
      },

      didDrawCell: function (data) {
        const doc = data.doc;
        const cell = data.cell;
        const cursor = data.cursor;

        doc.setDrawColor("#DDDDDD");
        doc.setLineWidth(0.5);

        doc.line(
          cursor.x,
          cursor.y + cell.height,
          cursor.x + cell.width,
          cursor.y + cell.height
        );

        const isFirstRow = data.row.index === 0;
        const isFirstRowOnPage = data.cell.raw?.y === data.table.startPageY;
        if (isFirstRow || isFirstRowOnPage) {
          doc.line(cursor.x, cursor.y, cursor.x + cell.width, cursor.y);
        }

        const isFirstCol = data.column.index === 0;

        const isLastVisualCol =
          data.column.index + (cell.colSpan ?? 1) === data.table.columns.length;

        if (isFirstCol) {
          doc.line(cursor.x, cursor.y, cursor.x, cursor.y + cell.height);
        }

        if (isLastVisualCol) {
          const rightX = cursor.x + cell.width;
          doc.line(rightX, cursor.y, rightX, cursor.y + cell.height);
        }

        if (
          data.section === "head" &&
          cell.colSpan &&
          cell.colSpan === data.table.columns.length
        ) {
          const rightX = cursor.x + cell.width;
          doc.line(rightX, cursor.y, rightX, cursor.y + cell.height);
        }
      },
    };

    // Estilos básicos para tabelas (sem definições de borda)
    const estilosTabela = {
      headStyles: {
        fontSize: 6,
        fillColor: "#f5f9fc",
        textColor: "#4285F4",
        fontStyle: "bold" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 6,
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
      // Aplicar as funções de desenho personalizado
      ...desenharBordasPersonalizadas,
    };

    const resetEstilosTabela = {
      headStyles: {
        fontSize: 6,
        // fillColor: "#f5f9fc",
        textColor: "#4285F4",
        fontStyle: "bold" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 3,
        lineColor: "#FFFFFF",
      },
      bodyStyles: {
        fontSize: 6,
        textColor: "#333333",
        fontStyle: "normal" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 3,
        lineColor: "#FFFFFF",
      },
    };

    /* SEÇÃO DADOS EMPRESA ---------------------------------------------------------------------------- */
    const secaoEmpresaMarginTop = criarTituloSecao(
      "DADOS EMPRESA",
      Math.max(imageBottomY, margins.sectionMarginTop)
    );

    /* EMPRESA TABELA 1 */
    const dadosEmpresaTabela1: CustomUserOptions = {
      colunas: [
        [
          { content: "Unidade", styles: { halign: "left" as const } },
          { content: "Submercado", styles: { halign: "left" as const } },
          { content: "Conexão", styles: { halign: "left" as const } },
          { content: "Concessão", styles: { halign: "left" as const } },
        ],
      ],
      linhas: [
        [
          { content: cabecalho.unidade, styles: { halign: "left" as const } },
          {
            content: cabecalho.subMercado,
            styles: { halign: "left" as const },
          },
          { content: cabecalho.conexao, styles: { halign: "left" as const } },
          { content: cabecalho.concessao, styles: { halign: "left" as const } },
        ],
      ],
      inicioMarginTop: secaoEmpresaMarginTop - margins.marginXsTop,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...resetEstilosTabela,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela1);
    let margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* EMPRESA TABELA 2 */
    const dadosEmpresaTabela2: CustomUserOptions = {
      colunas: [
        [
          { content: "CNPJ", styles: { halign: "left" as const } },
          {
            content: "Inscrição Estadual",
            styles: { halign: "left" as const },
          },
          { content: "Endereço", styles: { halign: "left" as const } },
          { content: "Município", styles: { halign: "left" as const } },
          { content: "UF", styles: { halign: "left" as const } },
        ],
      ],
      linhas: [
        [
          {
            content: relatorio.cabecalho.cnpj,
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.inscricaoEstadual,
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.endereco,
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.municipio,
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.uf,
            styles: { halign: "left" as const },
          },
        ],
      ],
      inicioMarginTop: margintTopTabelaDinamico,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...resetEstilosTabela,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela2);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO MERCADO CATIVO E LIVRE ----------------------------------------------------------------------------- */
    const criarLinhaLancamento = (lancamento: ILancamentoRelatorioFinal) => {
      const temDescricaoSignificativa =
        lancamento.descricao && lancamento.descricao.trim() !== "";
      const temObservacaoSignificativa =
        lancamento.observacao && lancamento.observacao.trim() !== "";
      const temValorSignificativo =
        (lancamento.montante && lancamento.montante !== 0) ||
        (lancamento.total && lancamento.total !== 0);

      const testeTarifa = lancamento.tarifa || lancamento.tarifa !== 0;

      const isTotalizador = lancamento.totalizador || lancamento.subTotalizador;
      if (
        !isTotalizador &&
        !temValorSignificativo &&
        !temObservacaoSignificativa &&
        testeTarifa
      ) {
        return null;
      }

      if (
        !isTotalizador &&
        !temValorSignificativo &&
        !temObservacaoSignificativa
      ) {
        return null;
      }

      if (isTotalizador && !temDescricaoSignificativa) {
        return null;
      }

      const valorFormatado = formatarTotal(lancamento.total);
      const valorNegativo = lancamento.total < 0;

      if (lancamento.observacao) {
        return [
          {
            content: lancamento.descricao,
            styles: { halign: "left" },
          },
          {
            content: "",
            styles: { halign: "center" },
          },
          {
            content: lancamento.observacao,
            colsPan: 2,
            styles: { halign: "left" },
          },
        ];
      }

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
            content: formatarTotal(lancamento.total),
            styles: {
              fontStyle: "bold",
              fillColor: "#f5f9fc",
              halign: "center",
              textColor: valorNegativo ? "#ff0000" : "#333333",
            },
          },
        ];
      }

      if (lancamento.subTotalizador) {
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
          {
            content: valorFormatado,
            styles: {
              halign: "center",
              textColor: valorNegativo ? "#ff0000" : "#333333",
            },
          },
        ];
      }

      return [
        {
          content: lancamento.descricao,
          styles: { halign: "left" },
        },
        {
          content: formatarValorComUnidade(
            +lancamento.tipoMontante,
            lancamento.montante
          ),
          styles: { halign: "center" },
        },
        {
          content: formatarValorComUnidade(
            +lancamento.tipoLancamento,
            lancamento.tarifa
          ),
          styles: { halign: "center" },
        },
        {
          content: valorFormatado,
          styles: {
            halign: "center",
            textColor: valorNegativo ? "#ff0000" : "#333333",
          },
        },
      ];
    };

    const processarGruposRelatorio = (): number => {
      if (!relatorio.grupos?.length) {
        return margintTopTabelaDinamico;
      }

      for (const grupo of relatorio.grupos) {
        const secaoGrupoMarginTop = criarTituloSecao(
          grupo.titulo,
          margintTopTabelaDinamico + margins.sectionMarginTop
        );

        const linhas: any[][] = [];

        if (grupo.subGrupos?.length) {
          grupo.subGrupos.forEach((subGrupo) => {
            if (subGrupo.lancamentos?.length) {
              subGrupo.lancamentos.forEach((lancamento) => {
                const linha = criarLinhaLancamento(lancamento);
                if (linha !== null) {
                  linhas.push(linha);
                }
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
              {
                content: grupo.colunaQuantidade || "",
                styles: { cellWidth: 90 },
              },
              { content: grupo.colunaValor || "" },
              { content: grupo.colunaTotal || "" },
            ],
          ],
          linhas: linhas,
          inicioMarginTop: secaoGrupoMarginTop - margins.marginXsTop,
          theme: "plain",
          styles: {
            lineColor: "#DDDDDD",
            lineWidth: 0.5,
          },
          ...estilosTabela,
        };

        this.pdfConfig.criarTabela(doc, dadosTabela);

        const autoTableDoc = doc as unknown as {
          lastAutoTable?: { finalY: number };
        };
        margintTopTabelaDinamico =
          autoTableDoc.lastAutoTable?.finalY || margintTopTabelaDinamico;
      }

      return margintTopTabelaDinamico;
    };

    margintTopTabelaDinamico = processarGruposRelatorio();

    /* SEÇÃO COMPARATIVO CATIVO X LIVRE --------------------------------------------------------------- */
    const secaoComparativoMarginTop = criarTituloSecao(
      "ECONOMIA MERCADO LIVRE VS. MERCADO CATIVO",
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
          {
            content: "Economia = 16 %",
            styles: { halign: "left" as const },
          },
          { content: "Total Economizado = R$ 16.403,12" },
        ],
        [
          {
            content: "Valor devido a Coenel-DE",
            styles: { halign: "left" as const },
          },
          {
            content: "2 Sal. Mín. + 10% economia",
            styles: { halign: "left" as const },
          },
          {
            content: "Venc.: 16/01/2024 10% ",
          },
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
            styles: {
              fontStyle: "bold" as const,
              fillColor: "#f5f9fc",
              halign: "left",
            },
          },
          {
            content: "R$ 7.823,12",
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
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...estilosTabela,
    };

    this.pdfConfig.criarTabela(doc, dadosComparativoTabela);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    if (graficoImagem && relatorio?.grafico?.titulo) {
      const graficoMarginTop = criarTituloSecao(
        relatorio?.grafico?.titulo,
        margintTopTabelaDinamico + margins.sectionMarginTop
      );
      this.pdfConfig.addImagem(doc, {
        src: graficoImagem,
        marginLeft: 20,
        marginTop: graficoMarginTop,
        width: pdfWidth - 20,
        height: graficoPdfHeight,
      });

      margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;
    }

    /* SEÇÃO OBSERVAÇÃO ------------------------------------------------------------------------------- */
    this.pdfConfig.criarTabela(doc, {
      colunas: [
        [
          {
            content: relatorio?.comparativo?.observacao,
            styles: { fontStyle: "bold", halign: "center" },
            colSpan: 2,
          },
        ],
      ],
      linhas: [],
      inicioMarginTop: margintTopTabelaDinamico + margins.sectionMarginTop,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
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
