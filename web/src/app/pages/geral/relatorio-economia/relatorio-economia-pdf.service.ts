import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  CustomUserOptions,
  margins,
  PdfConfigService,
} from "../../../@core/services/util/pdf-config.service";
import { IRelatorioEconomia } from "../../../@core/data/relatorio-economia";

@Injectable({ providedIn: "root" })
export class RelatorioEconomiaPdfService {
  constructor(private pdfConfig: PdfConfigService) {}

  public blobPDF(): any {
    const pdf = this.createPDF();
    return pdf.output("blob");
  }

  public downloadPDF(response: IRelatorioEconomia) {
    const pdf = this.createPDF(response);
    pdf.save(`relatorio_economia.pdf`);
  }

  private createPDF(response?: IRelatorioEconomia): jsPDF {
    // TAMANHO A4 EM PT: 595.35 x 841.995
    const doc = new jsPDF("p", "pt", "a4");

    const cabecalho = response.data.cabecalho;
    const grupos = response.data.grupos;

    /* CABECAlHO COM IMAGEM E TITULO ---------------------------------------------------------------- */
    this.pdfConfig.addImagem(doc, {
      src: "assets/images/logo.png",
      marginLeft: margins.marginLeft,
    });

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
            content: cabecalho.unidade,
          },
          {
            content: cabecalho.subMercado,
          },
          {
            content: cabecalho.conexao,
          },
          {
            content: cabecalho.concessao,
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
    const mercadoCativo = grupos[0];
    const mercadoCativoLinhas = mercadoCativo.subGrupos[0].lancamentos.map(
      (lanc) => {
        return [
          { content: lanc.descricao },
          { content: lanc.montante ? lanc.montante.toString() : "-" },
          { content: lanc.tarifa ? lanc.tarifa.toString() : "-" },
          { content: lanc.total ? lanc.total.toString() : "-" },
        ];
      }
    );

    const secaoMercadoCativoMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      [mercadoCativo.titulo],
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
          {
            content: mercadoCativo.colunaQuantidade,
            styles: { cellWidth: 90 },
          },
          mercadoCativo.colunaValor,
          mercadoCativo.colunaTotal,
        ],
      ],
      linhas: [
        ...mercadoCativoLinhas,
        [
          {
            content: mercadoCativo.subGrupos[0].total.descricao
              ? mercadoCativo.subGrupos[0].total.descricao
              : "-",
          },
          {
            content: mercadoCativo.subGrupos[0].total.montante
              ? mercadoCativo.subGrupos[0].total.montante
              : "-",
          },
          {
            content: mercadoCativo.subGrupos[0].total.tarifa
              ? mercadoCativo.subGrupos[0].total.tarifa
              : "-",
          },
          {
            content: mercadoCativo.subGrupos[0].total.total
              ? mercadoCativo.subGrupos[0].total.total
              : "-",
          },
        ],
      ],
      inicioMarginTop: secaoMercadoCativoMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosMercadoCativoTabela);
    const dadosMercadoCativoTabelaHeight = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO MERCADO LIVRE -------------------------------------------------------------------------- */
    const mercadoLivre = grupos[1];
    const mercadoLivreLinhas = mercadoLivre.subGrupos[0].lancamentos.map(
      (lanc) => {
        return [
          { content: lanc.descricao },
          { content: lanc.montante ? lanc.montante.toString() : "-" },
          { content: lanc.tarifa ? lanc.tarifa.toString() : "-" },
          { content: lanc.total ? lanc.total.toString() : "-" },
        ];
      }
    );

    const secaoMercadoLivreMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      [mercadoLivre.titulo],
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
          { content: mercadoLivre.colunaQuantidade, styles: { cellWidth: 90 } },
          mercadoLivre.colunaValor,
          mercadoLivre.colunaTotal,
        ],
      ],
      linhas: mercadoLivreLinhas,
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
