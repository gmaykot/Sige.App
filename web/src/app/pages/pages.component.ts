import { Component } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { SessionSige } from '../@core/enum/session.const';

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

  constructor(private menuService: NbMenuService) {
    const menuUsuario = sessionStorage.getItem(SessionSige.MENU_LIST);
    if (menuUsuario != null){      
      this.menu = JSON.parse(menuUsuario);

      this.menuService.onItemClick()
      .subscribe(menuBag => {
        var menuSistema: any = menuBag.item;
        sessionStorage.setItem(SessionSige.MENU_ACTIVE, menuSistema.perfil?.toString());
      });
    }    
  } 
}
