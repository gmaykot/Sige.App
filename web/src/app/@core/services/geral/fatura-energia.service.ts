import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { IFaturaEnergia } from "../../data/fatura.energia";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class FaturaEnergiaService extends DefaultService<IFaturaEnergia> {
  constructor(protected http: HttpService) {
    super(http, "fatura-energia");
  }

  public async obterFaturas(mesReferencia: string, pontoMedicaoId?: string): Promise<IResponseInterface<IFaturaEnergia[]>> {
      return await this.http.get<IResponseInterface<IFaturaEnergia[]>>(`/${this.urlBase}/faturas/${mesReferencia ?? new Date().toISOString().split("T")[0]}/${pontoMedicaoId ?? ''}`);
  }
}