import { Injectable } from "@angular/core";
import { IEmpresa } from "../../data/empresa";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class EmpresaService extends DefaultService<IEmpresa> {
  constructor(protected http: HttpService) {
    super(http, "empresa");
  }
}
