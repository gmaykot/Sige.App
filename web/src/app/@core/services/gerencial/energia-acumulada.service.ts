import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";
import { EnergiaAcumuladaEntity } from "../../../pages/gerencial/energia-acumulada/energia-acumulada.interface";

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