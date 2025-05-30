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
      maximumFractionDigits: 3,
    });

    // const formatarValorComUnidade = (
    //   valor: number | undefined,
    //   unidade: string
    // ): string => {
    //   return valor === undefined || valor === null || valor === 0
    //     ? "-"
    //     : `${formatadorNumero.format(valor)} ${unidade}`;
    // };

    const formatarTotal = (valor: number | undefined): string => {
      return valor === undefined || valor === null || valor === 0
        ? "-"
        : formatadorMoeda.format(valor);
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

    // Função global para desenhar bordas personalizadas em todas as tabelas
    const desenharBordasPersonalizadas = {
      // Função para evitar o desenho automático de bordas
      willDrawCell: function (data) {
        // Desativa qualquer desenho automático de bordas
        if (data.cell.styles) {
          data.cell.styles.lineWidth = 0;
        }
        return true;
      },

      // Função para desenhar manualmente as bordas horizontais e a borda externa
      didDrawCell: function (data) {
        const doc = data.doc;
        const cell = data.cell;
        const cursor = data.cursor;

        // Configuração consistente de linha
        doc.setDrawColor("#DDDDDD");
        doc.setLineWidth(0.5);

        // Identifica posição da célula na tabela
        const isFirstRow = data.row.index === 0;
        const isLastRow = data.row.index === data.table.body.length - 1;
        const isFirstCol = data.column.index === 0;
        const isLastCol = data.column.index === data.table.columns.length - 1;
        const isNewPage =
          data.row.raw?.pageNumber > 1 ||
          data.row.raw?.startPageNumber < data.row.raw?.pageNumber;
        const isFirstRowOnPage = data.cell.raw?.y === data.table.startPageY;

        // Desenha borda inferior (para todas as células)
        doc.line(
          cursor.x,
          cursor.y + cell.height,
          cursor.x + cell.width,
          cursor.y + cell.height
        );

        // Desenha borda superior para primeira linha e qualquer linha em nova página
        if (isFirstRow || isFirstRowOnPage) {
          doc.line(cursor.x, cursor.y, cursor.x + cell.width, cursor.y);
        }

        // Desenha borda esquerda (apenas primeira coluna)
        if (isFirstCol) {
          doc.line(cursor.x, cursor.y, cursor.x, cursor.y + cell.height);
        }

        // Desenha borda direita (apenas última coluna)
        if (isLastCol) {
          doc.line(
            cursor.x + cell.width,
            cursor.y,
            cursor.x + cell.width,
            cursor.y + cell.height
          );
        }
      },
    };

    // Estilos básicos para tabelas (sem definições de borda)
    const estilosTabela = {
      headStyles: {
        fontSize: 7,
        fillColor: "#f5f9fc",
        textColor: "#4285F4",
        fontStyle: "bold" as const,
        halign: "center" as const,
        valign: "middle" as const,
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 7,
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
      inicioMarginTop: secaoEmpresaMarginTop,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...estilosTabela,
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
      inicioMarginTop: margintTopTabelaDinamico + margins.headerMarginTop,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...estilosTabela,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela2);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO MERCADO CATIVO E LIVE ----------------------------------------------------------------------------- */
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
            styles: { halign: "center" },
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
          styles: { halign: "center" },
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
          inicioMarginTop: secaoGrupoMarginTop,
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
          {
            content: "Economia = 16,00 %",
            styles: { halign: "left" as const },
          },
          { content: "R$ 11.696,70" },
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
            styles: {
              fontStyle: "bold" as const,
              fillColor: "#f5f9fc",
              halign: "left",
            },
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
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
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
