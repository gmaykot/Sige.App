import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, getDeepFromObject } from '@nebular/auth';
import { AuthService } from '../../services/util/auth.service';

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
              protected authService: AuthService) {
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('menu_usuario');
  }

  async login() {
    this.errors = [];
    this.messages = [];
    this.submitted = true; 
    this.loading = true;
    await this.authService.login(this.user)
    .then( (response: any) =>
    {
      if (response.success === true)
      {
        setTimeout(() => {
          sessionStorage.setItem("access_token", response.data.payload);
          sessionStorage.setItem("menu_usuario", response.data.menusUsuario);
          this.messages.push(response.message)
          return this.router.navigateByUrl("/pages");
        }, this.redirectDelay);
      }
      response.errors.map((x) => this.errors.push(x.value));
      this.cd.detectChanges();
      this.submitted = false;
      this.loading = false;
    }).catch((e) => {
      this.errors = ["Falha ao estabelecer conexão com o servidor.","Favor tente novamente em alguns minutos."]
      this.cd.detectChanges();
      this.submitted = false;
      this.loading = false;
    });  
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}