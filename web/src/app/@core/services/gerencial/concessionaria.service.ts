import { Injectable } from "@angular/core";
import { IConcessionaria } from "../../data/concessionarias";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";
import { IResponseInterface } from "../../data/response.interface";
import { IDropDown } from "../../data/drop-down";

@Injectable({ providedIn: "root" })
export class ConcessionariaService extends DefaultService<IConcessionaria> {
  constructor(protected http: HttpService) {
    super(http, "concessionaria");
  }

    public async getPorPontoMedicao(idPontoMedicao: string): Promise<IResponseInterface<IDropDown[]>> 
    {
        return await this.http.get<IResponseInterface<IDropDown[]>>(`/concessionaria/pontoMedicao/${idPontoMedicao}`);
    }
}
