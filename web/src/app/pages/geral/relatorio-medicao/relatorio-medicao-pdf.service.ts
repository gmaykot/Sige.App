import { Injectable } from "@angular/core";
import jsPDF, { TextOptionsLight } from "jspdf";
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
      `relatorio_medicao_${relatorioMedicao.mesReferencia
          ? relatorioMedicao.mesReferencia
          : mesReferencia}_${relatorioMedicao.descGrupo.toLowerCase().replace(" ", "_")}.pdf`
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
            : mesReferencia
      };

      /*
          Cabeçalho
        */
      this.pdfConfig.addImagem(doc, {
        src: "assets/images/logo.png",
        marginLeft: margins.marginLeft,
      });

      const cabecalhoInfo = `Bento Gonçalves, ${new Date().toLocaleDateString(
        "pt",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )}`;

      const cabecalhoInfoMarginTop = this.pdfConfig.addTextoUnico(
        doc,
        margins?.right,
        [
          {
            text: cabecalhoInfo,
            marginTop: margins?.marginLgTop,
            align: "right",
          },
        ]
      )[0]?.marginTop;

      const cabecalhoInfoHeight = this.pdfConfig.getTextoHeight(doc, cabecalhoInfo);

      const tituloCabecalho =
        `Relatório de Medição ${globalValues.mesReferencia}`.toUpperCase();

      const tituloCabecalhoMarginTop = this.pdfConfig.addTextoUnico(
        doc,
        margins?.center,
        [
          {
            text: tituloCabecalho,
            isBold: true,
            marginTop:
              cabecalhoInfoHeight +
              cabecalhoInfoMarginTop +
              margins?.marginLgTop,
            fontSize: 14,
            align: "center",
          },
        ]
      )[0]?.marginTop;

      const tituloCabecalhoHeight =
        this.pdfConfig.getTextoHeight(doc, tituloCabecalho);

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
            text: "Valor KWh:",
            isBold: true,
          },
          {
            text: this.decimalPipe.transform(
              relatorioMedicao?.valorUnitarioKwh,
              "2.3-3",
              "pt"
            ),
          },
        ],
      };

      this.pdfConfig.addMarginTop(relatorioPdfData, "contrato", "empresa");
      this.pdfConfig.addMarginTop(relatorioPdfData,"fornecedor","contrato",margins.itemSpacing);
      this.pdfConfig.addMarginTop(relatorioPdfData, "horasMes", "fornecedor");
      this.pdfConfig.addMarginTop(relatorioPdfData,"tipoEnergia","horasMes",margins.itemSpacing);
      this.pdfConfig.addMarginTop(relatorioPdfData, "valorUnitarioKwh", "horasMes",margins.itemSpacing);

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

      const tituloConsumoHeight = this.pdfConfig.getTextoHeight(doc, tituloConsumo);

      const totalCurtoPrazo =
        resultadoAnalitico[0].comprarCurtoPrazo > 0
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
              margins?.sectionMdMarginTop,
            fontSize: 14,
          },
        ]
      )[0]?.marginTop;

      const tituloPrevContratualHeight =
        this.pdfConfig.getTextoHeight(doc, tituloPrevContratual);

      autoTable(doc, {
        head: [
          ["Mês", "hs mês", "Energia cont. (MWh)", `Flex -${relatorioMedicao.takeMinimo}%`, `Flex -${relatorioMedicao.takeMinimo}%`],
        ],
        body: [
          [
            {
              content: relatorioMedicao.mesReferencia
                  ? relatorioMedicao.mesReferencia
                  : mesReferencia,
              styles: {
                halign: "center",
                fontSize: 9,
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
                fontSize: 9,
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
                fontSize: 9,
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
                fontSize: 9,
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
                fontSize: 9,
              },
            },
          ],
        ],
        startY: tituloPrevContratualHeight + tituloPrevContratualMarginTop,
        theme: "plain",
        margin: { left: margins?.marginLeft },
        headStyles: {
          fontSize: 9,
          lineWidth: 1,
          lineColor: "#000000",
          fillColor: "#8eaadb",
          textColor: "#000000",
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          lineWidth: 1,
          lineColor: "#000000",
          fillColor: "#FFFFFF",
          textColor: "#000000",
          fontStyle: "normal",
        },
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

      const prevContratualData = this.pdfConfig.formatarPdfData(
        prevContratualPdfData
      );
      this.pdfConfig.addMultiplosTextos(doc, prevContratualData);

      const { totalFaturamentoLongoPrazo, venderOuComprar } =
        this.faturamentoHelper(resultadoAnalitico);

      autoTable(doc, {
        head: [
          [
            {
              content: "Faturamento (MWh)",
              colSpan: 6,
              styles: {
                halign: "center",
                fontSize: 9,
              },
            },
          ],
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
                fontSize: 9,
              },
            },
          ],
        ],
        body: [...this.faturamentoAutoTablePdfData(totalFaturamentoLongoPrazo)],
        startY:
          prevContratualPdfData?.take[0]?.marginTop + margins?.itemSpacing,
        theme: "plain",
        margin: { left: margins?.marginLeft },
        headStyles: {
          fontSize: 9,
          lineWidth: 1,
          lineColor: "#000000",
          fillColor: "#8eaadb",
          textColor: "#000000",
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          lineWidth: 1,
          lineColor: "#000000",
          fillColor: "#FFFFFF",
          textColor: "#000000",
          fontStyle: "normal",
        },
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
      resultadoAnalitico[0].comprarCurtoPrazo > 0 ? "Comprar" : "Vender";

    const comprarVenderPrazo = (values): string => {
      return resultadoAnalitico[0].comprarCurtoPrazo > 0
        ? this.decimalPipe.transform(values.comprarCurtoPrazo, "1.3-3", "pt")
        : this.decimalPipe.transform(values.venderCurtoPrazo, "1.3-3", "pt");
    };

    const comprarVenderReal = (values): string => {
      return resultadoAnalitico[0].comprarCurtoPrazo > 0
        ? this.decimalPipe.transform(values?.quantidade + values.comprarCurtoPrazo, "1.3-3", "pt")
        : this.decimalPipe.transform(values?.quantidade - values.venderCurtoPrazo, "1.3-3", "pt");
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
        return "-"
        break;
    }
  }
}
