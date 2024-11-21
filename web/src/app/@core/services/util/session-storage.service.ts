import { Injectable } from "@angular/core";
import { ETipoPerfil } from "../../enum/ETipoPerfil";

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

    public static getPerfil(): ETipoPerfil {
        var codPerfil: number = +sessionStorage.getItem('selectedMenuPerfil');
        return codPerfil as ETipoPerfil;
    }

    public static getUsuarioId(): string {
        return '08dcf487-2e38-4838-801d-952d82f9a537';
    }
}