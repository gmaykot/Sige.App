import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

import {
  CustomUserOptions,
  margins,
  PdfConfigService,
} from "../../../@core/services/util/pdf-config.service";
import { IRelatorioFinal } from "../../../@core/data/geral/relatorio-economia/relatorio-final";

@Injectable({ providedIn: "root" })
export class RelatorioEconomiaPdfService {
  constructor(private pdfConfig: PdfConfigService) {}

  public blobPDF(): any {
    const pdf = this.createPDF(this.mock());
    return pdf.output("blob");
  }
  public downloadPDF(relatorio: IRelatorioFinal) {
    console.log(relatorio);
    const pdf = this.createPDF(relatorio);
    pdf.save(`relatorio_economia_${relatorio.cabecalho.unidade.replace(" ", "_").toLocaleLowerCase()}.pdf`);
  }

  private createPDF(relatorio: IRelatorioFinal): jsPDF {
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
        relatorio.cabecalho.titulo,
        relatorio.cabecalho.subTitulo,
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
            content: relatorio.cabecalho.unidade,
          },
          {
            content: relatorio.cabecalho.subMercado,
          },
          {
            content: relatorio.cabecalho.conexao,
          },
          {
            content: relatorio.cabecalho.concessao,
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
            content: relatorio.cabecalho.cnpj,
          },
          {
            content: relatorio.cabecalho.inscricaoEstadual,
          },
          {
            content: relatorio.cabecalho.endereco,
          },
          {
            content: relatorio.cabecalho.municipio,
          },
          {
            content: relatorio.cabecalho.uf,
          },
        ],
      ],
      inicioMarginTop: dadosEmpresaTabela1Height + margins.headerMarginTop,
    };

    this.pdfConfig.criarTabela(doc, dadosEmpresaTabela2);
    var inicioMarginTop = (doc as any)?.lastAutoTable?.finalY;

    for(const grupo of relatorio.grupos.sort((a, b) => a.ordem - b.ordem)) {
      const secaoMercadoCativoMarginTop = this.pdfConfig.adicionarTextoMultilinha(
        doc,
        [grupo.titulo],
        {
          fontStyle: "bold",
          textColor: "#6C6C6C",
          inicioMarginTop: inicioMarginTop + margins.sectionMarginTop,
          inicioMarginLeft: margins.marginLeft,
        }
      );

      /* DADOS TABELA */
      const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const formatadorNumero = new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      const linhas: any[] = grupo?.subGrupos?.flatMap(subGrupo => {
        const linhasSubGrupo: any[] = [];
      
        for (const lancamento of subGrupo?.lancamentos) {
          const valorFormatado = formatadorMoeda.format(lancamento.total ?? 0);
      
          if (!lancamento.observacao) {
            if (lancamento.totalizador) {
              linhasSubGrupo.push([
                { content: lancamento.descricao, styles: { halign: 'left', fontStyle: 'bold', fillColor: '#F2F2F2' }, colSpan: 3 },
                { content: valorFormatado, styles: { fontStyle: 'bold', fillColor: '#F2F2F2' } }
              ]);
            } else if (lancamento.subTotalizador) {
              linhasSubGrupo.push([
                {
                  content: lancamento.descricao,
                  styles: {
                    halign: 'left',
                    fontStyle: lancamento.descricao.startsWith('Subvenção') ? 'italic' : 'normal'
                  },
                  colSpan: 3
                },
                { content: valorFormatado }
              ]);
            } else {
              linhasSubGrupo.push([
                { content: lancamento.descricao, styles: { halign: 'left' } },
                formatadorNumero.format(lancamento.montante ?? 0),
                formatadorNumero.format(lancamento.tarifa ?? 0),
                valorFormatado
              ]);
            }
          } else {
            linhasSubGrupo.push([
              { content: lancamento.descricao, styles: { halign: 'left' } },
              '',
              { content: lancamento.observacao, colSpan: 2 }
            ]);
          }
        }
      
        if (subGrupo.total) {
          const totalFormatado = formatadorMoeda.format(subGrupo.total.total ?? 0);
          linhasSubGrupo.push([
            { content: subGrupo.total.descricao, styles: { halign: 'left', fontStyle: 'bold' } },
            { content: formatadorNumero.format(subGrupo.total.montante ?? 0), styles: { fontStyle: 'bold' } },
            { content: formatadorNumero.format(subGrupo.total.tarifa ?? 0), styles: { fontStyle: 'bold' } },
            { content: totalFormatado, styles: { fontStyle: 'bold' } },
          ]);
        }
      
        return linhasSubGrupo;
      });
      

      const dadosTabela: CustomUserOptions = {
        colunas: [
          [
            { content: "", styles: { cellWidth: 180 } },
            { content: grupo.colunaQuantidade, styles: { cellWidth: 90 } },
            { content: grupo.colunaValor },
            { content: grupo.colunaTotal },
          ],
        ],
        linhas: linhas,
        inicioMarginTop: secaoMercadoCativoMarginTop,
      }

      this.pdfConfig.criarTabela(doc, dadosTabela);
      inicioMarginTop = (doc as any)?.lastAutoTable?.finalY;
    }

    return doc;
  }

  // função de verificação
  public linhaValida(linha: any[]): boolean {
    const item = linha[1];
    const valor = typeof item === "string" ? item : item?.content;
    return valor !== "-" && valor !== "" && valor !== null;
  }

  public mock(): IRelatorioFinal {
    const relatorioFinal: IRelatorioFinal = {
      cabecalho: {
        titulo: '',
        subTitulo: '',
        unidade: '',
        subMercado: '',
        conexao: '',
        concessao: '',
        cnpj: '',
        inscricaoEstadual: '',
        endereco: '',
        municipio: '',
        uf: '',
        dataAnalise: new Date().toISOString(),
        mesReferencia: '',
        numerorDiasMes: 0,
        periodoHoroSazonal: ''
      },
      grupos: [],
      comparativo: {
        // preencher os campos conforme a interface correspondente
      },
      grafico: {
        // preencher os campos conforme a interface correspondente
      }
    };

    return relatorioFinal;
  }
}
