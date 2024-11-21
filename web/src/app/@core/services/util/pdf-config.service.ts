import { Injectable } from "@angular/core";
import jsPDF, { TextOptionsLight } from "jspdf";

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
}

export interface CustomOptions {
  objAnterior: { [key: string]: PdfTextoType[] };
  proximoObj: { [key: string]: PdfTextoType[] };
  setMargin: string;
  getMargin: string;
  spacing?: number;
}

// Múltiplos de 4
export const margins = {
  marginTop: 16,
  marginLgTop: 60,
  marginLeft: 36,
  headerMarginTop: 8,
  itemSpacing: 20,
  sectionXsMarginTop: 16,
  sectionMarginTop: 36,
  sectionMdMarginTop: 40,
  tableMarginTop: 16,
  right: 595 - 36,
  center: (595 - 36) / 2,
};

@Injectable({ providedIn: "root" })
export class PdfConfigService {
  constructor() {}

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
    doc: jsPDF, options: {
    src: string;
    type?: string;
    marginLeft: number;
    marginTop?: number;
    width?: number;
    height?: number;
  }) {
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
