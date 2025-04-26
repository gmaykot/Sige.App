import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  CustomUserOptions,
  margins,
  PdfConfigService,
} from "../../../@core/services/util/pdf-config.service";

@Injectable({ providedIn: "root" })
export class RelatorioEconomiaPdfService {
  constructor(private pdfConfig: PdfConfigService) {}

  public blobPDF(): any {
    const pdf = this.createPDF();
    return pdf.output("blob");
  }

  public downloadPDF() {
    const pdf = this.createPDF();
    pdf.save(`relatorio_economia.pdf`);
  }

  private createPDF(): jsPDF {
    // TAMANHO A4 EM PT: 595.35 x 841.995
    const doc = new jsPDF("p", "pt", "a4");

    /* CABECAlHO COM IMAGEM E TITULO ---------------------------------------------------------------- */
    this.pdfConfig.addImagem(doc, {
      src: "assets/images/logo.png",
      marginLeft: margins.marginLeft,
    });

    const cabecalhoMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      [
        "QUADRO COMPARATIVO MENSAL MERCADO CATIVO X LIVRE",
        "ROTA INDÚSTRIA GRÁFICA LTDA",
      ],
      {
        fontStyle: "bold",
        align: "right",
        textColor: "#666666",
        inicioMarginTop: margins.sectionMarginTop,
        inicioMarginLeft: margins.right,
      }
    );

    /* SEÇÃO DADOS EMPRESA ---------------------------------------------------------------------------- */
    const secaoEmpresaMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      ["DADOS EMPRESA"],
      {
        fontStyle: "bold",
        textColor: "#6C6C6C",
        inicioMarginTop: cabecalhoMarginTop + margins.sectionMarginTop,
        inicioMarginLeft: margins.marginLeft,
      }
    );

    /* DADOS TABELA 1 */
    const dadosEmpresaTabela1: CustomUserOptions = {
      colunas: [["Unidade", "Submercado", "Conexão", "Concessão"]],
      linhas: [
        [
          {
            content: "Estrela",
          },
          {
            content: "Sul",
          },
          {
            content: "A4",
          },
          {
            content: "RGE Sull",
          },
        ],
      ],
      inicioMarginTop: secaoEmpresaMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela1);
    const dadosEmpresaTabela1Height = (doc as any)?.lastAutoTable?.finalY;

    /* DADOS TABELA 2 */
    const dadosEmpresaTabela2: CustomUserOptions = {
      colunas: [["CNPJ", "Inscrição Estadual", "Endereço", "Município", "UF"]],
      linhas: [
        [
          {
            content: "00.000.000/0001-00",
          },
          {
            content: "1234567890",
          },
          {
            content: "Rua das Flores, 123",
          },
          {
            content: "São Paulo",
          },
          {
            content: "SP",
          },
        ],
      ],
      inicioMarginTop: dadosEmpresaTabela1Height + margins.headerMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela2);
    const dadosEmpresaTabela2Height = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO MERCADO CATIVO -------------------------------------------------------------------------- */
    const secaoMercadoCativoMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      ["MERCADO CATIVO - A4 - TOTAL"],
      {
        fontStyle: "bold",
        textColor: "#6C6C6C",
        inicioMarginTop: dadosEmpresaTabela2Height + margins.sectionMarginTop,
        inicioMarginLeft: margins.marginLeft,
      }
    );

    /* DADOS TABELA */
    const dadosMercadoCativoTabela: CustomUserOptions = {
      colunas: [
        [
          { content: "", styles: { cellWidth: 180 } },
          { content: "Montante", styles: { cellWidth: 90 } },
          "Tarifa",
          "Total",
        ],
      ],
      linhas: [
        [
          { content: "Demanda Contratada - Ponta", styles: { halign: "left" } },
          { content: "-" },
          {
            content:
              "Tarifa Fornecimento - Resolução ANEEL nº 3.206, 13/06/2023",
            colSpan: 2,
          },
        ],
        [
          {
            content: "Demanda Contratada - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "500,000 kW" },
          { content: "40 R$/kW" },
          { content: "-" },
        ],
        [
          { content: "Demanda Faturada - Ponta", styles: { halign: "left" } },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          {
            content: "Demanda Faturada - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "484,000 kW" },
          { content: "32,70933401 R$/kW" },
          { content: "R$ 15.831,32" },
        ],
        [
          {
            content: "Demanda Faturada - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "16,000 kW" },
          { content: "27,14874722 R$/kW" },
          { content: "R$ 434,38" },
        ],
        [
          {
            content: "Demanda Ultrapassagem - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "65,41866801 R$/kW" },
          { content: "-" },
        ],
        [
          { content: "Demanda Reativa - Ponta", styles: { halign: "left" } },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          {
            content: "Demanda Reativa - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          {
            content: "Consumo Medido - Ponta - TUSD",
            styles: { halign: "left" },
          },
          { content: "9.476,000 kWh" },
          { content: "2,04303417 R$/kWh" },
          { content: "R$ 19.359,79" },
        ],
        [
          {
            content: "Consumo Medido - Fora de Ponta - TUSD",
            styles: { halign: "left" },
          },
          { content: "75.316,000 kWh" },
          { content: "0,11999791 R$/kWh" },
          { content: "R$ 9.037,76" },
        ],
        [
          {
            content: "Consumo Medido - Ponta - TE",
            styles: { halign: "left" },
          },
          { content: "9.476,000 kWh" },
          { content: "0,49644406 R$/kWh" },
          { content: "R$ 4.704,30" },
        ],
        [
          {
            content: "Consumo Medido - Fora de Ponta - TE",
            styles: { halign: "left" },
          },
          { content: "75.316,000 kWh" },
          { content: "0,31480680 R$/kWh" },
          { content: "R$ 23.709,99" },
        ],
        [
          {
            content: "Adicional Bandeira Verde Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          {
            content: "Adicional Bandeira Verde F. Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          {
            content: "Consumo Medido Reativo - Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "0,36667518 R$/kWh" },
          { content: "-" },
        ],
        [
          {
            content: "Consumo Medido Reativo - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "60,228 kWh" },
          { content: "0,36992761 R$/kWh" },
          { content: "R$ 22,28" },
        ],
        [
          {
            content: "Total geral mercado cativo (impostos inclusos)",
            styles: { halign: "left", fontStyle: "bold" },
          },
          { content: "84.792 kWh", styles: { fontStyle: "bold" } },
          { content: "0,8621 R$/kWh", styles: { fontStyle: "bold" } },
          { content: "R$ 73.099,83", styles: { fontStyle: "bold" } },
        ],
      ],
      inicioMarginTop: secaoMercadoCativoMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosMercadoCativoTabela);
    const dadosMercadoCativoTabelaHeight = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO MERCADO LIVRE -------------------------------------------------------------------------- */
    const secaoMercadoLivreMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      ["MERCADO LIVRE - A4"],
      {
        fontStyle: "bold",
        textColor: "#6C6C6C",
        inicioMarginTop:
          dadosMercadoCativoTabelaHeight + margins.sectionMarginTop,
        inicioMarginLeft: margins.marginLeft,
      }
    );

    /* DADOS TABELA */
    const dadosMercadoLivreTabela: CustomUserOptions = {
      colunas: [
        [
          { content: "", styles: { cellWidth: 180 } },
          { content: "Montante", styles: { cellWidth: 90 } },
          "Tarifa",
          "Total",
        ],
      ],
      linhas: [
        [
          { content: "Perdas Reais", styles: { halign: "left" } },
          { content: "3,000 %" },
          { content: "" },
          { content: "" },
        ],
        [
          {
            content: "Consumo de Energia Considerando Perdas e PROINFA",
            styles: { halign: "left" },
          },
          { content: "87,346 MWh" },
          { content: "" },
          { content: "" },
        ],
        [
          { content: "PROINFA", styles: { halign: "left" } },
          { content: "1,998 MWh" },
          { content: "" },
          { content: "" },
        ],
        [
          {
            content: "Consumo de Energia - Longo Prazo",
            styles: { halign: "left" },
          },
          { content: "80,287 MWh" },
          { content: "282,94 R$/MWh" },
          { content: "R$ 27.369,16" },
        ],
        [
          {
            content: "Consumo de Energia - Curto Prazo",
            styles: { halign: "left" },
          },
          { content: "5,061 MWh" },
          { content: "132,59 R$/MWh" },
          { content: "R$ 808,48" },
        ],
        [
          {
            content: "Sub-total de compra de energia elétrica",
            colSpan: 3,
            styles: { halign: "left", fontStyle: "bold", fillColor: "#F2F2F2" },
          },
          {
            content: "R$ 28.177,64",
            styles: { fontStyle: "bold", fillColor: "#F2F2F2" },
          },
        ],
        [
          {
            content: "TUSD-Verde = 50,00% TUSD - Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          { content: "TUSD - Fora de Ponta", styles: { halign: "left" } },
          { content: "484,000 kW" },
          { content: "16,42147803 R$/kW" },
          { content: "R$ 7.948,00" },
        ],
        [
          { content: "TUSD - Fora de Ponta", styles: { halign: "left" } },
          { content: "16,000 kW" },
          { content: "13,62867111 R$/kW" },
          { content: "R$ 218,07" },
        ],
        [
          {
            content: "TUSD Ultrapassagem- Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          { content: "Demanda Reativa - Ponta", styles: { halign: "left" } },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          {
            content: "Demanda Reativa - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "-" },
          { content: "-" },
          { content: "-" },
        ],
        [
          { content: "TUSD Encargos - Ponta", styles: { halign: "left" } },
          { content: "9.476,000 kWh" },
          { content: "1,08544402 R$/kWh" },
          { content: "R$ 10.285,67" },
        ],
        [
          {
            content: "TUSD Encargos - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "75.316,000 kWh" },
          { content: "0,11999791 R$/kWh" },
          { content: "R$ 9.037,76" },
        ],
        [
          { content: "Consumo Reativo - Ponta", styles: { halign: "left" } },
          { content: "-" },
          { content: "0,36667518 R$/kWh" },
          { content: "-" },
        ],
        [
          {
            content: "Consumo Reativo - Fora de Ponta",
            styles: { halign: "left" },
          },
          { content: "60,228" },
          { content: "0,36992761 R$/kWh" },
          { content: "R$ 22,28" },
        ],
        [
          {
            content: "Subvenção Tarifária - TUSD - Com ICMS DEZ/23",
            styles: { halign: "left", fontStyle: "italic" },
            colSpan: 3,
          },
          { content: "R$ 16.957,42" },
        ],
        [
          {
            content: "Subvenção Tarifária - TUSD - Sem ICMS DEZ/23",
            styles: { halign: "left", fontStyle: "italic" },
            colSpan: 3,
          },
          { content: "R$ 216,31" },
        ],
        [
          {
            content: "Sub-total para base de cálculo imposto ICMS/PIS/COFINS",
            colSpan: 3,
            styles: { halign: "left", fontStyle: "bold", fillColor: "#F2F2F2" },
          },
          { content: "R$ 44.685,51", styles: { fillColor: "#F2F2F2" } },
        ],
        [
          {
            content: "Ajustes da TUSD",
            styles: { halign: "left" },
            colSpan: 3,
          },
          { content: "R$ 36,85" },
        ],
        [
          {
            content: "Credito Subv. Tarifa ACL Tusd",
            styles: { halign: "left" },
            colSpan: 3,
          },
          { content: "R$ (13.517,83)" },
        ],
        [
          {
            content: "Total distribuidora",
            colSpan: 3,
            styles: { halign: "left", fontStyle: "bold", fillColor: "#F2F2F2" },
          },
          {
            content: "R$ 31.204,53",
            styles: {
              halign: "center",
              fontStyle: "bold",
              fillColor: "#F2F2F2",
            },
          },
        ],
        [{ content: "Ressarcimento", styles: { halign: "left" }, colSpan: 4 }],
        [{ content: "Multa", styles: { halign: "left" }, colSpan: 4 }],
        [{ content: "Juros", styles: { halign: "left" }, colSpan: 3 }],
        [
          {
            content: "Contribuição Iluminação Pública",
            styles: { halign: "left" },
            colSpan: 3,
          },
          { content: "R$ 69,26" },
        ],
        [
          {
            content: "Sub-total de valores referente a Distribuidora",
            colSpan: 3,
            styles: { halign: "left", fontStyle: "bold", fillColor: "#F2F2F2" },
          },
          {
            content: "R$ 31.273,79",
            styles: { fontStyle: "bold", fillColor: "#F2F2F2" },
          },
        ],
        [
          {
            content: "Serviço Depositário Qualificado - Bradesco Ref.: 12/23",
            styles: { halign: "left" },
            colSpan: 3,
          },
          { content: "R$ 42,24" },
        ],
        [
          {
            content: "EER - Energia de Reserva - 11/23",
            styles: { halign: "left" },
            colSpan: 3,
          },
          { content: "R$ 1.741,31" },
        ],
        [
          {
            content:
              "Contribuição Associativa mensal CCEE - 12/23- Vcto. 29.12.23",
            styles: { halign: "left" },
            colSpan: 3,
          },
          { content: "R$ 63,13" },
        ],
        [
          {
            content:
              "Liq. Fin. CCEE - DEVEDOR/CREDOR (ref. 10/23) Vcto.: 11.12.23",
            styles: { halign: "left" },
            colSpan: 3,
          },
          { content: "R$ 174,27" },
        ],
        [
          {
            content: "Sub-total dos outros custos mercado livre",
            colSpan: 3,
            styles: { halign: "left", fontStyle: "bold", fillColor: "#F2F2F2" },
          },
          { content: "R$ 2.020,95", styles: { fillColor: "#F2F2F2" } },
        ],
        [
          {
            content: "Total geral no mercado livre",
            colSpan: 2,
            styles: { halign: "left", fontStyle: "bold" },
          },
          { content: "0,7242 R$/kWh", styles: { fontStyle: "bold" } },
          { content: "R$ 61.403,12", styles: { fontStyle: "bold" } },
        ],
      ],
      inicioMarginTop: secaoMercadoLivreMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosMercadoLivreTabela);
    const dadosMercadoLivreTabelaHeight = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO COMPARATIVO CATIVO X LIVRE --------------------------------------------------------------- */
    const secaoComparativoMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      ["COMPARAÇÃO MERCADO CATIVO X LIVRE"],
      {
        fontStyle: "bold",
        textColor: "#6C6C6C",
        inicioMarginTop:
          dadosMercadoLivreTabelaHeight + margins.sectionMarginTop,
        inicioMarginLeft: margins.marginLeft,
      }
    );

    /* DADOS TABELA */
    const dadosComparativoTabela: CustomUserOptions = {
      linhas: [
        [
          {
            content: "Diferença cativo versus livre",
            styles: { halign: "left" },
          },
          { content: "Economia = 16,00 %" },
          { content: "R$ 11.696,70" },
        ],
        [
          {
            content: "Valor devido a Coenel-DE",
            styles: { halign: "left" },
          },
          { content: "2 Sal. Mín. + 10% economia" },
          { content: "Venc.: 16/01/2024 10% " },
          { content: "R$ 11.696,70" },
        ],
        [
          {
            content: "Economia mensal líquida",
            styles: { halign: "left", fontStyle: "bold", fillColor: "#F2F2F2" },
          },
          {
            content: "10,79 %",
            styles: { fontStyle: "bold", fillColor: "#F2F2F2" },
          },
          {
            content: "R$ 7.887,03",
            styles: { fontStyle: "bold", fillColor: "#F2F2F2" },
          },
        ],
        [
          {
            content: "Economia acumulada",
            styles: { halign: "left", fontStyle: "bold", fillColor: "#F2F2F2" },
            colSpan: 2,
          },
          {
            content: "R$ 1.262.582,18",
            styles: { fontStyle: "bold", fillColor: "#F2F2F2" },
          },
        ],
      ],
      inicioMarginTop: secaoComparativoMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosComparativoTabela);
    const dadosComparativoTabelaHeight = (doc as any)?.lastAutoTable?.finalY;

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
      inicioMarginTop: dadosComparativoTabelaHeight + margins.sectionMarginTop,
    });

    return doc;
  }
}
