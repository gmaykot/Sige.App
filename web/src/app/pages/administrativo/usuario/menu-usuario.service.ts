import { Injectable } from "@angular/core";
import { IMenuUsuario } from "../../../@core/data/menu-usuario";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";

@Injectable({ providedIn: "root" })
export class MenuUsuarioService extends DefaultService<IMenuUsuario> {
  constructor(protected http: HttpService) {
    super(http, "menu-usuario");
  }

  public async obterPosLogin(): Promise<IResponseInterface<any>> {
    return await this.http.get<IResponseInterface<IMenuUsuario[]>>(
      `/${this.urlBase}/posLogin`
    );
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
