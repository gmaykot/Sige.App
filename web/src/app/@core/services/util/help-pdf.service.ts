import { ETipoEnergia } from "../../enum/tipo-energia";

export class HelperPdfService {
    /* FORMATADORES ---------------------------------------------------------------- */
    static getLocalRodape(cidade = 'Bento Gonçalves'): string {
      const dataFormatada = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    
      return `${cidade}, ${dataFormatada}`;
    }

    static formatadorMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    static formatadorNumero = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });
  
    static formatarTotal(valor: number | undefined): string {
      if (valor === undefined || valor === null || valor === 0) return "-";
  
      if (valor < 0) {
        return `(${this.formatadorMoeda.format(Math.abs(valor))})`;
      }
  
      return this.formatadorMoeda.format(valor);
    }
  
    static formatarValorComUnidade(tipo: number, valor: number): string {
      if (valor === undefined || valor === null || valor === 0) return "-";
  
      const tipos = {
        0: "MWh",
        1: "kW",
        2: "kWh",
        3: "%",
      };
  
      return `${this.formatadorNumero.format(valor)} ${tipos[tipo]}`;
    }
  
    static criarTituloSecao(
      doc: any,
      pdfConfig: any,
      texto: string,
      marginTop: number,
      posicaoTexto?: string
    ) {
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
  
      return pdfConfig.adicionarTextoHorizontal(doc, {
        ...textoPosicao,
        marginTop: marginTop,
        tema: "rotulo",
        propriedadesPersonalizadas: {
          fontSize: 6.5,
        },
      });
    }
  
    /* ESTILOS PADRÃO TABELA ---------------------------------------------------------------- */
    static desenharBordasPersonalizadas = {
      willDrawCell: function (data: any) {
        if (data.cell.styles) {
          data.cell.styles.lineWidth = 0;
        }
        return true;
      },
  
      didDrawCell: function (data: any) {
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
  
    static estilosTabela = {
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
      ...HelperPdfService.desenharBordasPersonalizadas,
    };
  
    static resetEstilosTabela = {
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

    static tipoEnergiaMapper(tipoEnergia: ETipoEnergia): string {
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
  