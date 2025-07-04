import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService, getDeepFromObject } from '@nebular/auth';
import { OAuth2Service } from '../../services/util/oauth2.service';
import { MenuUsuarioService } from '../../services/administrativo/menu-usuario.service';
import { SessionSige } from '../../enum/session.const';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.scss"],
})
export class NgxLoginComponent {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';
  public loading: boolean = false;

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  rememberMe = false;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected oauth2Service: OAuth2Service,
    protected menuUsuario: MenuUsuarioService) {
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    sessionStorage.clear();
  }

  async login() {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.loading = true;
    await this.oauth2Service.login(this.user)
      .then((response: any) => {
        if (response.success === true) {
          setTimeout(async () => {
            sessionStorage.setItem(SessionSige.AUTH_TOKEN, response.data.auth.token);
            sessionStorage.setItem(SessionSige.AUTH_REFRESH_TOKEN, response.data.auth.refresToken);
            sessionStorage.setItem(SessionSige.USER_ID, response.data.usuario.usuarioId);
            sessionStorage.setItem(SessionSige.USER_NAME, response.data.usuario.apelido);
            sessionStorage.setItem(SessionSige.USER_SYSADM, response.data.usuario.sysAdm);
            sessionStorage.setItem(SessionSige.MENU_LIST, JSON.stringify(response.data.menus));

            this.messages.push(response.message)
            return this.router.navigateByUrl("/pages");
          }, this.redirectDelay);
        }
        response.errors.map((x) => this.errors.push(x.value));
        this.cd.detectChanges();
        this.submitted = false;
        this.loading = false;
      }).catch((e) => {
        this.errors = ["Falha ao estabelecer conexão com o servidor.", "Favor tente novamente em alguns minutos."]
        this.cd.detectChanges();
        this.submitted = false;
        this.loading = false;
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}