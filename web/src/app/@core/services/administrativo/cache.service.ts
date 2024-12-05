import * as core from "@angular/core";
import { JwtService } from "../util/jwt.service";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";

@core.Injectable({ providedIn: "root" })
export class CacheService {
  constructor(protected http: HttpService, private jwtService: JwtService) {
  }

}
