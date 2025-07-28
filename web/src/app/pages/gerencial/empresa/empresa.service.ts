import { Injectable } from "@angular/core";
import { IEmpresa } from "../../../@core/data/empresa";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


@Injectable({ providedIn: "root" })
export class EmpresaService extends DefaultService<IEmpresa> {
  constructor(protected http: HttpService) {
    super(http, "empresa");
  }
}
