import { Injectable } from "@angular/core";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import {
  IRelatorioMedicao,
  IValoresMedicao,
  IValoresMedicaoAnalitico,
} from "../../../@core/data/relatorio-medicao";
import { DatePipe, DecimalPipe } from "@angular/common";
import { CapitalizePipe } from "../../../@theme/pipes";

import {
  margins,
  PdfConfigService,
  PdfTextoType,
} from "../../../@core/services/util/pdf-config.service";
import { ETipoEnergia } from "../../../@core/enum/tipo-energia";

@Injectable({ providedIn: "root" })
export class RelatorioMedicaoPdfService {
  constructor(
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private capitalizePipe: CapitalizePipe,
    private pdfConfig: PdfConfigService
  ) {}

  public blobPDF(
    relatorioMedicao: IRelatorioMedicao,
    valores: IValoresMedicao,
    resultadoAnalitico: IValoresMedicaoAnalitico[],
    mesReferencia: any
  ): any {
    const pdf = this.createPDF(
      relatorioMedicao,
      valores,
      resultadoAnalitico,
      mesReferencia
    );
    return pdf.output("blob");
  }

  public downloadPDF(
    relatorioMedicao: IRelatorioMedicao,
    valores: IValoresMedicao,
    resultadoAnalitico: IValoresMedicaoAnalitico[],
    mesReferencia: any
  ) {
    const pdf = this.createPDF(
      relatorioMedicao,
      valores,
      resultadoAnalitico,
      mesReferencia
    );
    pdf.save(
      `relatorio_medicao_${
        relatorioMedicao.mesReferencia
          ? relatorioMedicao.mesReferencia
          : mesReferencia
      }_${relatorioMedicao.descGrupo.toLowerCase().replace(" ", "_")}.pdf`
    );
  }

  private createPDF(
    relatorioMedicao: IRelatorioMedicao,
    valores: IValoresMedicao,
    resultadoAnalitico: IValoresMedicaoAnalitico[],
    mesReferencia: any
  ): jsPDF {
    // TAMANHO A4 EM PT: 595.35 x 841.995
    const doc = new jsPDF("p", "pt", "a4");

    {
      /*
        Valores usados em multiplos lugares
      */
      const globalValues = {
        mesReferencia: relatorioMedicao.mesReferencia
          ? relatorioMedicao.mesReferencia
          : mesReferencia,
      };

      /*
          Cabeçalho
        */
      this.pdfConfig.addImagem(doc, {
        src: "assets/images/logo.png",
        marginLeft: margins.marginLeft,
      });

      const tituloCabecalho = `Relatório de Medição ${globalValues.mesReferencia}`;

      const tituloCabecalhoMarginTop = this.pdfConfig.addTextoUnico(
        doc,
        margins?.marginLeft + 170,
        [
          {
            text: tituloCabecalho,
            isBold: true,
            marginTop: margins?.marginLgTop - 15,
            fontSize: 17,
            align: "left",
          },
        ]
      )[0]?.marginTop;

      const tituloCabecalhoHeight =
        this.pdfConfig.getTextoHeight(doc, tituloCabecalho) + 20;

      /*
          Relatório
        */
      const relatorioPdfData: { [key: string]: PdfTextoType[] } = {
        empresa: [
          {
            text: "Empresa:",
            isBold: true,
            marginTop:
              tituloCabecalhoHeight +
              tituloCabecalhoMarginTop +
              margins?.sectionXsMarginTop,
          },
          {
            text: relatorioMedicao.descGrupo?.toUpperCase(),
            marginTop:
              tituloCabecalhoHeight +
              tituloCabecalhoMarginTop +
              margins?.sectionXsMarginTop,
            lineWidth: 415,
            borderColor: "#ffffff",
          },
        ],
        contrato: [
          {
            text: "Contrato:",
            isBold: true,
          },
          {
            text: relatorioMedicao.numContrato,
            borderColor: "#ffffff",
          },
        ],
        fornecedor: [
          {
            text: "Fornecedor:",
            isBold: true,
          },
          {
            text: relatorioMedicao.descFornecedor?.toUpperCase(),
            lineWidth: 415,
            borderColor: "#ffffff",
          },
        ],
        horasMes: [
          {
            text: "Horas do mês:",
            isBold: true,
          },
          {
            text: this.decimalPipe.transform(
              relatorioMedicao?.horasMes,
              "2.0-0",
              "pt"
            ),
          },
        ],
        tipoEnergia: [
          {
            text: "Tipo de Energia:",
            isBold: true,
          },
          {
            text: this.tipoEnergiaMapper(relatorioMedicao.tipoEnergia),
            borderColor: "#ffffff",
            lineWidth: 415,
          },
        ],
        valorUnitarioKwh: [
          {
            text: "Valor MWh:",
            isBold: true,
          },
          {
            text:
              "R$ " +
              this.decimalPipe.transform(
                relatorioMedicao?.valorUnitarioKwh,
                "2.2-2",
                "pt"
              ),
          },
        ],
      };

      this.pdfConfig.addMarginTop(relatorioPdfData, "contrato", "empresa");
      this.pdfConfig.addMarginTop(
        relatorioPdfData,
        "fornecedor",
        "contrato",
        margins.itemSpacing
      );
      this.pdfConfig.addMarginTop(relatorioPdfData, "horasMes", "fornecedor");
      this.pdfConfig.addMarginTop(
        relatorioPdfData,
        "tipoEnergia",
        "horasMes",
        margins.itemSpacing
      );
      this.pdfConfig.addMarginTop(
        relatorioPdfData,
        "valorUnitarioKwh",
        "horasMes",
        margins.itemSpacing
      );

      const relatorioData = this.pdfConfig.formatarPdfData(relatorioPdfData);
      this.pdfConfig.addMultiplosTextos(doc, relatorioData);

      /*
          Consumo
        */
      const tituloConsumo = "Consumo";
      const tituloConsumoMarginTop = this.pdfConfig.addTextoUnico(
        doc,
        margins?.marginLeft,
        [
          {
            text: tituloConsumo,
            isBold: true,
            marginTop:
              relatorioPdfData.tipoEnergia[0]?.marginTop +
              margins?.sectionMdMarginTop,
            fontSize: 14,
          },
        ]
      )[0]?.marginTop;

      const tituloConsumoHeight = this.pdfConfig.getTextoHeight(
        doc,
        tituloConsumo
      );

      const totalCurtoPrazo =
        valores.comprarCurtoPrazo > 0
          ? this.decimalPipe.transform(valores.comprarCurtoPrazo, "2.3-3", "pt")
          : this.decimalPipe.transform(valores.venderCurtoPrazo, "2.3-3", "pt");

      const consumoPdfData: { [key: string]: PdfTextoType[] } = {
        medido: [
          {
            text: "Medido:",
            lineWidth: 455,
            textSpacing: 5,
            marginTop:
              tituloConsumoHeight +
              tituloConsumoMarginTop +
              margins?.headerMarginTop,
          },
          {
            text:
              this.decimalPipe.transform(
                relatorioMedicao.totalMedido,
                "2.3-3",
                "pt"
              ) + " (kWh)",
            marginTop:
              tituloConsumoHeight +
              tituloConsumoMarginTop +
              margins?.headerMarginTop,
          },
        ],
        medidoPerdas: [
          {
            text: `Medido + 3% perdas = (+) ${this.getDesconto(
              this.decimalPipe.transform(
                relatorioMedicao.totalMedido,
                "2.3-3",
                "pt"
              )
            )}:`,
            lineWidth: 455,
            textSpacing: 5,
          },
          {
            text:
              this.decimalPipe.transform(valores.valorPerdas, "2.3-3", "pt") +
              " (MWh)",
          },
        ],
        proinfa: [
          {
            text: `Desconto PROINFA no mês = (-) ${this.decimalPipe.transform(
              relatorioMedicao.proinfa,
              "2.3-3",
              "pt"
            )}:`,
            lineWidth: 455,
            textSpacing: 5,
          },
          {
            text:
              this.decimalPipe.transform(
                valores.valorConsumoTotal,
                "2.3-3",
                "pt"
              ) + " (MWh)",
          },
        ],
        totalContabilizado: [
          {
            text: "Total contabilizado: ",
            lineWidth: 455,
            textSpacing: 5,
            isBold: true,
          },
          {
            text:
              this.decimalPipe.transform(
                valores.valorConsumoTotal,
                "2.3-3",
                "pt"
              ) + " (MWh)",
            isBold: true,
          },
        ],
        totalLongoPrazo: [
          {
            text: "Total à faturar no longo prazo:",
            isBold: true,
            lineWidth: 455,
            textSpacing: 5,
          },
          {
            text:
              this.decimalPipe.transform(
                valores.faturarLongoPrazo,
                "2.3-3",
                "pt"
              ) + " (MWh)",
            isBold: true,
            borderColor: "#ffffff",
          },
        ],
        totalCurtoPrazo: [
          {
            text: "Total à faturar no curto prazo:",
            isBold: true,
            lineWidth: 455,
            textSpacing: 5,
          },
          {
            text: totalCurtoPrazo + " (MWh)",
            isBold: true,
          },
        ],
        dentroTake: [
          {
            text: "Dentro do TAKE:",
            isBold: true,
            lineWidth: 455,
            textSpacing: 5,
          },
          {
            text: this.capitalizePipe.transform(
              valores.dentroTake ? "SIM" : "NÃO"
            ),
            isBold: true,
          },
        ],
      };

      this.pdfConfig.addMarginTop(
        consumoPdfData,
        "medidoPerdas",
        "medido",
        margins.itemSpacing
      );
      this.pdfConfig.addMarginTop(
        consumoPdfData,
        "proinfa",
        "medidoPerdas",
        margins.itemSpacing
      );
      this.pdfConfig.addMarginTop(
        consumoPdfData,
        "totalContabilizado",
        "proinfa",
        margins.itemSpacing
      );
      this.pdfConfig.addMarginTop(
        consumoPdfData,
        "totalLongoPrazo",
        "totalContabilizado",
        margins.itemSpacing
      );
      this.pdfConfig.addMarginTop(
        consumoPdfData,
        "totalCurtoPrazo",
        "totalLongoPrazo",
        margins.itemSpacing
      );

      this.pdfConfig.addMarginTop(
        consumoPdfData,
        "dentroTake",
        "totalCurtoPrazo",
        margins.itemSpacing
      );

      const consumoData = this.pdfConfig.formatarPdfData(consumoPdfData);
      this.pdfConfig.addMultiplosTextos(doc, consumoData);

      /*
          Previsão Contratual
        */
      const tituloPrevContratual = "Previsão Contratual";
      const tituloPrevContratualMarginTop = this.pdfConfig.addTextoUnico(
        doc,
        margins?.marginLeft,
        [
          {
            text: tituloPrevContratual,
            isBold: true,
            marginTop:
              consumoPdfData.totalCurtoPrazo[0]?.marginTop +
              margins?.sectionMdMarginTop +
              20,
            fontSize: 14,
          },
        ]
      )[0]?.marginTop;

      const tituloPrevContratualHeight = this.pdfConfig.getTextoHeight(
        doc,
        tituloPrevContratual
      );

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
            data.column.index + (cell.colSpan ?? 1) ===
            data.table.columns.length;

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
          fontSize: 9,
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

      autoTable(doc, {
        head: [
          [
            "Mês",
            "hs mês",
            "Energia cont. (MWh)",
            `Flex -${relatorioMedicao.takeMinimo}%`,
            `Flex +${relatorioMedicao.takeMinimo}%`,
          ],
        ],
        body: [
          [
            {
              content: relatorioMedicao.mesReferencia
                ? relatorioMedicao.mesReferencia
                : mesReferencia,
              styles: {
                halign: "center",
                fontSize: 10,
              },
            },
            {
              content: this.decimalPipe.transform(
                relatorioMedicao?.horasMes,
                "2.0-0",
                "pt"
              ),
              styles: {
                halign: "center",
                fontSize: 10,
              },
            },
            {
              content: this.decimalPipe.transform(
                relatorioMedicao.energiaContratada,
                "2.3-3",
                "pt"
              ),
              styles: {
                halign: "center",
                fontSize: 10,
              },
            },
            {
              content: this.decimalPipe.transform(
                valores.takeMinimo,
                "2.3-3",
                "pt"
              ),
              styles: {
                halign: "center",
                fontSize: 10,
              },
            },
            {
              content: this.decimalPipe.transform(
                valores.takeMaximo,
                "2.3-3",
                "pt"
              ),
              styles: {
                halign: "center",
                fontSize: 10,
              },
            },
          ],
        ],
        startY: tituloPrevContratualHeight + tituloPrevContratualMarginTop,
        theme: "plain",
        margin: { left: margins?.marginLeft },
        ...estilosTabela,
      });

      const prevContratualTableHeight = (doc as any)?.lastAutoTable?.finalY;

      const prevContratualPdfData: { [key: string]: PdfTextoType[] } = {
        take: [
          {
            text: "Dentro do TAKE:",
            isBold: true,
            marginTop:
              prevContratualTableHeight +
              margins?.tableMarginTop +
              margins?.marginTop,
          },
          {
            text: this.capitalizePipe.transform(
              valores.dentroTake ? "SIM" : "NÃO"
            ),
            marginTop:
              prevContratualTableHeight +
              margins?.tableMarginTop +
              margins?.marginTop,
          },
        ],
      };

      const faturamentoPdfData: { [key: string]: PdfTextoType[] } = {
        take: [
          {
            text: "Faturamento (MWh)",
            isBold: true,
            marginTop:
              prevContratualTableHeight +
              margins?.tableMarginTop +
              margins?.marginTop +
              5,
            fontSize: 14,
          },
        ],
      };

      const faturamentoData =
        this.pdfConfig.formatarPdfData(faturamentoPdfData);
      this.pdfConfig.addMultiplosTextos(doc, faturamentoData);

      const { totalFaturamentoLongoPrazo, venderOuComprar } =
        this.faturamentoHelper(resultadoAnalitico);

      autoTable(doc, {
        head: [
          [
            {
              content: "Unidade",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 9,
              },
            },
            {
              content: "CNPJ",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 9,
              },
            },
            {
              content: "Endereço",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 9,
              },
            },
            {
              content: "Longo Prazo",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 9,
              },
            },
            {
              content: venderOuComprar,
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 9,
              },
            },
            {
              content: "Consumo",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 10,
              },
            },
          ],
        ],
        body: [...this.faturamentoAutoTablePdfData(totalFaturamentoLongoPrazo)],
        startY:
          prevContratualPdfData?.take[0]?.marginTop + margins?.itemSpacing,
        theme: "plain",
        margin: { left: margins?.marginLeft },
        ...estilosTabela,
        showHead: "firstPage",
        styles: { overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: 125 },
          1: { cellWidth: 90 },
          2: { cellWidth: 125 },
        },
      });

      return doc;
    }
  }

  private getDesconto(totalMedido: string) {
    return this.decimalPipe.transform(
      +totalMedido.replace(",", "") * (3 / 100),
      "2.3-3",
      "pt"
    );
  }

  private faturamentoHelper(resultadoAnalitico: IValoresMedicaoAnalitico[]): {
    totalFaturamentoLongoPrazo: any[];
    venderOuComprar: string;
  } {
    const venderOuComprar =
      resultadoAnalitico[0].qtdeComprarCurtoPrazo > 0 ? "Comprar" : "Vender";

    const comprarVenderPrazo = (values): string => {
      return values.qtdeComprarCurtoPrazo > 0
        ? this.decimalPipe.transform(
            values.qtdeComprarCurtoPrazo,
            "1.3-3",
            "pt"
          )
        : this.decimalPipe.transform(
            values.qtdeVenderCurtoPrazo,
            "1.3-3",
            "pt"
          );
    };

    const comprarVenderReal = (values): string => {
      return values.qtdeComprarCurtoPrazo > 0
        ? this.decimalPipe.transform(
            values?.quantidade + values.qtdeComprarCurtoPrazo,
            "1.3-3",
            "pt"
          )
        : this.decimalPipe.transform(
            values?.quantidade - values.qtdeVenderCurtoPrazo,
            "1.3-3",
            "pt"
          );
    };

    const totalFaturamentoLongoPrazo = resultadoAnalitico?.map((values) => {
      return {
        empresa: values.descEmpresa,
        cnpj: values.numCnpj,
        endereco: values.descEndereco ?? "-",
        consumo: this.decimalPipe.transform(values.quantidade, "1.3-3", "pt"),
        consumoReal: comprarVenderReal(values),
        comprarVender: comprarVenderPrazo(values),
      };
    });

    return {
      totalFaturamentoLongoPrazo,
      venderOuComprar,
    };
  }

  private faturamentoAutoTablePdfData(data: any[]): RowInput[] {
    return data?.map((value) => {
      return [
        {
          content: value?.empresa,
          styles: {
            halign: "left",
            valign: "middle",
            fontSize: 8,
          },
        },
        {
          content: value?.cnpj,
          styles: {
            halign: "left",
            valign: "middle",
            fontSize: 8,
          },
        },
        {
          content: value?.endereco,
          styles: {
            halign: "left",
            valign: "middle",
            fontSize: 8,
          },
        },
        {
          content: value?.consumo,
          styles: {
            halign: "center",
            valign: "middle",
            fontSize: 8,
          },
        },
        {
          content: value?.comprarVender,
          styles: {
            halign: "center",
            valign: "middle",
            fontSize: 8,
          },
        },
        {
          content: value?.consumoReal,
          styles: {
            halign: "center",
            valign: "middle",
            fontSize: 8,
          },
        },
      ];
    });
  }

  private tipoEnergiaMapper(tipoEnergia: ETipoEnergia): string {
    switch (tipoEnergia) {
      case 0:
        return "i0 - LP";
      case 1:
        return "i1 - LP";
      case 2:
        return "i5 - LP";
      case 3:
        return "Convencional - LP";
      default:
        return "-";
        break;
    }
  }
}
