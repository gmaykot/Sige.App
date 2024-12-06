import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionSige } from "../enum/session.const";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        var access_token = sessionStorage.getItem(SessionSige.AUTH_TOKEN);
        if (access_token && access_token != '') {
            this.router.navigateByUrl("/pages");              
        }
        return true;
    }
}