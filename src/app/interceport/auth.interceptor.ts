import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, mergeMap, Observable, of, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {BeeService} from "../service/bee.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private beeService: BeeService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let copyRequest = request;
    console.log("ffdfds")
    if (this.beeService.userInfo && this.beeService.userInfo.token) {
      copyRequest = request.clone({
        headers: request.headers.set('token', this.beeService.userInfo.token)
      })
    }
    return next.handle(copyRequest).pipe(
      mergeMap((event: any) => {
        if (event && event.body && event.body.code === 20001) {
          this.beeService.logout()
        }
        return of(event)
      }),
      catchError((err: HttpErrorResponse) => {
        let errMsg = ''
        if (err.error instanceof ErrorEvent) {
          // client size error
          errMsg = err.error.message
        } else {
          // server size error
          errMsg = err.error.message ? err.error.message : err.message;
        }
        throw new Error(`错误：${errMsg}`)
      })
    );
  }
}
