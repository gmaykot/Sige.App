import { Injectable } from "@angular/core";
import { IConcessionaria } from "../../../@core/data/concessionarias";
import { HttpService } from "../../../@core/services/util/http.service";
import { DefaultService } from "../../../@core/services/default-service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { IDropDown } from "../../../@core/data/drop-down";

@Injectable({ providedIn: "root" })
export class ConcessionariaService extends DefaultService<IConcessionaria> {
  constructor(protected http: HttpService) {
    super(http, "concessionaria");
  }

    public async getPorPontoMedicao(idPontoMedicao: string): Promise<IResponseInterface<IDropDown[]>> 
    {
        const ret = await this.http.get<IResponseInterface<IDropDown[]>>(`/concessionaria/pontoMedicao/${idPontoMedicao}`);
        const formattedReq = this.formatPosGet(ret?.data);
        return { ...ret, data: formattedReq };
    }
}
