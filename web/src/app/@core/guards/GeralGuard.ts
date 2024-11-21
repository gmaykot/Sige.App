import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class GeralGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        var access_token = sessionStorage.getItem('access_token');
        if (access_token) {
            return true;
        }
        this.router.navigateByUrl("/auth");  
    }
}