import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StatusIconEventService {
  private _click$ = new Subject<any>();
  click$ = this._click$.asObservable();

  emitirClique(dado: any) {
    this._click$.next(dado);
  }
}