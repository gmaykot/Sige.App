import { Injectable } from "@angular/core";
import { ETipoPerfil } from "../../enum/ETipoPerfil";
import { SessionSige } from "../../enum/session.const";

@Injectable({ providedIn: "root" })
export class SessionStorageService {

    public static habilitaValidarRelatorio() {
        return SessionStorageService.getPerfil() === ETipoPerfil.ADMINISTRATIVO || SessionStorageService.getPerfil() === ETipoPerfil.SUPERUSUARIO;
    }

    public static habilitaOperacoes() {
        return SessionStorageService.getPerfil() !== ETipoPerfil.CONSULTIVO;
    }

    public static habilitaExcluir() {
        return SessionStorageService.getPerfil() !== ETipoPerfil.CONSULTIVO;
    }

    public static isSuperUsuario() {
        return SessionStorageService.getPerfil() === ETipoPerfil.SUPERUSUARIO;
    }

    public static getPerfil(): ETipoPerfil {
        var codPerfil: number = +sessionStorage.getItem(SessionSige.MENU_ACTIVE);
        return codPerfil as ETipoPerfil;
    }

    public static getUsuarioId(): string {
        return sessionStorage.getItem(SessionSige.USER_ID);
    }

    public static isSysAdm(): boolean {
        return sessionStorage.getItem(SessionSige.USER_SYSADM) === 'true';
    }
    
    public static isLogged(): boolean {
        var token = sessionStorage.getItem(SessionSige.AUTH_TOKEN);
        return token !== undefined && token !== null && token !== '';
    }
    
}