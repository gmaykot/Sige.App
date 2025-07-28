import { Injectable } from "@angular/core";
import { IContrato } from "../../../@core/data/contrato";
import { IContratoEmpresas } from "../../../@core/data/contrato-empresas";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


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
