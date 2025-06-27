import { Injectable } from "@angular/core";
import { HttpService } from "../../../@core/services/util/http.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultServiceUtil } from "../../../@core/services/util/default-service-util";
import { IBandeiraTarifariaVigente } from "../../../@core/data/bandeira-tarifaria-vigente";
import { IDescontoTusdMensal, IPisCofinsMensal, IProinfaIcmsMensal } from "./gerenciamento-mensal.interface";

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

    public async postDescontoTusd(req: any): Promise<IResponseInterface<IDescontoTusdMensal>> {
      const formattedReq = this.formatPrePost(req);
      const ret = await this.http.post<IResponseInterface<IDescontoTusdMensal>>(`/gerenciamento-mensal/desconto-tusd`, formattedReq);
      
      const formattedRet = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedRet };
    }
}