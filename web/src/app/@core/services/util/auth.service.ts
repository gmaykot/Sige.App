import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IAuth } from '../../data/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
   
    constructor(private http: HttpService) {}

    public async login(auth: IAuth): Promise<any>
    {
        return await this.http.post<IAuth>("/auth/login", auth);
    }
}
