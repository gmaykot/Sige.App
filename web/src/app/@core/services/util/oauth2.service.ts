import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IAuth } from '../../data/auth';

@Injectable({ providedIn: 'root' })
export class OAuth2Service {
   private urlBase = "oauth2";
    constructor(private http: HttpService) {}

    public async login(auth: IAuth): Promise<any>
    {
        return await this.http.post<IAuth>(`/${this.urlBase}/login`, auth);
    }

    public async logout(): Promise<any>
    {
        return await this.http.post<IAuth>(`/${this.urlBase}/logout`);
    }
}
