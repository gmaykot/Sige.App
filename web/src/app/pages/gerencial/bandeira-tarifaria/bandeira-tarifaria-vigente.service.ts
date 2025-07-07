import { Injectable } from "@angular/core";
import { IBandeiraTarifariaVigente } from "../../../@core/data/bandeira-tarifaria-vigente";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";

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