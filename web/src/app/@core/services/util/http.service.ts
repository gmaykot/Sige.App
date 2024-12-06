import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { SessionSige } from "../../enum/session.const";

@Injectable({ providedIn: 'root' })
export class HttpService {
    private _urlBase = environment.base_api_url;

    constructor(private http: HttpClient) {}
    
    private getUrl(url: string){
      return this._urlBase + url;
    }

    public async get<T>(
        url: string,
        params: { [param: string]: string | string[] } = {}
      ) { 
        const options = {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': this.getOAuth2Token()
          }
        };
        return this.http.get<T>(this.getUrl(url), options).toPromise();
      }

      public async post<T>(
        url: string,
        body: any = {},
      ) {
        const options = {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': this.getOAuth2Token()
          }
        };
        return this.http.post<T>(this.getUrl(url), body, options).toPromise();
      }

      public async put<T>(
        url: string,
        body: any = {},
      ) {
        const options = {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': this.getOAuth2Token()
          }
        };
        return this.http.put<T>(this.getUrl(url), body, options).toPromise();
      }

      public async delete<T>(url: string) {
        const options = {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': this.getOAuth2Token()
          }
        };
    
        return this.http.delete<T>(this.getUrl(url), options).toPromise();
      }

      private getOAuth2Token() {
        const token = sessionStorage.getItem(SessionSige.AUTH_TOKEN);
        if (token !== null && token !== '') {
          return token;
        }
          return '';
    }
}