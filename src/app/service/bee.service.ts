import {Injectable} from '@angular/core';
import {mergeMap, Observable, of} from "rxjs";
import {HttpResponse, Task, UserInfo} from "../common/bee.entity";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import LRUCache from "lru-cache";


const USER_INFO = 'user_info'
const LAST_USERNAME = 'last_username'
const APP_VERSION = 'app_version'
const lruCache = new LRUCache({
  max: 100,
  ttl: 60 * 60 * 1000
});

@Injectable({
  providedIn: 'root'
})
export class BeeService {


  DEVICE_ID = "9AD89D0791C59431";
  userInfo: UserInfo = new UserInfo();
  formOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }

  constructor(private http: HttpClient, private router: Router) {
    const userInfoStorage = localStorage.getItem(USER_INFO)
    if (userInfoStorage) this.userInfo = JSON.parse(userInfoStorage)
  }

  login(username: string, password: string): Observable<UserInfo> {
    const body = new HttpParams()
      .set('devId', this.DEVICE_ID)
      .set('userAccount', username)
      .set('password', password)
    return this.http.post<HttpResponse<UserInfo>>('bee/login/userLogin', body, this.formOptions)
      .pipe(
        mergeMap(event => {
          if (event.code === 0) {
            localStorage.setItem(USER_INFO, JSON.stringify(event.result))
            localStorage.setItem(LAST_USERNAME, username)
            return of(event.result!)
          } else {
            throw new Error(event.msg)
          }
        })
      )
  }

  getTasks(): Observable<Array<Task>> {
    const body = new HttpParams()
      .set('pageNo', '1')
      .set('pageSize', '100')
      .set('userId', "")
    return this.http.post<HttpResponse<Array<Task>>>('bee/user/historyCreate', body, this.formOptions)
      .pipe(
        mergeMap(event => {
          if (event.code === 0) {
            return of(event.result!)
          } else {
            throw new Error((event.msg))
          }
        })
      )

  }

  logout() {

  }
}
