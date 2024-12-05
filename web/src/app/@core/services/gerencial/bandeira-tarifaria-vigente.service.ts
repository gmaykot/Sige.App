import { Injectable } from "@angular/core";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";
import { IBandeiraTarifariaVigente } from "../../data/bandeira-tarifaria-vigente";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class BandeiraTarifariaVigenteService extends DefaultService<IBandeiraTarifariaVigente> {
  constructor(protected http: HttpService) {
    super(http, "bandeira-tarifaria-vigente");
  }

  public async obterPorBandeira(idBandeira: string): Promise<IResponseInterface<IBandeiraTarifariaVigente[]>> 
  {
    const ret = await this.http.get<IResponseInterface<IBandeiraTarifariaVigente[]>>(`/${this.urlBase}/bandeira/${idBandeira}`);
    const formattedReq = this.formatPosGet(ret?.data);
    return { ...ret, data: formattedReq };
  }
}