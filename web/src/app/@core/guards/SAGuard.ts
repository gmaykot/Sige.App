import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SessionStorageService } from "../services/util/session-storage.service";

@Injectable({ providedIn: 'root' })
export class SAGuard  {
    constructor(private router: Router) {}

    canActivate(): boolean {
        if (SessionStorageService.isSysAdm()) {
            return true;
        }
        this.router.navigateByUrl("/pages/unauthorized");  
    }
}