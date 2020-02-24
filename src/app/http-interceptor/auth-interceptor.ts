import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {BeeService} from '../bee/bee.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private beeService: BeeService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    if (this.beeService.userInfo && this.beeService.userInfo.token) {
      authReq = req.clone({
        headers: req.headers.set('token', this.beeService.userInfo.token)
      });
    }
    return next.handle(authReq)
      .pipe(
        // retry(1),
        mergeMap((event: any) => {
          if (event && event.body && event.body.code === 20001) {
            this.beeService.signOut();
            this.router.navigateByUrl(`/login`);
          }
          return of(event);
        }),
        catchError((err: HttpErrorResponse) => {
          let errorMessage = '';
          if (err.error instanceof ErrorEvent) {
            // client-size error
            errorMessage = err.error.message;
          } else {
            // server-side error
            errorMessage = err.error.message ? err.error.message : err.message;
            // errorMessage = err.message;
            /*            if (err.status === 401) {
                          this.beeService.signOut();
                          this.router.navigateByUrl(`/login`);
                        }*/
          }
          return throwError(errorMessage);
        })
      );
  }

}
