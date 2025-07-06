// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OAuth2Service } from '../services/util/oauth2.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, protected oauth2Service: OAuth2Service) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
            this.router.navigateByUrl("/auth");
            this.oauth2Service.logout().then((response: any) => {
            });
            sessionStorage.clear();
        }
        return throwError(() => error);
      })
    );
  }
}
