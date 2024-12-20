import { Injectable } from "@angular/core";
import { IDropDown } from "../data/drop-down";
import { HttpService } from "./util/http.service";
import { DefaultServiceUtil } from "./util/default-service-util";
import { IResponseInterface } from "../data/response.interface";

@Injectable({ providedIn: "root" })
export class DefaultService<T> extends DefaultServiceUtil<T> {
  constructor(protected http: HttpService, protected urlBase: string,) { super(); }

  public async get(): Promise<IResponseInterface<T[]>> {
    const ret = await this.http.get<IResponseInterface<T[]>>(`/${this.urlBase}`)
    const formattedReq = this.formatPosGet(ret?.data);
    return { ...ret, data: formattedReq };
  }

  public async getBy(id: string): Promise<IResponseInterface<T>> {
    const ret = await this.http.get<IResponseInterface<T>>(`/${this.urlBase}/${id}`);
    const formattedReq = this.formatPosGet(ret?.data);
    return { ...ret, data: formattedReq };
  }

  public async post(req: T): Promise<IResponseInterface<T>> {
    const formattedReq = this.formatPrePost(req);
    const ret = await this.http.post<IResponseInterface<T>>(`/${this.urlBase}`, formattedReq);
    
    const formattedRet = this.formatPosGet(ret?.data);
    return { ...ret, data: formattedRet };
  }

  public async put(req: T): Promise<IResponseInterface<T>> {
    const formattedReq = this.formatPrePost(req);
    const ret = await this.http.put<IResponseInterface<T>>(`/${this.urlBase}`, formattedReq);

    const formattedRet = this.formatPosGet(ret?.data);
    return { ...ret, data: formattedRet };
  }

  public async delete(id: string): Promise<IResponseInterface<T>> {
    const ret = await this.http.delete<IResponseInterface<T>>(`/${this.urlBase}/${id}`);

    const formattedRet = this.formatPosGet(ret?.data);
    return { ...ret, data: formattedRet };
  }

  public async getDropDown(): Promise<IResponseInterface<IDropDown[]>> {
    return await this.http.get<IResponseInterface<IDropDown[]>>(
      `/${this.urlBase}/drop-down`
    );
  }  
}
