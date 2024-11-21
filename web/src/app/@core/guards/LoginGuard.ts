import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        var access_token = sessionStorage.getItem('access_token');
        if (access_token && access_token != '') {
            this.router.navigateByUrl("/pages");              
        }
        return true;
    }
}