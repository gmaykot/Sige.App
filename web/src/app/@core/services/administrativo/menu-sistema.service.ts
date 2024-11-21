import { Injectable } from "@angular/core";
import { IMenuSistema } from "../../data/menu-sistema";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";
import { IDropDown } from "../../data/drop-down";
import { IResponseIntercace } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class MenuSistemaService extends DefaultService<IMenuSistema> {
  constructor(protected http: HttpService) {
    super(http, "menu-sistema");
  }

  public async getDropDownEstruturado(): Promise<IResponseIntercace<IDropDown[]>> {
    return await this.http.get<IResponseIntercace<IDropDown[]>>(
      `/${this.urlBase}/drop-down-estruturado`
    );
  }
}
