import { Injectable } from "@angular/core";
import { IUsuario, IUsuarioSenha, Usuario } from "../../data/usuario";
import { of as observableOf, Observable } from "rxjs";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";
import { SessionSige } from "../../enum/session.const";

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
