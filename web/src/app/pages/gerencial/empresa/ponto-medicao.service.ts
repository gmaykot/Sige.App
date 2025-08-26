import { Injectable } from "@angular/core";
import { IDropDown } from "../../../@core/data/drop-down";
import { IPontoMedicao } from "../../../@core/data/ponto-medicao";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


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

  public async getDropDownComSegmento(): Promise<IResponseInterface<IDropDown[]>> {
    return await this.http.get<IResponseInterface<IDropDown[]>>(
      `/${this.urlBase}/drop-down/segmento`
    );
  }
}
