import { Injectable } from "@angular/core";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";
import { DefaultServiceUtil } from "../util/default-service-util";
import { IBandeiraTarifariaVigente } from "../../data/bandeira-tarifaria-vigente";
import { IPisCofinsMensal, IProinfaIcmsMensal } from "../../data/gerenciamento-mensal";

@Injectable({ providedIn: "root" })
export class GerenciamentoMensalService extends DefaultServiceUtil<any> {
  
  constructor(protected http: HttpService) {
    super();
  }

    public async getDadosMensais(mesReferencia: string): Promise<IResponseInterface<any>> {
      return await this.http.get<IResponseInterface<any>>(`/gerenciamento-mensal/${mesReferencia}`);
    }

    public async postBandeira(req: IBandeiraTarifariaVigente): Promise<IResponseInterface<IBandeiraTarifariaVigente>> {
      const formattedReq = this.formatPrePost(req);
      const ret = await this.http.post<IResponseInterface<IBandeiraTarifariaVigente>>(`/gerenciamento-mensal/bandeira`, formattedReq);
      
      const formattedRet = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedRet };
    }

    public async postPisCofins(req: any): Promise<IResponseInterface<IPisCofinsMensal>> {
      const formattedReq = this.formatPrePost(req);
      const ret = await this.http.post<IResponseInterface<IPisCofinsMensal>>(`/gerenciamento-mensal/pis-cofins`, formattedReq);
      
      const formattedRet = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedRet };
    }

    public async postProinfaIcms(req: any): Promise<IResponseInterface<IProinfaIcmsMensal>> {
      const formattedReq = this.formatPrePost(req);
      const ret = await this.http.post<IResponseInterface<IProinfaIcmsMensal>>(`/gerenciamento-mensal/proinfa-icms`, formattedReq);
      
      const formattedRet = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedRet };
    }
}