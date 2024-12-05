import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { JwtService } from "../services/util/jwt.service";

@Injectable({ providedIn: 'root' })
export class SAGuard implements CanActivate {
    constructor(private router: Router, private jwtService: JwtService) {}

    canActivate(): boolean {
        var usuario = this.jwtService.getDecodedUser();
        if (usuario.su.toLowerCase() === 'true') {
            return true;
        }
        this.router.navigateByUrl("/pages/unauthorized");  
    }
}