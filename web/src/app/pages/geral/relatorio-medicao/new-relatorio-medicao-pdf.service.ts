import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  margins,
  PdfConfigService,
} from "../../../@core/services/util/pdf-config.service";
import {
  IRelatorioMedicao,
  IValoresMedicao,
  IValoresMedicaoAnalitico,
} from "../../../@core/data/relatorio-medicao";
import { HelperPdfService } from "../../../@core/services/util/help-pdf.service";
import { CapitalizePipe } from "../../../@theme/pipes";

@Injectable({ providedIn: "root" })
export class _RelatorioMedicaoPdfService {
  constructor(private pdfConfig: PdfConfigService, private capitalizePipe: CapitalizePipe) {}

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

    /* LOGO & TITULO CABEÇALHO ---------------------------------------------------------------- */
    this.pdfConfig.addImagem(doc, {
      src: "assets/images/logo.png",
      marginLeft: margins.marginLeft - 10,
      marginTop: margins.marginTop,
      width: 130,
      height: 57,
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: `Relatório de Medição ${relatorioMedicao.mesReferencia ?? ""}`,
      x: margins.marginLeft + 130 + 10,
      y: margins.marginTop + 35,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 17,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Grupo de Empresa",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 80,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: relatorioMedicao.descGrupo?.toUpperCase() ?? "-",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 92,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Fornecedor",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 80 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: relatorioMedicao.descFornecedor?.toUpperCase() ?? "-",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 92 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Contrato",
      x: margins.marginLeft + 10 + 400,
      y: margins.marginTop + 80 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: relatorioMedicao.numContrato ?? "-",
      x: margins.marginLeft + 10 + 400,
      y: margins.marginTop + 92 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Tipo de Energia",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 80 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto:
        HelperPdfService.tipoEnergiaMapper(relatorioMedicao.tipoEnergia) ?? "-",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 92 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Energia Contratada",
      x: margins.marginLeft + 10 + 80,
      y: margins.marginTop + 80 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });
    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto:
        HelperPdfService.formatadorNumero.format(relatorioMedicao?.energiaContratada) ??
        "-",
      x: margins.marginLeft + 10 + 80,
      y: margins.marginTop + 92 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Valor MWh",
      x: margins.marginLeft + 10 + 80 + 80,
      y: margins.marginTop + 80 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto:
        HelperPdfService.formatadorNumero.format(relatorioMedicao?.valorUnitarioKwh) ??
        "-",
      x: margins.marginLeft + 10 + 80 + 80,
      y: margins.marginTop + 92 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Dentro do Take",
      x: margins.marginLeft + 10 + 80 + 80 + 80,
      y: margins.marginTop + 80 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: this.capitalizePipe.transform(valores.dentroTake ? "SIM" : "NÃO") ?? "-",
      x: margins.marginLeft + 10 + 80 + 80 + 80,
      y: margins.marginTop + 92 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
        textColor: valores.dentroTake ? "green" : "red",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Desconto PROINFA",
      x: margins.marginLeft + 10 + 80 + 80 + 80 + 80,
      y: margins.marginTop + 80 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: relatorioMedicao?.proinfa && relatorioMedicao?.proinfa > 0 ? HelperPdfService.formatadorNumero.format(relatorioMedicao?.proinfa) : "-",
      x: margins.marginLeft + 10 + 80 + 80 + 80 + 80,
      y: margins.marginTop + 92 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "ICMS",
      x: margins.marginLeft + 10 + 80 + 80 + 80 + 80 + 100,
      y: margins.marginTop + 80 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: relatorioMedicao?.icms && relatorioMedicao?.icms > 0 ? `${HelperPdfService.formatadorNumero.format(relatorioMedicao?.icms)}%` : "-",
      x: margins.marginLeft + 10 + 80 + 80 + 80 + 80 + 100,
      y: margins.marginTop + 92 + 30 + 30,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Consumo do Mês",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 190,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 12,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Medido",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 190 + 15,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: valores?.valorConsumoTotal && valores?.valorConsumoTotal > 0 ? `${HelperPdfService.formatadorMoeda.format(valores.valorConsumoTotal)}` : "-",
      x: margins.marginLeft + 10,
      y: margins.marginTop + 190 + 12 + 15,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Medido + 3% perdas: (+) 01,625",
      x: margins.marginLeft + 10 + 80,
      y: margins.marginTop + 190 + 15,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: valores?.valorConsumoTotal && valores?.valorPerdas > 0 ? `${HelperPdfService.formatadorMoeda.format(valores.valorPerdas)}` : "-",
      x: margins.marginLeft + 10 + 80,
      y: margins.marginTop + 190 + 12 + 15,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: "Desconto PROINFA no Mês",
      x: margins.marginLeft + 10 + 80 + 170,
      y: margins.marginTop + 190 + 15,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontSize: 8,
        textColor: "gray",
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: valores?.valorConsumoTotal && valores?.valorPerdas > 0 ? `${HelperPdfService.formatadorMoeda.format(valores.valorPerdas)}` : "-",
      x: margins.marginLeft + 10 + 80 + 170,
      y: margins.marginTop + 190 + 12 + 15,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "bold",
        fontSize: 10,
      },
    });

    this.pdfConfig.adicionarTextoEmPosicao(doc, {
      texto: HelperPdfService.getLocalRodape(),
      x: doc.internal.pageSize.getWidth() - 200,
      y: 820,
      tema: "cabecalho",
      propriedadesPersonalizadas: {
        fontStyle: "normal",
        fontSize: 8,
      },
    });
    return doc;
  }
}
