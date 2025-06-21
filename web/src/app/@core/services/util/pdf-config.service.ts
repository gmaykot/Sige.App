import { Injectable } from "@angular/core";
import jsPDF, { TextOptionsLight } from "jspdf";
import autoTable, { Styles, UserOptions } from "jspdf-autotable";

export interface EstiloTextoPdf {
  fontSize: number;
  fontStyle: "normal" | "bold" | "italic" | "bolditalic";
  textColor: string;
  lineSpacing: number;
}

export interface PdfTextoType {
  text: string;
  isBold?: boolean;
  marginTop?: number;
  marginLeft?: number;
  textSpacing?: number;
  customTextSpacing?: number;
  lineWidth?: number;
  align?: TextOptionsLight["align"];
  borderColor?: string;
  fontSize?: number;
  textColor?: string;
}

export interface CustomOptions {
  objAnterior: { [key: string]: PdfTextoType[] };
  proximoObj: { [key: string]: PdfTextoType[] };
  setMargin: string;
  getMargin: string;
  spacing?: number;
}

export interface CustomUserOptions extends Omit<UserOptions, "head" | "body"> {
  colunas?: UserOptions["head"];
  linhas?: UserOptions["body"];
  inicioMarginTop?: number;
}

// Múltiplos de 4
export const margins = {
  marginXsTop: 6,
  marginTop: 16,
  marginLgTop: 60,
  marginLeft: 36,
  headerMarginTop: 8,
  itemSpacing: 20,
  sectionXsMarginTop: 16,
  sectionMarginTop: 20,
  sectionMdMarginTop: 40,
  tableMarginTop: 16,
  right: 595 - 36,
  center: (595 - 36) / 2,
};

@Injectable({ providedIn: "root" })
export class PdfConfigService {
  constructor() {}

  private estiloTextoTemas = {
    padrao: {
      fontSize: 9,
      fontStyle: "normal" as const,
      textColor: "#2E2E2E",
      lineSpacing: 12,
    },
    cabecalho: {
      fontSize: 11,
      fontStyle: "bold" as const,
      textColor: "#2e2e2e",
      lineSpacing: 16,
    },
    subtitulo: {
      fontSize: 10,
      fontStyle: "italic" as const,
      textColor: "#555555",
      lineSpacing: 14,
    },
    rotulo: {
      fontSize: 9,
      fontStyle: "bold" as const,
      textColor: "#2E2E2E",
      lineSpacing: 12,
    },
    valor: {
      fontSize: 9,
      fontStyle: "normal" as const,
      textColor: "#333333",
      lineSpacing: 12,
    },
  };

  public obterEstiloTextoTema(
    nomeTema: string = "padrao",
    propriedadesPersonalizadas: Partial<EstiloTextoPdf> = {}
  ): EstiloTextoPdf {
    const temaBase = this.estiloTextoTemas[nomeTema] || this.estiloTextoTemas.padrao;
    return { ...temaBase, ...propriedadesPersonalizadas };
  }

  public criarTabela(doc: jsPDF, options: CustomUserOptions): void {
    autoTable(doc, {
      head: options.colunas,
      showHead: options.showHead || "firstPage",
      body: options.linhas,
      startY: options.inicioMarginTop,
      theme: options.theme || "plain",
      margin: options.margin || { left: margins?.marginLeft },
      headStyles: {
        fontSize: 8,
        lineWidth: 1.5,
        lineColor: "#F5F5F5",
        fillColor: "#E9E9E9",
        textColor: "#2e2e2e",
        fontStyle: "bold",
        halign: "center",
        ...options.headStyles,
      },
      bodyStyles: {
        fontSize: 8,
        lineWidth: 1.5,
        lineColor: "#F5F5F5",
        fillColor: "#FFFFFF",
        textColor: "#464646",
        fontStyle: "normal",
        halign: "center",
        ...options.bodyStyles,
      },
      didDrawPage: (data) => {
        if (options.didDrawPage) {
          options.didDrawPage(data);
        }
      },
      ...options,
    });
  }

  /**
   * Adiciona textos alinhados horizontalmente (esquerda, centro, direita) em uma mesma linha
   * @param doc Instância do PDF
   * @param opcoes Configurações do texto
   * @returns Posição vertical final após adicionar os textos
   */
  public adicionarTextoHorizontal(
    doc: jsPDF,
    opcoes: {
      textoEsquerda?: string;
      textoCentro?: string;
      textoDireita?: string;
      marginTop?: number;
      tema?: string;
      propriedadesPersonalizadas?: Partial<EstiloTextoPdf>;
    } = {}
  ): number {
    const {
      textoEsquerda,
      textoCentro,
      textoDireita,
      marginTop = margins.marginTop,
      tema = "padrao",
      propriedadesPersonalizadas = {},
    } = opcoes;

    const estilo = this.obterEstiloTextoTema(tema, propriedadesPersonalizadas);
    const { fontSize, fontStyle, textColor, lineSpacing } = estilo;

    const pageWidth = doc.internal.pageSize.getWidth();
    const [font, style] = this.obterFonteEEstilo(fontStyle);

    doc.setFont(font, style);
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor);

    if (textoEsquerda) {
      doc.text(textoEsquerda, margins.marginLeft, marginTop, { align: "left" });
    }

    if (textoCentro) {
      doc.text(textoCentro, pageWidth / 2, marginTop, { align: "center" });
    }

    if (textoDireita) {
      doc.text(textoDireita, pageWidth - margins.marginLeft, marginTop, {
        align: "right",
      });
    }

    return marginTop + lineSpacing;
  }

  /**
   * Adiciona texto em posição específica com controle preciso de coordenadas
   * @param doc Instância do PDF
   * @param opcoes Configurações do texto
   * @returns Objeto com posições finais e dimensões do texto
   */
  public adicionarTextoEmPosicao(
    doc: jsPDF,
    opcoes: {
      texto: string;
      x: number;
      y: number;
      tema?: string;
      propriedadesPersonalizadas?: Partial<EstiloTextoPdf>;
      align?: "left" | "center" | "right";
    }
  ): {
    finalX: number;
    finalY: number;
    width: number;
    height: number;
  } {
    const {
      texto,
      x,
      y,
      tema = "padrao",
      propriedadesPersonalizadas = {},
      align = "left",
    } = opcoes;

    const estilo = this.obterEstiloTextoTema(tema, propriedadesPersonalizadas);
    const { fontSize, fontStyle, textColor, lineSpacing } = estilo;

    const [font, style] = this.obterFonteEEstilo(fontStyle);

    doc.setFont(font, style);
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor);
    doc.text(texto, x, y, { align });

    // Calcular dimensões do texto
    const textDimensions = doc.getTextDimensions(texto);

    // Calcular posição final com base no alinhamento
    let finalX = x;
    if (align === "center") {
      finalX = x + textDimensions.w / 2;
    } else if (align === "right") {
      finalX = x - textDimensions.w;
    } else {
      finalX = x + textDimensions.w;
    }

    // Calcular posição vertical final
    const finalY = y + lineSpacing;

    return {
      finalX,
      finalY,
      width: textDimensions.w,
      height: textDimensions.h,
    };
  }

  /**
   * Adiciona textos com espaçamento entre eles (estilo formulário)
   * @param doc Instância do PDF
   * @param options Opções de configuração
   * @returns Posição vertical final após a adição dos textos
   */
  public adicionarCampoFormulario(
    doc: jsPDF,
    opcoes: {
      rotulo: string;
      valor: string;
      y: number;
      x?: number;
      width?: number;
      desenharLinha?: boolean;
      temaRotulo?: string;
      temaValor?: string;
      propriedadesPersonalizadasRotulo?: Partial<EstiloTextoPdf>;
      propriedadesPersonalizadasValor?: Partial<EstiloTextoPdf>;
      lineColor?: string;
      spacing?: number;
    }
  ): number {
    const {
      rotulo,
      valor,
      y,
      x = margins.marginLeft,
      width = doc.internal.pageSize.getWidth() - 2 * margins.marginLeft,
      desenharLinha = false,
      temaRotulo = "rotulo",
      temaValor = "valor",
      propriedadesPersonalizadasRotulo = {},
      propriedadesPersonalizadasValor = {},
      lineColor = "#464646",
      spacing = 5,
    } = opcoes;

    // Adicionar o rótulo à esquerda usando o tema de rótulo
    const posRotulo = this.adicionarTextoEmPosicao(doc, {
      texto: rotulo,
      x,
      y,
      tema: temaRotulo,
      propriedadesPersonalizadas: propriedadesPersonalizadasRotulo,
    });

    // Adicionar o valor após o rótulo usando o tema de valor
    const posValor = this.adicionarTextoEmPosicao(doc, {
      texto: valor,
      x: posRotulo.finalX + spacing,
      y,
      tema: temaValor,
      propriedadesPersonalizadas: propriedadesPersonalizadasValor,
    });

    // Desenhar linha entre o rótulo e o valor, se solicitado
    if (desenharLinha) {
      const inicioLinha = posRotulo.finalX + 5;
      const fimLinha = x + width - posValor.width - 10;

      doc.setDrawColor(lineColor);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(inicioLinha, y, fimLinha, y);
      doc.setLineDashPattern([], 0); // Resetar o padrão da linha
    }

    return posRotulo.finalY;
  }

  /**
   * Adiciona texto horizontal com dois campos (rótulo/valor) - um à esquerda e outro à direita
   * @param doc Instância do PDF
   * @param opcoes Configurações do cabeçalho
   * @returns Posição vertical final após adicionar o cabeçalho
   */
  public adicionarTextoHorizontalComDoisCampos(
    doc: jsPDF,
    opcoes: {
      rotuloEsquerda: string;
      valorEsquerda: string;
      rotuloDireita: string;
      valorDireita: string;
      y?: number;
      tema?: string;
      propriedadesPersonalizadas?: Partial<EstiloTextoPdf>;
      spacing?: number;
    }
  ): number {
    const {
      rotuloEsquerda,
      valorEsquerda,
      rotuloDireita,
      valorDireita,
      y = margins.marginTop,
      tema = "cabecalho",
      propriedadesPersonalizadas = {},
      spacing = 5,
    } = opcoes;

    const pageWidth = doc.internal.pageSize.getWidth();

    // Campo esquerdo
    const posRotuloEsq = this.adicionarTextoEmPosicao(doc, {
      texto: rotuloEsquerda,
      x: margins.marginLeft,
      y,
      tema,
      propriedadesPersonalizadas,
    });

    this.adicionarTextoEmPosicao(doc, {
      texto: valorEsquerda,
      x: posRotuloEsq.finalX + spacing,
      y,
      tema,
      propriedadesPersonalizadas: {
        ...propriedadesPersonalizadas,
        fontStyle: "normal",
      },
    });

    // Campo direito
    const posRotuloDir = this.adicionarTextoEmPosicao(doc, {
      texto: rotuloDireita,
      x: pageWidth - margins.marginLeft - 150,
      y,
      tema,
      propriedadesPersonalizadas,
    });

    this.adicionarTextoEmPosicao(doc, {
      texto: valorDireita,
      x: posRotuloDir.finalX + spacing,
      y,
      tema,
      propriedadesPersonalizadas: {
        ...propriedadesPersonalizadas,
        fontStyle: "normal",
      },
    });

    // Espaçamento após o cabeçalho
    const estilo = this.obterEstiloTextoTema(tema, propriedadesPersonalizadas);
    return y + estilo.lineSpacing + 3;
  }

  public adicionarTextoMultilinha(
    doc: jsPDF,
    text: string[],
    options: {
      fontSize?: number;
      fontStyle?: "normal" | "bold" | "italic";
      align?: "left" | "center" | "right";
      lineSpacing?: number;
      textColor?: string;
      inicioMarginTop?: number;
      inicioMarginLeft?: number;
    } = {}
  ): number {
    const {
      fontSize = 9,
      fontStyle = "normal",
      align = "left",
      lineSpacing = 12,
      textColor = "#464646",
      inicioMarginTop = margins.marginTop,
      inicioMarginLeft,
    } = options;

    const [font, style] = this.obterFonteEEstilo(fontStyle);

    doc.setFont(font, style);
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor);

    let currentMarginTop = inicioMarginTop;

    text.forEach((line) => {
      if (line) {
        doc.text(line, inicioMarginLeft, currentMarginTop, { align });
        currentMarginTop += lineSpacing;
      }
    });

    return currentMarginTop; // Retorna a posição vertical final
  }

  private obterFonteEEstilo(
    fontStyle: "normal" | "bold" | "italic" | "bolditalic"
  ): [string, string] {
    const styleMap: Record<
      "normal" | "bold" | "italic" | "bolditalic",
      [string, string]
    > = {
      normal: ["helvetica", "normal"],
      bold: ["helvetica", "bold"],
      italic: ["helvetica", "italic"],
      bolditalic: ["helvetica", "bolditalic"],
    };

    return styleMap[fontStyle] || styleMap.normal;
  }

  /* MÉTODOS ANTIGOS - REFATORAR MAIS TARDE E AJUSTAR USO */
  public formatarPdfData(data: {
    [key: string]: PdfTextoType[];
  }): PdfTextoType[] {
    let resultado: PdfTextoType[] = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        resultado = resultado?.concat(data[key]);
      }
    }
    return resultado;
  }

  public addMarginTop(
    obj: { [key: string]: PdfTextoType[] },
    setMargin: string,
    getMargin: string,
    spacing?: number
  ) {
    obj[setMargin][0].marginTop = obj[getMargin][0].marginTop + (spacing ?? 0);
    obj[setMargin][1].marginTop = obj[getMargin][0].marginTop + (spacing ?? 0);
  }

  public addCustomMarginTop(options: CustomOptions) {
    options.proximoObj[options.setMargin][0].marginTop =
      options.objAnterior[options.getMargin][0].marginTop +
      (options.spacing ?? 0);
    options.proximoObj[options.setMargin][1].marginTop =
      options.objAnterior[options.getMargin][0].marginTop +
      (options.spacing ?? 0);
  }

  public addMarginTopUnico(
    obj: { [key: string]: PdfTextoType[] },
    setMargin: string,
    marginTop: number
  ) {
    obj[setMargin][0].marginTop = marginTop;
    obj[setMargin][1].marginTop = marginTop;
  }

  public getTextoHeight(doc: jsPDF, texto: string): number {
    const consumoTextDimensions = doc.getTextDimensions(texto);
    return consumoTextDimensions.h;
  }

  public addImagem(
    doc: jsPDF,
    options: {
      src: string;
      type?: string;
      marginLeft: number;
      marginTop?: number;
      width?: number;
      height?: number;
    }
  ) {
    const image = new Image();
    let type = "png";
    let marginLeft = margins?.marginLeft;
    let marginTop = margins?.marginTop;
    let width = 140;
    let height = 57;

    if (options) {
      type = options?.type ?? type;
      marginLeft = options?.marginLeft ?? marginLeft;
      marginTop = options?.marginTop ?? marginTop;
      width = options?.width ?? width;
      height = options?.height ?? height;
    }

    image.src = options?.src;
    doc.addImage(image, type, marginLeft, marginTop, width, height);
  }

  public addTextoUnico(doc: jsPDF, marginLeft: number, texts: PdfTextoType[]) {
    return texts.map(
      (
        {
          text,
          isBold,
          marginTop,
          textSpacing = 10,
          customTextSpacing = 0,
          lineWidth = 0,
          align = "left",
          borderColor,
          fontSize,
        },
        index
      ) => {
        if (isBold) {
          doc.setFont(undefined, "bold");
        } else {
          doc.setFont(undefined, "normal");
        }

        if (fontSize) {
          doc.setFontSize(fontSize);
        } else {
          doc.setFontSize(11);
        }

        textSpacing = textSpacing ?? 10;

        doc.text(text, marginLeft, marginTop, align && { align });

        const fontSizeDoc = doc.getFontSize();
        const textWidth =
          (doc.getStringUnitWidth(text) * fontSizeDoc) /
          doc.internal.scaleFactor;

        marginLeft += textWidth + textSpacing + customTextSpacing;

        if (lineWidth > 0) {
          doc.setDrawColor(borderColor ? borderColor : "#000000");
          doc.line(marginLeft, marginTop, lineWidth, marginTop);
          marginLeft = lineWidth + textSpacing + customTextSpacing;
        }

        return { marginTop };
      }
    );
  }

  public addMultiplosTextos(doc, texts) {
    let currentMarginTop = 0;

    const groupedTexts = texts.reduce((acc, textItem) => {
      const marginKey = `${textItem.marginTop}-${
        textItem.marginLeft ?? margins?.marginLeft
      }`;
      if (!acc[marginKey]) {
        acc[marginKey] = [];
      }
      acc[marginKey].push(textItem);
      return acc;
    }, {});

    // Iterate through grouped texts by marginTop to add each line with side-by-side texts
    Object.keys(groupedTexts)
      .sort((a, b) => {
        const [marginTopA, marginLeftA] = a.split("-").map(Number);
        const [marginTopB, marginLeftB] = b.split("-").map(Number);
        return marginTopA - marginTopB || marginLeftA - marginLeftB;
      })
      .forEach((marginKey) => {
        const [currentMarginTop, currentMarginLeft] = marginKey
          .split("-")
          .map(Number);
        const lineTexts = groupedTexts[marginKey];
        this.addTextoUnico(doc, currentMarginLeft, lineTexts);
      });
  }
}
