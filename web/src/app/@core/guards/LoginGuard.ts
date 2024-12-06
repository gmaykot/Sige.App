import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionStorageService } from "../services/util/session-storage.service";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
        if (SessionStorageService.isLogged()) {
            this.router.navigateByUrl("/pages");
        }
        return true;
    }
}