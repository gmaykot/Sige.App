import { Injectable } from "@angular/core";
import { IDropDown } from "../../../@core/data/drop-down";
import { IMenuSistema } from "../../../@core/data/menu-sistema";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";

@Injectable({ providedIn: "root" })
export class MenuSistemaService extends DefaultService<IMenuSistema> {
  constructor(protected http: HttpService) {
    super(http, "menu-sistema");
  }

  public async getDropDownEstruturado(): Promise<IResponseInterface<IDropDown[]>> {
    return await this.http.get<IResponseInterface<IDropDown[]>>(
      `/${this.urlBase}/drop-down-estruturado`
    );
  }
}
