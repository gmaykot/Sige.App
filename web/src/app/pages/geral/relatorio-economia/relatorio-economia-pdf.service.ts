import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  CustomUserOptions,
  EstiloTextoPdf,
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
    const comparativo = response.comparativo;
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

    const criarTituloSecao = (
      texto: string,
      marginTop: number,
      posicaoTexto?: "textoCentro"
    ) => {
      const textoPosicao =
        posicaoTexto !== "textoCentro"
          ? {
              textoEsquerda: texto,
            }
          : { textoCentro: texto };

      return this.pdfConfig.adicionarTextoHorizontal(doc, {
        ...textoPosicao,
        marginTop: marginTop,
        tema: "rotulo",
        propriedadesPersonalizadas: {
          fontSize: 6.5,
        },
      });
    };

    /* ESTILOS PADRÃO TABELA ---------------------------------------------------------------- */
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

    const estilosTabela = {
      headStyles: {
        fontSize: 6,
        textColor: "#2e2e2e",
        fontStyle: "bold" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 6,
        textColor: "#464646",
        fontStyle: "normal" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: "#F5F5F5",
      },
      footStyles: {
        fillColor: "#E9E9E9",
        textColor: "#464646",
        fontStyle: "bold" as const,
      },
      // Aplicar as funções de desenho personalizado
      ...desenharBordasPersonalizadas,
    };

    const resetEstilosTabela = {
      headStyles: {
        fontSize: 6,
        fontStyle: "bold" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 1,
        lineColor: "#FFFFFF",
      },
      bodyStyles: {
        fontSize: 6,
        fontStyle: "normal" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 1,
        lineColor: "#FFFFFF",
      },
    };

    /* LOGO & TITULO CABEÇALHO ---------------------------------------------------------------- */
    this.pdfConfig.addImagem(doc, {
      src: "assets/images/logo.png",
      marginLeft: margins.marginLeft,
      marginTop: margins.marginTop,
      width: 130,
      height: 57,
    });

    const dataHoje = new Date();
    const dataOptions = { month: "numeric" as const, year: "numeric" as const };
    const dataFormatada = dataHoje.toLocaleDateString("pt-BR", dataOptions);

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: `Relatório de Economia ${cabecalho.mesReferencia}`,
      x: margins.marginLeft + 130 + 20,
      y: margins.marginTop + 57 / 2,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 12,
      },
    });

    const imageBottomY = margins.marginTop + 57 + 10;

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
            content: relatorio.cabecalho.cnpj ?? "-",
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.inscricaoEstadual ?? "-",
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.endereco ?? "-",
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.municipio ?? "-",
            styles: { halign: "left" as const },
          },
          {
            content: relatorio.cabecalho.uf ?? "-",
            styles: { halign: "left" as const },
          },
        ],
      ],
      inicioMarginTop: margintTopTabelaDinamico + 5,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...resetEstilosTabela,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela2);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO COMPARATIVO CATIVO X LIVRE --------------------------------------------------------------- */
    const hasComparativoData = comparativo?.lancamentos?.length > 0;
    const secaoComparativoMarginTop = criarTituloSecao(
      "MERCADO CATIVO VS. MERCADO LIVRE",
      margintTopTabelaDinamico + margins.sectionMarginTop
    );

    /* COMPARATIVO TABELA */
    const dadosComparativoTabela: CustomUserOptions = {
      colunas: [
        [
          {
            content: comparativo.titulo,
            styles: { halign: "center" },
            colSpan: 4,
          },
        ],
        [
          { content: "", styles: { fontStyle: "bold" } },
          {
            content: "Percentual (%)",
            styles: { fontStyle: "bold", halign: "center" },
          },
          {
            content: "Valor (R$)",
            styles: { fontStyle: "bold", halign: "center" },
          },
          {
            content: "Observação",
            styles: { fontStyle: "bold", halign: "center" },
          },
        ],
      ],
      linhas: [], // Será preenchido dinamicamente
      inicioMarginTop: secaoComparativoMarginTop - margins.marginXsTop,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...estilosTabela,
    };

    if (hasComparativoData) {
      comparativo.lancamentos.forEach((lancamento) => {
        if (lancamento.subTotal || lancamento.total) {
          // Linhas de subtotal ou total (com ênfase)
          const linha = [
            {
              content: lancamento.descricao,
              styles: {
                halign: "left" as const,
                fontStyle: (lancamento.total
                  ? "bold"
                  : "italic") as EstiloTextoPdf["fontStyle"],
              },
            },
            {
              content:
                lancamento.percentual !== undefined
                  ? `${formatadorNumero.format(lancamento.percentual)}%`
                  : "",
              styles: {
                halign: "center" as const,
                fontStyle: (lancamento.total
                  ? "bold"
                  : "italic") as EstiloTextoPdf["fontStyle"],
              },
            },
            {
              content: formatadorMoeda.format(lancamento.valor),
              styles: {
                halign: "center" as const,
                fontStyle: (lancamento.total
                  ? "bold"
                  : "italic") as EstiloTextoPdf["fontStyle"],
              },
            },
            {
              content: lancamento.subTotal ? lancamento.observacao : "",
              styles: {
                halign: "center" as const,
                fontStyle: "italic" as const,
              },
            },
          ];

          dadosComparativoTabela.linhas.push(linha);
        } else {
          const linha = [
            {
              content: lancamento.descricao,
              styles: { halign: "left" as "left" },
            },
            {
              content:
                lancamento.percentual !== undefined
                  ? `${formatadorNumero.format(lancamento.percentual)}%`
                  : "",
              styles: { halign: "center" as const },
            },
            {
              content: formatadorMoeda.format(lancamento.valor),
              styles: { halign: "center" as const },
            },
            {
              content: lancamento.observacao || "",
              styles: { halign: "center" as const },
            },
          ];
          dadosComparativoTabela.linhas.push(linha);
        }
      });

      this.pdfConfig.criarTabela(doc, dadosComparativoTabela);
      margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;
    }

    /* COMPARATIVO GRÁFICO */
    if (graficoImagem && relatorio?.grafico?.titulo) {
      const graficoMarginTop = criarTituloSecao(
        relatorio?.grafico?.titulo,
        margintTopTabelaDinamico + margins.sectionMarginTop,
        "textoCentro"
      );

      this.pdfConfig.addImagem(doc, {
        src: graficoImagem,
        marginLeft: 20,
        marginTop: graficoMarginTop,
        width: pdfWidth - 40, // Reduzindo para 40 para dar mais margem
        height: graficoPdfHeight,
      });

      // Atualizar a posição vertical para elementos subsequentes
      margintTopTabelaDinamico = graficoMarginTop + graficoPdfHeight + 10; // Adicionando espaço extra
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
      inicioMarginTop: !hasComparativoData
        ? secaoComparativoMarginTop - 4
        : margintTopTabelaDinamico + 4,
      theme: "plain",
      ...estilosTabela,
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
        fillColor: "#F5F5F5",
      },
    });

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
              fillColor: "#F5F5F5",
            },
            colSpan: 3,
          },
          {
            content: formatarTotal(lancamento.total),
            styles: {
              fontStyle: "bold",
              fillColor: "#F5F5F5",
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
