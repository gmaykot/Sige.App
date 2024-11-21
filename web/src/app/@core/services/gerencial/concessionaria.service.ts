import { Injectable } from "@angular/core";
import { IConcessionaria } from "../../data/concessionarias";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";

@Injectable({ providedIn: "root" })
export class ConcessionariaService extends DefaultService<IConcessionaria> {
  constructor(protected http: HttpService) {
    super(http, "concessionaria");
  }
}
