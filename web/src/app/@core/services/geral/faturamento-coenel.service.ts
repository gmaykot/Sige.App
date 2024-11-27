import { Injectable } from "@angular/core";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";
import { IFaturamentoCoenel } from "../../data/geral/faturamento-coenel";

@Injectable({ providedIn: "root" })
export class FaturamentoCoenelService extends DefaultService<IFaturamentoCoenel> {
  constructor(protected http: HttpService) {
    super(http, "faturamento-coenel");
  }
}
