import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { IPontoMedicao } from "../../data/ponto-medicao";
import { HttpService } from "../util/http.service";
import { IDropDown } from "../../data/drop-down";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class PontoMedicaoService extends DefaultService<IPontoMedicao> {
  constructor(protected http: HttpService) {
    super(http, "ponto-medicao");
  }

  public async getDropDownPorEmpresa(empresaId: string): Promise<IResponseInterface<IDropDown[]>> {
    return await this.http.get<IResponseInterface<IDropDown[]>>(
      `/${this.urlBase}/drop-down/empresa/${empresaId}`
    );
  }
}
