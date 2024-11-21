import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IAuth } from '../../data/auth';
import { IEmailData } from '../../data/email-data';

@Injectable({ providedIn: 'root' })
export class EmailService {
   
    constructor(private http: HttpService) {}

    public async sendEmail(emailData: IEmailData): Promise<any>
    {
        return await this.http.post<any>("/email", emailData);
    }
}
