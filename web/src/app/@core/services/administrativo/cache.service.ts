import * as core from "@angular/core";
import { HttpService } from "../util/http.service";
import { IDropDown } from "../../data/drop-down";

@core.Injectable({ providedIn: "root" })
export class CacheService {
    private urlBase = "auth";

    constructor(private http: HttpService) {
    }

    public async listCache(): Promise<string[]> {
        return await this.http.get<string[]>(`/${this.urlBase}/list-cache`
    );
    }

    public async clearCache(req?: IDropDown): Promise<any> {
        return await this.http.post<any>(`/${this.urlBase}/clear-cache`, req);   
    }
}
