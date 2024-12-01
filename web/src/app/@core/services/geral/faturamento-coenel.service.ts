import { Injectable } from "@angular/core";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";
import { IFaturamentoCoenel } from "../../data/geral/faturamento-coenel";
import { IResponseInterface } from "../../data/response.interface";

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
