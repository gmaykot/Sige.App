import { Injectable } from "@angular/core";
import { IMenuUsuario } from "../../data/menu-usuario";
import { HttpService } from "../util/http.service";
import { DefaultService } from "../default-service";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class MenuUsuarioService extends DefaultService<IMenuUsuario> {
  constructor(protected http: HttpService) {
    super(http, "menu-usuario");
  }

  public async getPorUsuario(id: string): Promise<IResponseInterface<IMenuUsuario[]>> {
    return await this.http.get<IResponseInterface<IMenuUsuario[]>>(
      `/${this.urlBase}/usuario/${id}`
    );
  }

  public async postMenus(req: IMenuUsuario[]): Promise<IResponseInterface<any>> {
    const ret = await this.http.post<IResponseInterface<any>>(`/${this.urlBase}/menus`, req);   
    return ret;
  }
}
