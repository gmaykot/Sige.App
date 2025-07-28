import { Injectable } from "@angular/core";
import { of as observableOf, Observable } from "rxjs";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { IUsuario, Usuario, IUsuarioSenha } from "../../../@core/data/usuario";
import { SessionSige } from "../../../@core/enum/session.const";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


@Injectable({ providedIn: "root" })
export class UsuarioService  extends DefaultService<IUsuario> {
  constructor(protected http: HttpService) {
    super(http, "usuario");
    this.getUsuario();
  }
  usuario: Usuario;

  getUsuario(): Observable<Usuario> {
    this.usuario = {
      id: "",
      name: "",
      su: "",
      picture: ""
    };
    const nome = sessionStorage.getItem(SessionSige.USER_NAME);
    if (nome != null) {
      this.usuario.name = sessionStorage.getItem(SessionSige.USER_NAME);
    }
    this.usuario.picture = "assets/images/profile.png";
    return observableOf(this.usuario);
  }

  public async alterarSenha(req: IUsuarioSenha): Promise<IResponseInterface<any>> {
    return await this.http.put<IResponseInterface<any>>(`/${this.urlBase}/senha`, req);
  }

}
