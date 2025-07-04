import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { EnergiaAcumuladaEntity } from "./energia-acumulada.interface";
import { Validators } from "@angular/forms";

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

export const EnergiaAcumuladaControl: DefaultValues<EnergiaAcumuladaEntity> = {
  id: ["", null],
  pontoMedicaoId: ["", [Validators.required]],
  pontoMedicaoDesc: ["", null],
  mesReferencia: ["", [Validators.required]],
  valorMensalAcumulado: [0, [Validators.required]],
  valorTotalAcumulado: [0, [Validators.required]],
  ativo: [true, null],
};