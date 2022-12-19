import {Injectable} from '@angular/core';
import {mergeMap, Observable, of} from "rxjs";
import {
  HttpResponse,
  MyProjectOverview,
  NormalProjectOverview,
  Project,
  RankUser,
  Task,
  UserInfo
} from "../common/bee.entity";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import LRUCache from "lru-cache";
import {format} from "date-fns";


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
          if (event.code === 0 && event.result) {
            localStorage.setItem(USER_INFO, JSON.stringify(event.result))
            localStorage.setItem(LAST_USERNAME, username)
            this.userInfo = event.result
            return of(event.result)
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

  // 获取工时排行
  getWorkHoursRanking(searchType: string, searchDate: Date, quarter?: number): Observable<Array<RankUser>> {
    const sd = format(searchDate, searchType === '1' ? 'yyyy-MM' : 'yyyy')
    let body = new HttpParams()
      .set('deptId', this.userInfo.deptId.toString())
      .set('searchType', searchType)
      .set('searchDate', sd)
    if (quarter) {
      body = body.set('quarter', quarter.toString())
    }

    return this.http.post<HttpResponse<Array<RankUser>>>(`bee/task/workHoursOrderByDate`, body, this.formOptions)
      .pipe(
        mergeMap(event => {
          if (event.code === 0) {
            return of(event.result!)
          } else {
            throw new Error(event.msg)
          }
        })
      )
  }

  // 获取项目列表
  getProjects(): Observable<Array<Project>> {
    if (lruCache.get('projects')) {
      const projects = JSON.parse(lruCache.get('projects')!);
      return of(projects)
    }
    return this.http.post<HttpResponse<Array<Project>>>('bee/user/myProjects', {}, this.formOptions)
      .pipe(
        mergeMap(event => {
          if (event.code === 0) {
            lruCache.set('projects', JSON.stringify(event.result))
            return of(event.result!)
          } else {
            throw new Error(event.msg)
          }
        })
      )
  }

  // 获取已关闭的项目
  getClosedProjects(): Observable<Array<Project>> {
    if (lruCache.get('sub_projects')) {
      return of(JSON.parse(lruCache.get('sub_projects')!));
    }
    return this.http.post<HttpResponse<Array<Project>>>('bee/user/myCloseProjects',
      {}, this.formOptions)
      .pipe(
        mergeMap(res => {
          if (res.code === 0) {
            lruCache.set('sub_projects', JSON.stringify(res.result));
            return of(res.result!);
          } else {
            throw new Error(res.msg);
          }
        })
      );
  }

  // 获取我的项目列表
  getMyProjects(): Observable<Array<MyProjectOverview>> {
    let body = new HttpParams()
      .set('pageNo', 1)
      .set('pageSize', 100)
      .set('todoFlag', 0)
      .set('state', 0)
      .set('manageId', 0)

    return this.http.post<HttpResponse<Array<MyProjectOverview>>>('bee/user/projectList',
      body, this.formOptions)
      .pipe(
        mergeMap(res => {
          if (res.code === 0) {
            return of(res.result!);
          } else {
            throw new Error(res.msg);
          }
        })
      );
  }

  // 获取所有项目列表
  getNormalProjects(): Observable<Array<NormalProjectOverview>> {
    let body = new HttpParams()
      .set('pageNo', 1)
      .set('pageSize', 100)
      .set('state', 0)
      .set('depId', 0)

    return this.http.post<HttpResponse<Array<NormalProjectOverview>>>('bee/project/allProjects',
      body, this.formOptions)
      .pipe(
        mergeMap(res => {
          if (res.code === 0) {
            return of(res.result!);
          } else {
            throw new Error(res.msg);
          }
        })
      );
  }


  logout() {
    localStorage.removeItem(USER_INFO)
    lruCache.clear()
    this.router.navigate(['/login']).then()
  }
}
