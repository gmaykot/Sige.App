import { Injectable } from "@angular/core";
import { IFaturamentoCoenel } from "../../../@core/data/geral/faturamento-coenel";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


@Injectable({ providedIn: "root" })
export class FaturamentoCoenelService extends DefaultService<IFaturamentoCoenel> {
  constructor(protected http: HttpService) {
    super(http, "faturamento-coenel");
  }

  public async getByPontoMedicao(id: string): Promise<IResponseInterface<IFaturamentoCoenel[]>> {
    const ret = await this.http.get<IResponseInterface<IFaturamentoCoenel[]>>(`/${this.urlBase}/ponto-medicao/${id}`);
    const formattedReq = this.formatPosGet(ret.data);
    return { ...ret, data: formattedReq };
  }
}
