import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { LayoutService } from "../../../@core/utils";
import { filter, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { UsuarioService } from "../../../@core/services/administrativo/usuario.service";
import { Usuario } from "../../../@core/data/usuario";
import { OAuth2Service } from "../../../@core/services/util/oauth2.service";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  themes = [
    {
      value: "default",
      name: "Dark",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentTheme = "default";

  userMenu = [{ title: "Alterar Senha" }, { title: "Sair" }];
  tag = "my-context-menu";

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    protected router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private usuarioService: UsuarioService,
    protected oauth2Service: OAuth2Service,
  ) {
    menuService
      .onItemClick()
      .pipe(filter(({ tag }) => tag === this.tag))
      .subscribe(async (bag) => {
        if (bag.item.title == "Sair") {
          if (SessionStorageService.isLogged()) {
            this.router.navigateByUrl("/auth");
            this.user = null;
            this.oauth2Service.logout().then((response: any) => {
            });
            sessionStorage.clear();
          }
          return;
        }

        this.router.navigateByUrl("/pages/alterar-senha");
      });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.usuarioService
      .getUsuario()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario) => (this.user = usuario));

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
