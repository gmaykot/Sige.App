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
import { TIPO_CONEXAO } from "../../../@core/enum/status-contrato";
import { HelperPdfService } from "../../../@core/services/util/help-pdf.service";
import { BANDEIRAS } from "../../../@core/enum/const-dropbox";

@Injectable({ providedIn: "root" })
export class RelatorioEconomiaPdfService {
  constructor(private pdfConfig: PdfConfigService) {}

  public blobPDF(response: IRelatorioFinal, graficoImagem: string): any {
    const pdf = this.createPDF(response, graficoImagem);
    return pdf.output("blob");
  }

  public downloadPDF(response: IRelatorioFinal, graficoImagem: string) {
    const pdf = this.createPDF(response, graficoImagem);
    pdf.save(
      `relatorio_economia_${response.cabecalho.unidade
        .replace(" ", "_")
        .toLocaleLowerCase()}_${response.cabecalho.mesReferencia.replace(
        "/",
        ""
      )}.pdf`
    );
  }

  private createPDF(response?: IRelatorioFinal, graficoImagem?: string): jsPDF {
    // TAMANHO A4 EM PT: 595.35 x 841.995
    const doc = new jsPDF("p", "pt", "a4");
    const pdfWidth = doc.internal.pageSize.getWidth();
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
      maximumFractionDigits: 4,
    });

    const formatadorNumeroMWh = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });

    const formatadorNumeroTarifa = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });

    const formatadorNumeroSimples = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

      return `${
        tipo === 0
          ? formatadorNumeroMWh.format(valor)
          : formatadorNumero.format(valor)
      } ${tipos[tipo]}`;
    };

    const formatarTarifaComUnidade = (tipo: number, valor: number) => {
      if (valor === undefined || valor === null || valor === 0) return "-";

      const tipos = {
        0: "MWh",
        1: "kW",
        2: "kWh",
        3: "%",
      };

      return `R$ ${formatadorNumeroTarifa.format(valor)} ${tipos[tipo]}`;
    };

    const criarTituloSecao = (
      texto: string,
      marginTop: number,
      posicaoTexto?: string
    ) => {
      let textoPosicao;

      switch (posicaoTexto) {
        case "textoCentro":
          textoPosicao = { textoCentro: texto };
          break;
        case "textoEsquerda":
          textoPosicao = { textoEsquerda: texto };
          break;
        case "textoDireita":
          textoPosicao = { textoDireita: texto };
          break;
        default:
          textoPosicao = { textoEsquerda: texto };
          break;
      }

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
      marginLeft: margins.marginLeft - 13,
      marginTop: margins.marginTop + 13,
      width: 130,
      height: 57,
    });

    const ajusteMargim = 25;
    let margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;
    /* COMPARATIVO GRÁFICO */
    if (graficoImagem && relatorio?.grafico?.titulo) {
      const graficoMarginTop = this.pdfConfig.adicionarTextoEmPosicao(doc, {
        texto: relatorio?.grafico?.titulo,
        x: 354,
        y: 109,
        tema: "rotulo",
        propriedadesPersonalizadas: {
          fontSize: 6.5,
        },
      });

      this.pdfConfig.addImagem(doc, {
        src: graficoImagem,
        marginLeft: 312,
        marginTop: 115,
        width: 255,
        height: 95,
      });

      // Atualizar a posição vertical para elementos subsequentes
      margintTopTabelaDinamico = graficoMarginTop.finalY + graficoPdfHeight; // Adicionando espaço extra
    }

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: HelperPdfService.getLocalRodape(),
      x: doc.internal.pageSize.getWidth() - 172,
      y: 830,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "normal",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Unidade",
      x: margins.marginLeft + 130 + 10,
      y: margins.marginTop + 55 / 2 + 12 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.unidade,
      x: margins.marginLeft + 130 + 10,
      y: margins.marginTop + 55 / 2 + 22 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "CNPJ",
      x: margins.marginLeft + 370,
      y: margins.marginTop + 55 / 2 + 12 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.cnpj,
      x: margins.marginLeft + 370,
      y: margins.marginTop + 55 / 2 + 22 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Inscrição Estadual",
      x: margins.marginLeft + 460,
      y: margins.marginTop + 55 / 2 + 12 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.inscricaoEstadual ?? "-",
      x: margins.marginLeft + 460,
      y: margins.marginTop + 55 / 2 + 22 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Endereço",
      x: margins.marginLeft + 130 + 10,
      y: margins.marginTop + 55 / 2 + 31 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.endereco ?? "-",
      x: margins.marginLeft + 130 + 10,
      y: margins.marginTop + 55 / 2 + 41 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Município",
      x: margins.marginLeft + 370,
      y: margins.marginTop + 55 / 2 + 31 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.municipio ?? "-",
      x: margins.marginLeft + 370,
      y: margins.marginTop + 55 / 2 + 41 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "UF",
      x: margins.marginLeft + 500,
      y: margins.marginTop + 55 / 2 + 31 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.uf ?? "-",
      x: margins.marginLeft + 500,
      y: margins.marginTop + 55 / 2 + 41 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Concessão",
      x: margins.marginLeft + 130 + 10,
      y: margins.marginTop + 55 / 2 + 50 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.concessao ?? "-",
      x: margins.marginLeft + 130 + 10,
      y: margins.marginTop + 55 / 2 + 60 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Submercado",
      x: margins.marginLeft + 220,
      y: margins.marginTop + 55 / 2 + 50 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: cabecalho.subMercado ?? "-",
      x: margins.marginLeft + 220,
      y: margins.marginTop + 55 / 2 + 60 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Conexão",
      x: margins.marginLeft + 300,
      y: margins.marginTop + 55 / 2 + 50 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: TIPO_CONEXAO[cabecalho.conexao]?.desc ?? "-",
      x: margins.marginLeft + 300,
      y: margins.marginTop + 55 / 2 + 60 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Bandeira Tarifária",
      x: margins.marginLeft + 400,
      y: margins.marginTop + 55 / 2 + 50 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 6,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: BANDEIRAS[cabecalho.bandeira]?.desc ?? "-",
      x: margins.marginLeft + 400,
      y: margins.marginTop + 55 / 2 + 60 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 8,
        textColor: this.getCorBandeira(cabecalho.bandeira),
      },
    });

    this.pdfConfig.adicionarTextoHorizontal(doc, {
      textoCentro: `Quadro Comparativo Mensal Mercado Cativo x Livre ${
        cabecalho.mesReferencia ?? ""
      }`,
      marginTop: margins.marginTop + 108 - ajusteMargim,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 11,
      },
    });

    const imageBottomY = margins.marginTop + 57 + 20 - 10;

    /* SEÇÃO DADOS EMPRESA ---------------------------------------------------------------------------- */
    const secaoEmpresaMarginTop = criarTituloSecao(
      "",
      Math.max(imageBottomY, margins.sectionMarginTop)
    );

    /* EMPRESA TABELA 1 */
    const dadosEmpresaTabela1: CustomUserOptions = {
      colunas: [],
      linhas: [],
      inicioMarginTop: secaoEmpresaMarginTop - margins.marginXsTop,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...resetEstilosTabela,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela1);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY;

    /* EMPRESA TABELA 2 */
    const dadosEmpresaTabela2: CustomUserOptions = {
      colunas: [],
      linhas: [],
      inicioMarginTop: margintTopTabelaDinamico + 2,
      theme: "plain",
      styles: {
        lineColor: "#DDDDDD",
        lineWidth: 0.5,
      },
      ...resetEstilosTabela,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela2);
    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY + 4;

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
      tableWidth: 280,
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
                fontStyle: (lancamento.total || lancamento.subTotal
                  ? "bold"
                  : "italic") as EstiloTextoPdf["fontStyle"],
              },
            },
            {
              content:
                lancamento.percentual !== undefined
                  ? `${formatadorNumeroSimples.format(lancamento.percentual)}%`
                  : "",
              styles: {
                halign: "center" as const,
                fontStyle: (lancamento.total || lancamento.subTotal
                  ? "bold"
                  : "italic") as EstiloTextoPdf["fontStyle"],
              },
            },
            {
              content:
                lancamento.valor !== undefined
                  ? `${formatadorMoeda.format(lancamento.valor)}`
                  : "-",
              styles: {
                halign: "center" as const,
                fontStyle: (lancamento.total || lancamento.subTotal
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
              styles: { halign: "left" as const },
            },
            {
              content:
                lancamento.percentual !== undefined
                  ? `${formatadorNumeroSimples.format(lancamento.percentual)}%`
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

    /* SEÇÃO OBSERVAÇÃO ------------------------------------------------------------------------------- */
    this.pdfConfig.adicionarTextoHorizontal(doc, {
      textoCentro: relatorio?.comparativo?.observacao,
      marginTop: margintTopTabelaDinamico + 10,
      tema: "rotulo",
      propriedadesPersonalizadas: {
        fontSize: 6.5,
      },
    });

    margintTopTabelaDinamico = (doc as any)?.lastAutoTable?.finalY + 12;
    const fillColor = "#ff99cc"; // '#f6dada';

    if (graficoImagem && relatorio?.grafico?.titulo) {
      this.pdfConfig.adicionarTextoEmPosicao(doc, {
        texto: relatorio?.cabecalho?.tarifaFornecimento,
        x: 380,
        y: margintTopTabelaDinamico + margins.sectionMarginTop - 6,
        tema: "rotulo",
        propriedadesPersonalizadas: {
          fontSize: 6,
          fontStyle: "italic",
        },
      });
    }

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

      const titulos = [
        "sub-total de compra de energia elétrica",
        "sub-total de valores referente a distribuidora",
        "total geral mercado livre",
      ];

      if (lancamento.totalizador) {
        return [
          {
            content: lancamento.descricao,
            styles: {
              halign: "left",
              fontStyle: "bold",
              ...(titulos.includes(lancamento.descricao.toLowerCase().trim())
                ? { fillColor: fillColor }
                : {}),
              textColor: "#333333",
            },
            colSpan: 3,
          },
          {
            content: formatarTotal(lancamento.total),
            styles: {
              fontStyle: "bold",
              ...(titulos.includes(lancamento.descricao.toLowerCase().trim())
                ? { fillColor: fillColor }
                : {}),
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
              ...(titulos.includes(lancamento.descricao.toLowerCase().trim())
                ? { fillColor: fillColor }
                : {}),
              textColor: "#333333",
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
              ...(titulos.includes(lancamento.descricao.toLowerCase().trim())
                ? { fillColor: fillColor }
                : {}),
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
          content: formatarTarifaComUnidade(
            +lancamento.tipoTarifa,
            lancamento.tarifa
          ),
          styles: { halign: "center" },
        },
        {
          content: valorFormatado,
          styles: {
            ...(titulos.includes(lancamento.descricao.toLowerCase().trim())
              ? { fillColor: fillColor }
              : {}),
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
          margintTopTabelaDinamico + margins.sectionMarginTop - 8
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
                  styles: {
                    halign: "left",
                    fontStyle: "bold",
                    fillColor: fillColor,
                    textColor: "#333333",
                  },
                },
                {
                  content: totalFormatado,
                  styles: {
                    halign: "center",
                    fontStyle: "bold",
                    fillColor: fillColor,
                    textColor: "#333333",
                  },
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
              { content: grupo.colunaValor + " (R$)" || "" },
              { content: grupo.colunaTotal + " (R$)" || "" },
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

  getCorBandeira(id: number): string {
    switch (id) {
      case 0:
        return "#FFC107"; // Amarela
      case 1:
        return "#4CAF50"; // Verde
      case 2:
        return "#F44336"; // Vermelha 1
      case 3:
        return "#B71C1C"; // Vermelha 2
      default:
        return "#000000"; // Preto padrão
    }
  }
}
