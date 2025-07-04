import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { EnergiaAcumuladaEntity } from "./energia-acumulada.interface";

@Injectable({ providedIn: "root" })
export class EnergiaAcumuladaService extends DefaultService<EnergiaAcumuladaEntity> {
  constructor(protected http: HttpService) {
    super(http, "energia-acumulada");
  }

  public async getPorPontoMedicao(idPontoMedicao: string): Promise<IResponseInterface<EnergiaAcumuladaEntity[]>> 
  {
      const ret = await this.http.get<IResponseInterface<EnergiaAcumuladaEntity[]>>(`/energia-acumulada/pontoMedicao/${idPontoMedicao ?? ''}`);
      const formattedReq = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedReq };
  }

  public async getPorMesReferencia(mesReferencia?: string): Promise<IResponseInterface<EnergiaAcumuladaEntity[]>> 
  {
      const ret = await this.http.get<IResponseInterface<EnergiaAcumuladaEntity[]>>(`/energia-acumulada/mesReferencia/${mesReferencia ?? ''}`);
      const formattedReq = this.formatPosGet(ret?.data);
      return { ...ret, data: formattedReq };
  }
}