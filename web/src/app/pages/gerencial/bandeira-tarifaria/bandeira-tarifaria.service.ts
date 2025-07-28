import { Injectable } from "@angular/core";
import { HttpService } from "../../../@core/services/util/http.service";
import { DefaultService } from "../../../@core/services/default-service";
import { IBandeiraTarifaria } from "../../../@core/data/bandeira-tarifaria";

@Injectable({ providedIn: "root" })
export class BandeiraTarifariaService extends DefaultService<IBandeiraTarifaria> {
  constructor(protected http: HttpService) {
    super(http, "bandeira-tarifaria");
  }
}