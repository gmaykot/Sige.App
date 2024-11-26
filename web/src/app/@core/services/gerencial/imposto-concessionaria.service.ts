import { Injectable } from "@angular/core";
import { IImpostoConcessionaria } from "../../data/imposto-concessionaria";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class ImpostoConcessionariaService extends DefaultService<IImpostoConcessionaria> {
  constructor(protected http: HttpService) {
    super(http, "imposto-concessionaria");
  }

  public async obterPorConcessionaria(id: string): Promise<IResponseInterface<IImpostoConcessionaria[]>> 
  {
    const ret = await this.http.get<IResponseInterface<IImpostoConcessionaria[]>>(`/imposto-concessionaria/concessionaria/${id}`);
    const formattedReq = this.transformMesReferencia(ret.data);
    return { ...ret, data: formattedReq };
  }
}