import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { IDropDown } from "../../data/drop-down";

@Injectable({ providedIn: "root" })
export class DateService {
  constructor(private datePipe: DatePipe) {}

  ptBrStringToUsString(ptBrString: string, format?: string): string {
    if (!ptBrString)
      return '';
    if (ptBrString.indexOf('/') == -1 && ptBrString.indexOf('-') != -1)
      return this.ptBrStringToUsString(ptBrString, format)

    const [dia, mes, ano] = ptBrString.split("/");
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
    return this.datePipe.transform(data, format ? format : "yyyy/MM/dd");
  }

  usStringToPtBrString(usString: string, format?: string): string {
    if (!usString)
      return '';
    if (usString.indexOf('/') != -1 && usString.indexOf('-') == -1)
      return this.ptBrStringToUsString(usString, format)

    var removeHora = usString.split("T")[0];
    const [ano, mes, dia] = removeHora.split("-");
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
    return this.datePipe.transform(data, format ? format : "dd/MM/yyyy");
  }

  getMesesReferencia(qtdeMeses: number): Array<IDropDown>
  {
    var meses: Array<IDropDown> = []
    var dataInicial = new Date();
    dataInicial.setUTCMonth(dataInicial.getUTCMonth() + 1);
    for (var i = 0; i < qtdeMeses; i++) {
      dataInicial.setUTCMonth(dataInicial.getUTCMonth() - 1);
      meses.push({
        id: this.datePipe.transform(dataInicial, "yyyy-MM-01"),
        descricao: this.datePipe.transform(dataInicial, "MM/yyyy"),
      });
    }

    return meses;
  }
}
