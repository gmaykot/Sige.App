import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { IEmailData } from "../../data/email-data";

@Injectable({ providedIn: "root" })
export class EmailService {
  constructor(private http: HttpService) {}

  public async sendEmail(emailData: IEmailData): Promise<any> {
    return await this.http.post<any>("/email", emailData);
  }

  public async sendEmailEconomia(emailData: IEmailData): Promise<any> {
    return await this.http.post<any>("/email/economia", emailData);
  }

  public async getHistorico(): Promise<any> {
    return await this.http.get<any>("/email");
  }
}
