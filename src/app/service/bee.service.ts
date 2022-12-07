import {Injectable} from '@angular/core';
import {mergeMap, Observable, of} from "rxjs";
import {HttpResponse, UserInfo} from "../common/bee.entity";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class BeeService {

  DEVICE_ID = "9AD89D0791C59431";
  formOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string): Observable<UserInfo | undefined> {
    const body = new HttpParams()
      .set('devId', this.DEVICE_ID)
      .set('userAccount', username)
      .set('password', password)
    return this.http.post<HttpResponse<UserInfo>>('bee/login/userLogin', body, this.formOptions)
      .pipe(
        mergeMap(event => {
          if (event.code === 0) {
            return of(event.result)
          } else {
            throw new Error(event.msg)
          }
        })
      )
  }
}
