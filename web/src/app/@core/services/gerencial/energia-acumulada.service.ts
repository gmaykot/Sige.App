import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IEnergiaAcumulada } from "../../data/gerencial/energia-acumulada";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class EnergiaAcumuladaService extends DefaultService<IEnergiaAcumulada> {
  constructor(protected http: HttpService) {
    super(http, "energia-acumulada");
  }

  public async getPorPontoMedicao(idPontoMedicao: string): Promise<IResponseInterface<IEnergiaAcumulada[]>> 
  {
      const ret = await this.http.get<IResponseInterface<IEnergiaAcumulada[]>>(`/energia-acumulada/pontoMedicao/${idPontoMedicao ?? ''}`);
      const formattedReq = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedReq };
  }

  public async getPorMesReferencia(mesReferencia?: string): Promise<IResponseInterface<IEnergiaAcumulada[]>> 
  {
      const ret = await this.http.get<IResponseInterface<IEnergiaAcumulada[]>>(`/energia-acumulada/mesReferencia/${mesReferencia ?? ''}`);
      const formattedReq = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedReq };
  }
}