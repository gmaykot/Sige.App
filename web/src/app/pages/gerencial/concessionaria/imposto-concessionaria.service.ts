import { Injectable } from "@angular/core";
import { IImpostoConcessionaria } from "../../../@core/data/imposto-concessionaria";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


@Injectable({ providedIn: "root" })
export class ImpostoConcessionariaService extends DefaultService<IImpostoConcessionaria> {
  constructor(protected http: HttpService) {
    super(http, "imposto-concessionaria");
  }

  public async obterPorConcessionaria(id: string): Promise<IResponseInterface<IImpostoConcessionaria[]>> 
  {
    const ret = await this.http.get<IResponseInterface<IImpostoConcessionaria[]>>(`/imposto-concessionaria/concessionaria/${id}`);
    const formattedReq = this.formatPosGet(ret.data);
    return { ...ret, data: formattedReq };
  }
}