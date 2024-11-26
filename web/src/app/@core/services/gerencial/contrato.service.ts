import { Injectable } from "@angular/core";
import { IContrato } from "../../data/contrato";
import { IResponseInterface } from "../../data/response.interface";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IContratoEmpresas } from "../../data/contrato-empresas";

@Injectable({ providedIn: "root" })
export class ContratoService extends DefaultService<IContrato> {
  constructor(protected http: HttpService) {
    super(http, "contrato");
  }

  public async vinculaEmpresa(empresa: IContratoEmpresas): Promise<IResponseInterface<IContratoEmpresas>> {
    return await this.http.post<IResponseInterface<IContratoEmpresas>>(`/contrato/empresa-grupo`, empresa);
  }

  public async removeEmpresa(id: string): Promise<IResponseInterface<any>> {
    return await this.http.delete<IResponseInterface<any>>(`/contrato/empresa-grupo/${id}`);
  }
}
