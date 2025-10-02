import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SessionStorageService } from "../services/util/session-storage.service";

@Injectable({ providedIn: 'root' })
export class GeralGuard  {
    constructor(private router: Router) {}

    canActivate(): boolean {
        if (SessionStorageService.isLogged()) {
            return true;
        }
        this.router.navigateByUrl("/auth");  
    }
}