import { Component } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { JwtService } from '../@core/services/util/jwt.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu: NbMenuItem[];

  constructor(private jwtService: JwtService, private menuService: NbMenuService) {
    const menuUsuario = sessionStorage.getItem("menu_usuario")
    if (menuUsuario != null){      
      this.menu = JSON.parse(this.jwtService.getDecodedMenuUsuario());

      this.menuService.onItemClick()
      .subscribe(menuBag => {
        var menuSistema: any = menuBag.item;
        var perfil: number = menuSistema.Perfil
        sessionStorage.setItem('selectedMenuItem', menuSistema.title);
        sessionStorage.setItem('selectedMenuPerfil', perfil.toString());
      });
    }    
  } 
}
