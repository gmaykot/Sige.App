import { Injectable } from "@angular/core";
import { IUsuario, IUsuarioSenha, Usuario } from "../../data/usuario";
import { of as observableOf, Observable } from "rxjs";
import { JwtService } from "../util/jwt.service";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IResponseIntercace } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class UsuarioService  extends DefaultService<IUsuario> {
  constructor(protected http: HttpService, private jwtService: JwtService) {
    super(http, "usuario");
    this.getUsuario();
  }
  usuario: Usuario;

  getUsuario(): Observable<Usuario> {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken != null) {
      this.usuario = this.jwtService.getDecodedUser();
    }
    this.usuario.picture = "assets/images/profile.png";
    return observableOf(this.usuario);
  }

  public async alterarSenha(req: IUsuarioSenha): Promise<IResponseIntercace<any>> {
    return await this.http.put<IResponseIntercace<any>>(`/${this.urlBase}/senha`, req);
  }

}
