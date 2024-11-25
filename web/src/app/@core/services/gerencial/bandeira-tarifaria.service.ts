import { Injectable } from "@angular/core";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";
import { IBandeiraTarifaria } from "../../data/bandeira-tarifaria";

@Injectable({ providedIn: "root" })
export class BandeiraTarifariaService extends DefaultService<IBandeiraTarifaria> {
  constructor(protected http: HttpService) {
    super(http, "bandeira-tarifaria");
  }
}