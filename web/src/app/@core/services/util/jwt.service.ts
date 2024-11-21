import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NbMenuItem } from '@nebular/theme';
import { Usuario } from '../../data/usuario';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
    public isTokenInvalid(token: string): boolean {
      if (token == null || token === '') {
        return true;
      } else {
        return this.isTokenExpired(token);
      }
    }

    public getToken(){
      const token = sessionStorage.getItem('access_token');
      if (token !== null && token !== '') {
        return `Bearer ${sessionStorage.getItem('access_token')}`;
      }
        return '';
    }
  
    private isTokenExpired(token: string): boolean {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  
      return Math.floor(new Date().getTime() / 1000) >= expiry;
    }

    public getDecodeJwt(jwt: string): any {
      try {       
          const helper = new JwtHelperService();
          return helper.decodeToken(jwt);
      } catch(Error) {
        console.warn(Error);
        return null;
      }
    }

    public getDecodedAccessToken(token: string = ''): any {
      try {
        if (token === '')
          token = `${sessionStorage.getItem('access_token')}`;
        
          return this.getDecodeJwt(token);
      } catch(Error) {
        console.warn(Error);
        return null;
      }
    }
    
    public getDecodedMenuUsuario(menuUsuario: string = ''): any {
      try {
        if (menuUsuario === '')
          menuUsuario = `${sessionStorage.getItem('menu_usuario')}`;
        
          return this.getDecodeJwt(menuUsuario).menus;
      } catch(Error) {
        console.warn(Error);
        return new NbMenuItem;
      }
    }

    public getDecodedUser(): Usuario {
      const user = this.getDecodedAccessToken();
      return user;
    }
  }