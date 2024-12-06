import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionSige } from "../enum/session.const";

@Injectable({ providedIn: 'root' })
export class GeralGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        var access_token = sessionStorage.getItem(SessionSige.AUTH_TOKEN);
        if (access_token) {
            return true;
        }
        this.router.navigateByUrl("/auth");  
    }
}