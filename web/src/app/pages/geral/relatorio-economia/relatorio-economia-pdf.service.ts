import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  CustomUserOptions,
  margins,
  PdfConfigService,
} from "../../../@core/services/util/pdf-config.service";
import { RelatorioEconomiaResponse } from "./relatorio-economiacomponent";

@Injectable({ providedIn: "root" })
export class RelatorioEconomiaPdfService {
  constructor(private pdfConfig: PdfConfigService) {}

  public blobPDF(): any {
    const pdf = this.createPDF();
    return pdf.output("blob");
  }

  public downloadPDF(response?: RelatorioEconomiaResponse): void {
    const pdf = this.createPDF(response);
    pdf.save(`relatorio_economia.pdf`);
  }

  private createPDF(response?: RelatorioEconomiaResponse): jsPDF {
    const { data } = response;
    const { cabecalho, grupos } = data;

    // TAMANHO A4 EM PT: 595.35 x 841.995
    const doc = new jsPDF("p", "pt", "a4");

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
    let dadosTabela: any[] = [];

    grupos.forEach((grupo) => {
      dadosTabela.push({
        titulo: grupo.titulo,
        colunas: [
          { content: "", styles: { cellWidth: 180 } },
          { content: grupo.colunaQuantidade, styles: { cellWidth: 90 } },
          grupo.colunaValor,
          grupo.colunaTotal,
        ],
        linhas: grupo.subGrupos[0].lancamentos.map((subGrupo) => {
          return [
            {
              content: subGrupo.descricao,
              styles: { halign: "left" },
            },
            { content: subGrupo.observacao || subGrupo.montante || "-" },
            { content: subGrupo.tarifa || "-" },
            { content: subGrupo.total || "-" },
          ];
        }),
      });
    });

    const secaoMercadoCativoMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      [dadosTabela[0].titulo],
      {
        fontStyle: "bold",
        textColor: "#6C6C6C",
        inicioMarginTop: dadosEmpresaTabela2Height + margins.sectionMarginTop,
        inicioMarginLeft: margins.marginLeft,
      }
    );

    /* DADOS TABELA */
    const dadosMercadoCativoTabela: CustomUserOptions = {
      colunas: [dadosTabela[0].colunas],
      linhas: dadosTabela[0].linhas,
      inicioMarginTop: secaoMercadoCativoMarginTop,
    };
    console.log(dadosTabela)

    this.pdfConfig.criarTabela(doc, dadosMercadoCativoTabela);
    const dadosMercadoCativoTabelaHeight = (doc as any)?.lastAutoTable?.finalY;

    /* SEÇÃO MERCADO LIVRE -------------------------------------------------------------------------- */
    const secaoMercadoLivreMarginTop = this.pdfConfig.adicionarTextoMultilinha(
      doc,
      [dadosTabela[1].titulo],
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
      colunas: [dadosTabela[1].colunas],
      linhas: dadosTabela[1].linhas,
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
