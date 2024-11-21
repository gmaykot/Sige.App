import { Injectable } from "@angular/core";
import { IContrato } from "../../data/contrato";
import { IResponseIntercace } from "../../data/response.interface";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IContratoEmpresas } from "../../data/contrato-empresas";

@Injectable({ providedIn: "root" })
export class ContratoService extends DefaultService<IContrato> {
  constructor(protected http: HttpService) {
    super(http, "contrato");
  }

  public async vinculaEmpresa(empresa: IContratoEmpresas): Promise<IResponseIntercace<IContratoEmpresas>> {
    return await this.http.post<IResponseIntercace<IContratoEmpresas>>(`/contrato/empresa-grupo`, empresa);
  }

  public async removeEmpresa(id: string): Promise<IResponseIntercace<any>> {
    return await this.http.delete<IResponseIntercace<any>>(`/contrato/empresa-grupo/${id}`);
  }
}
