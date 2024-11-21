import { Injectable } from "@angular/core";
import { IResponseIntercace } from "../data/response.interface";
import { IDropDown } from "../data/drop-down";
import { HttpService } from "./util/http.service";

@Injectable({ providedIn: "root" })
export class DefaultService<T> {
  constructor(protected http: HttpService, protected urlBase: string) {}

  public async get(): Promise<IResponseIntercace<T[]>> {
    return await this.http.get<IResponseIntercace<T[]>>(`/${this.urlBase}`);
  }

  public async getBy(id: string): Promise<IResponseIntercace<T>> {
    return await this.http.get<IResponseIntercace<T>>(`/${this.urlBase}/${id}`);
  }

  public async post(req: T): Promise<IResponseIntercace<T>> {
    return await this.http.post<IResponseIntercace<T>>(`/${this.urlBase}`, req);
  }

  public async put(req: T): Promise<IResponseIntercace<T>> {
    return await this.http.put<IResponseIntercace<T>>(`/${this.urlBase}`, req);
  }

  public async delete(id: string): Promise<IResponseIntercace<T>> {
    return await this.http.delete<IResponseIntercace<T>>(`/${this.urlBase}/${id}`);
  }

  public async getDropDown(): Promise<IResponseIntercace<IDropDown[]>> {
    return await this.http.get<IResponseIntercace<IDropDown[]>>(
      `/${this.urlBase}/drop-down`
    );
  }
}
