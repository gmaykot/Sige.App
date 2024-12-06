import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CepService {
    private _urlBase = environment.base_cep_url;

    constructor(private http: HttpClient) {}
    
    private getUrl(cep: string){
      return this._urlBase.replace('{cep}', cep);
    }

    public async get<T>(
        cep: string
      ) { 
        const options = {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          }
        };
        return this.http.get<T>(this.getUrl(cep), options).toPromise();
      }      
}