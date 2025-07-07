
import { Injectable } from "@angular/core";
import { IFaturaEnergia } from "../../../@core/data/fatura.energia";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { IDescontoTusdMensal } from "../../../pages/geral/gerenciamento-mensal/gerenciamento-mensal.interface";

@Injectable({ providedIn: "root" })
export class FaturaEnergiaService extends DefaultService<IFaturaEnergia> {
  constructor(protected http: HttpService) {
    super(http, "fatura-energia");
  }

  public async obterFaturas(mesReferencia: string, pontoMedicaoId?: string): Promise<IResponseInterface<IFaturaEnergia[]>> {
      return await this.http.get<IResponseInterface<IFaturaEnergia[]>>(`/${this.urlBase}/faturas/${mesReferencia ?? new Date().toISOString().split("T")[0]}/${pontoMedicaoId ?? ''}`);
  }

  public async obterFaturaDescontos(mesReferencia: string, pontoMedicaoId?: string): Promise<IResponseInterface<IDescontoTusdMensal>> {
    return await this.http.get<IResponseInterface<IDescontoTusdMensal>>(`/${this.urlBase}/descontos/${mesReferencia ?? new Date().toISOString().split("T")[0]}/${pontoMedicaoId ?? ''}`);
}
}