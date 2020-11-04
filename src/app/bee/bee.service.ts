import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParameterCodec, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, of, Subject, throwError} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {
  differenceInDays,
  endOfWeek,
  format,
  getDay,
  isSameWeek, parse,
  startOfWeek
} from 'date-fns';
import {Config} from '../config';
import CryptoJS from 'crypto-js';
import LRUCache from 'lru-cache';

const DEFAULT_PROJECT = 'default_project';
const USER_INFO = 'user_info';
const LAST_USERNAME = 'last_username';
const lruCache = new LRUCache({
  max: 100,
  maxAge: 60 * 60 * 1000
});

@Injectable({
  providedIn: 'root'
})
export class BeeService {

  // 通知刷新某天的task
  public notifyRefreshDaily = new Subject<Date>();

  // 通知关闭某个任务
  public notifyCloseTask = new Subject<TaskClose>();

  // 通知创建任务
  public notifyCreateTask = new Subject<TaskCreate>();

  // 通知删除任务
  public notifyDeleteTask = new Subject<Task>();

  // 通知编辑任务
  public notifyEditTask = new Subject<TaskInfo>()

  // 通知更新任务信息
  public notifyUpdateTask = new Subject<TaskInfo>();

  // 通知更新用户信息
  public notifyUserInfoUpdated = new Subject<UserInfo>();

  jsonHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  formHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  DEVICE_ID = '9AD89D0791C59431';

  userInfo: UserInfo = new UserInfo(); // 用户信息
  defaultProject: Project = null; // 默认选中的项目

  projects: Array<Project> = []; // 用户项目列表
  redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    const temp = JSON.parse(localStorage.getItem(DEFAULT_PROJECT));
    if (temp) {
      this.defaultProject = temp;
    }

    const user = JSON.parse(localStorage.getItem(USER_INFO));
    if (user) {
      this.userInfo = user;
    }

  }

  cacheTasks(tasks: Array<Task>) {
    lruCache.set('tasks', JSON.stringify(tasks))
  }

  /**
   * 获取最后登录的用户名
   */
  getLastUsername(): string {
    return localStorage.getItem(LAST_USERNAME);
  }

  // 登录小蜜蜂
  loginBee(username: string, password: string): Observable<UserInfo> {
    const body: HttpParams = new HttpParams()
      .set('devId', this.DEVICE_ID)
      .set('userAccount', username)
      .set('password', password);

    return this.http.post<HttpResponse<UserInfo>>(`bee/login/userLogin`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            localStorage.setItem(USER_INFO, JSON.stringify(event.result));
            localStorage.setItem(LAST_USERNAME, username); // 保存最后登录的用户名
            this.userInfo = event.result;
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        }),
      );
  }

  // 请求刷新用户信息
  refreshUserInfo() {
    this.getUserInfo()
      .subscribe(res => {
        if (res) {
          res.token = this.userInfo.token;
          this.userInfo = res;
          this.notifyUserInfoUpdated.next(this.userInfo);
        }
      });
  }

  // 获取用户信息
  getUserInfo(): Observable<UserInfo> {
    return this.http.post<HttpResponse<UserInfo>>(`bee/user/userDetail`, new HttpParams(), this.formHttpOptions)
      .pipe(
        flatMap(res => {
          if (res.code === 0) {
            return of(res.result);
          } else {
            return throwError(res.msg);
          }
        })
      );
  }

  // 获取商品列表
  getGifts(): Observable<Array<Gift>> {
    return this.http.post<HttpResponse<Array<Gift>>>(`bee/gift/list`, new HttpParams(), this.formHttpOptions)
      .pipe(
        flatMap(res => {
          if (res.code === 0) {
            return of(res.result);
          } else {
            return throwError(res.msg);
          }
        })
      );
  }

  // 兑换商品
  exchangeGift(giftId: number): Observable<any> {
    const body: HttpParams = new HttpParams()
      .set('giftId', giftId.toString());
    return this.http.post<HttpResponse<Array<Gift>>>(`bee/user/exchangeGift`, body, this.formHttpOptions)
      .pipe(
        flatMap(res => {
          if (res.code === 0) {
            return of(res.result);
          } else {
            return throwError(res.msg);
          }
        })
      );
  }

  // 从小蜜蜂获取搜索代办事项
  getTasks(): Observable<Array<Task>> {
    if (lruCache.get('tasks')) { // 页面切换时才会有效
      return of(JSON.parse(lruCache.get('tasks')))
    }
    const body: HttpParams = new HttpParams()
      .set('pageNo', '1')
      .set('pageSize', '100') // 为加快速度只获取最近100条
      .set('userId', this.userInfo.id.toString());
    return this.http.post<HttpResponse<Array<Task>>>(`bee/user/historyCreate`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            lruCache.set('tasks', JSON.stringify(event.result))
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 获取所有项目
  getProjects(): Observable<Array<Project>> {
    if (lruCache.get('projects')) {
      const projects = JSON.parse(lruCache.get('projects'))
      return of(projects)
    }
    return this.http.post<HttpResponse<Array<Project>>>(`bee/user/myProjects`,
      {}, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            lruCache.set('projects', JSON.stringify(event.result))
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 获取已关闭的项目
  getClosedProjects(): Observable<Array<Project>> {
    if (lruCache.get('sub_projects')) {
      return of(JSON.parse(lruCache.get('sub_projects')))
    }
    return this.http.post<HttpResponse<Array<Project>>>(`bee/user/myCloseProjects`,
      {}, this.formHttpOptions)
      .pipe(
        flatMap(res => {
          if (res.code === 0) {
            lruCache.set('sub_projects', JSON.stringify(res.result))
            return of(res.result);
          } else {
            return throwError(res.msg);
          }
        })
      );
  }

  // 创建休假
  createVacation(startDate: Date, endDate: Date): Observable<any> {
    const body: HttpParams = new HttpParams()
      .set('beginDate', format(startDate, 'yyyy-MM-dd'))
      .set('attachments', '')
      .set('taskContent', '休假')
      .set('endDate', format(endDate, 'yyyy-MM-dd'))
      .set('userIds', this.userInfo.id.toString())
      .set('createMore', '0')
      .set('projectId', '1')
      .set('taskType', '1')  // 1 普通任务 2 风险
      .set('restFlag', '1') // 1、休假任务  0或不传表示正常任务
      .set('alarmFlag', '0');
    return this.http.post<HttpResponse<any>>(`bee/task/operate`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 创建任务
  createTask(taskCreate: TaskCreate): Observable<any> {
    let body: HttpParams = new HttpParams()
      .set('beginDate', format(taskCreate.date, 'yyyy-MM-dd'))
      .set('attachments', '')
      .set('taskContent', taskCreate.content)
      .set('endDate', format(taskCreate.date, 'yyyy-MM-dd'))
      .set('userIds', this.userInfo.id.toString())
      .set('createMore', '1')
      .set('taskType', '1')  // 1 普通任务 2 风险
      .set('restFlag', '0') // 1、休假任务  0或不传表示正常任务
      .set('alarmFlag', '0');
    if (taskCreate.parent) {
      body = body.set('projectId', taskCreate.parent.projectId.toString())
        .set('subProjectId', taskCreate.project.projectId.toString());
    } else {
      body = body.set('projectId', taskCreate.project.projectId.toString());
    }
    return this.http.post<HttpResponse<any>>(`bee/task/operate`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            /*            localStorage.setItem(DEFAULT_PROJECT, JSON.stringify(project));
                        this.defaultProject = project;*/
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 更新任务
  updateTask(taskInfo: TaskInfo): Observable<any> {
    const body: HttpParams = new HttpParams()
      .set('beginDate', format(parse(taskInfo.beginDate, 'yyyy-MM-dd HH:mm:ss', new Date()), 'yyyy-MM-dd'))
      .set('attachments', '')
      .set('taskContent', taskInfo.content)
      .set('endDate', format(parse(taskInfo.endDate, 'yyyy-MM-dd HH:mm:ss', new Date()), 'yyyy-MM-dd'))
      .set('userIds', this.userInfo.id.toString())
      .set('taskType', taskInfo.taskType.toString())
      .set('subProjectId', taskInfo.subProjectId ? taskInfo.subProjectId.toString() : '0')
      .set('projectId', taskInfo.projectId.toString())
      .set('alarmFlag', '0')
      .set('taskId', taskInfo.id)
    return this.http.post<HttpResponse<any>>(`bee/task/operate`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 删除任务
  deleteTask(taskId: string) {
    const body: HttpParams = new HttpParams()
      .set('taskId', taskId);
    return this.http.post<HttpResponse<any>>(`bee/task/deleteTask`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 获取末日的任务列表 2020-01-20 0、任何类型 1、正常 2、关闭 3、延期 4、未关闭（正常 + 延期）
  getTasksByDate(date: Date, state: number): Observable<Array<Task>> {
    const body: HttpParams = new HttpParams()
      .set('searchDate', format(date, 'yyyy-MM-dd'))
      .set('state', state.toString())
      .set('userId', this.userInfo.id.toString());
    return this.http.post<HttpResponse<Array<any>>>(`bee/task/list`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            if (event.result.length === 0) {
              return of([]);
            }
            const taskDetailReqs = event.result.map(task => {
              const body2: HttpParams = new HttpParams()
                .set('taskId', task.id.toString());
              return this.http.post<HttpResponse<TaskInfo>>(`bee/task/detail`, body2, this.formHttpOptions);
            });
            return forkJoin(taskDetailReqs)
              .pipe(
                flatMap(results => {
                  const resArr: Array<Task> = [];
                  results.forEach((res, index) => {
                    if (res.code === 0) {
                      const task: Task = new Task();
                      task.createTime = '';
                      task.userNames = '';
                      task.startTime = res.result.beginDate;
                      task.id = event.result[index].id;
                      task.endTime = res.result.endDate;
                      task.state = res.result.state;
                      task.projectName = res.result.projectName;
                      task.title = res.result.content;
                      task.type = res.result.taskType;
                      task.typeState = res.result.taskType;
                      task.projectId = res.result.projectId;
                      task.workHours = res.result.workHours;
                      task.hours = 0;
                      resArr.push(task);
                    }
                  });
                  return of(resArr);
                })
              );
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 获取任务详情
  getTaskInfo(taskId: string): Observable<TaskInfo> {
    const body: HttpParams = new HttpParams()
      .set('taskId', taskId);
    return this.http.post<HttpResponse<TaskInfo>>(`bee/task/detail`, body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            event.result.id = taskId;
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 首次登录
  checkIn(): Observable<any> {
    return this.http.get(`bee/home/entry`)
      .pipe(
        flatMap(event => {
          const res = JSON.parse(JSON.stringify(event));
          if (res.code === 0) {
            return of(res.result);
          } else {
            return throwError(res.msg);
          }
        })
      );
  }

  /**
   *  检查是否可以同步工时
   *  1、不可同步未来的工时
   *  2、周一可同步上一周的工时
   *  3、周二及以后只能同步当前周的工时
   */
  checkSyncOa(taskEndDate: string) {
    const endDate = parse(taskEndDate, 'yyyy-MM-dd HH:mm:ss', new Date())
    const currentDate = new Date();
    const dayOfWeek = getDay(currentDate);  // 0 周日
    const differenceDays = differenceInDays(currentDate, endDate);

    if (differenceDays < 0) { // 不可同步未来的工时
      return false;
    }

    return (dayOfWeek === 1 && differenceDays <= 7) // 周一和上周
      || isSameWeek(currentDate, endDate, Config.dateOptions);
  }

  /**
   * 关闭任务,workHour有时间时需要同步工时
   * @param task 任务
   * @param workHours 任务时长
   */
  closeTask(task: TaskInfo, workHours: number = 0): Observable<ScoreAndExp> {
    const taskEndTime = parse(task.endDate, 'yyyy-MM-dd HH:mm:ss', new Date())
    const taskDay = format(taskEndTime, 'yyyy-MM-dd', Config.dateOptions);
    let dayOfWeek: number = getDay(taskEndTime);
    // 周六是7、周日是1
    if (dayOfWeek === 0) {
      dayOfWeek = 7;
    }

    if (workHours) {
      let pn;
      if ('维护项目' === task.projectName) {
        pn = `【${task.projectName}(${task.subProjectName})】`
      } else {
        pn = `【${task.projectName}项目】`
      }
      // oa创建任务
      return this.queryOaTask(parse(task.endDate, 'yyyy-MM-dd HH:mm:ss', new Date()),
        parse(task.endDate, 'yyyy-MM-dd HH:mm:ss', new Date()))
        .pipe(
          flatMap(result => {
            if (result.sid === 1) {
              const weeklyData = result.info;
              let targetTask;
              let readOnly = false;
              weeklyData.projectData.some(project => {
                (project as any).saveOrSubmit = '2';

                if (project.date === taskDay) {
                  project.tasks.some((t) => {
                    if (t.taskName === `${pn}${task.content}`) {
                      targetTask = t;
                      return true;
                    }
                  });

                  if (targetTask) {
                    if ('0' === targetTask.dateFlag[dayOfWeek - 1]) {
                      // 已提交，无法编辑
                      readOnly = true;
                      return true;
                    }
                    targetTask.hours = workHours;
                    targetTask.operate = '结项';
                  } else {
                    targetTask = {
                      class: 'com.keda.littlebee.model.oa.OATask',
                      hours: '0',
                      projectName: task.oaProjectName,
                      projectCode: task.oaProjectCode,
                      dateFlag: ['0', '0', '0', '0', '0', '0', '0'], // 依次是 周一 ~ 周日
                      operate: '结项',
                      endDate: taskDay,
                      startDate: taskDay,
                      taskCode: 'TMP' + Date.now(),
                      taskName: `${pn}${task.content}`
                    };
                    targetTask.dateFlag[dayOfWeek - 1] = '1';
                  }
                  return true;
                }
              });

              if (readOnly) {
                return throwError('已提交相同任务，不可重复提交~');
              }

              if (targetTask && targetTask.taskCode.startsWith('TMP')) {
                weeklyData.projectData.forEach(project => {
                  const addTask = JSON.parse(JSON.stringify(targetTask));
                  if (project.date === taskDay) {
                    addTask.hours = workHours;
                  } else {
                    addTask.hours = '0';
                  }
                  project.tasks.push(addTask);
                });
              }
              return this.saveOaTask(weeklyData); // oa关闭任务
            } else {
              return throwError(result.desc);
            }
          }),
          flatMap(result => {
            if (result.sid === 1) {
              return this.closeBeeTask(task, workHours, taskDay);
            } else {
              return throwError(result.desc);
            }
          })
        );
    } else {
      // 　小蜜蜂关闭任务
      return this.closeBeeTask(task, workHours, taskDay);
    }
  }

  /**
   * 查询oa任务
   * 按周进行查询，小于一周算是一周
   */
  queryOaTask(startDate: Date, endDate: Date) {
    const beginWeekDay = format(startOfWeek(startDate, Config.dateOptions), 'yyyy-MM-dd', Config.dateOptions);
    const endWeekDay = format(endOfWeek(endDate, Config.dateOptions), 'yyyy-MM-dd', Config.dateOptions);
    const paramsBody = {
      account: this.userInfo.userAccount,
      begintime: beginWeekDay,
      endtime: endWeekDay,
      class: '.daily.plm.QueryCondition'
    };

    const body: HttpParams = new HttpParams({encoder: new CustomEncoder()})
      .set('VER', '4.24')
      .set('OS', 'ANDROID')
      .set('vkey', this.userInfo.token)
      .set('devId', this.DEVICE_ID)
      .set('account', this.userInfo.userAccount)
      .set('method', 'GetPlmReportByWeek')
      .set('params', this.desEncrypt(JSON.stringify(paramsBody)));
    return this.http.post<any>(`oa/interface/mobile.do?action=dailyplm`, body, this.formHttpOptions);
  }

  /**
   * 创建并关闭oa任务
   */
  saveOaTask(weeklyData) {
    const weeklyDataString = JSON.stringify(weeklyData)
      .replace(/.daily.plm.WeeklyData/g, 'com.keda.littlebee.model.oa.WeeklyData')
      .replace(/.daily.plm.ProjectData/g, 'com.keda.littlebee.model.oa.ProjectData')
      .replace(/.daily.plm.Task/g, 'com.keda.littlebee.model.oa.OATask');
    const body: HttpParams = new HttpParams({encoder: new CustomEncoder()})
      .set('VER', '4.24')
      .set('OS', 'ANDROID')
      .set('vkey', this.userInfo.token)
      .set('devId', this.DEVICE_ID)
      .set('account', this.userInfo.userAccount)
      .set('method', 'SaveReport')

      .set('params', this.desEncrypt(weeklyDataString));
    return this.http.post<any>(`oa/interface/mobile.do?action=dailyplm`, body, this.formHttpOptions);
  }

  /**
   * 关闭小蜜蜂任务
   * @param task 任务
   * @param workHours 工时
   * @param recordDate 工时所属日期
   */
  closeBeeTask(task: TaskInfo, workHours, recordDate: string): Observable<ScoreAndExp> {
    const body: HttpParams = new HttpParams()
      .set('taskId', task.id.toString())
      .set('recordDate', recordDate) // 工时所属日期
      .set('workHours', workHours.toString());
    return this.http.post<HttpResponse<ScoreAndExp>>(`bee/task/close`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 获取订餐信息

  getDinnerOrder() {
    const paramsBody = {
      userEmail: this.userInfo.userAccount,
      class: '.kmoa.MealRequest'
    };

    const body: HttpParams = new HttpParams({encoder: new CustomEncoder()})
      .set('VER', '4.24')
      .set('OS', 'ANDROID')
      .set('vkey', this.userInfo.token)
      .set('devId', this.DEVICE_ID)
      .set('account', this.userInfo.userAccount)
      .set('method', 'GetMealOrder')
      .set('params', this.desEncrypt(JSON.stringify(paramsBody)));

    return this.http.post(`oa/interface/mobile.do?action=kmoa`, body, this.formHttpOptions);
  }

  // 更改订餐信息
  orderDinner(isOrder: number) {
    const paramsBody = {
      clientType: 'android',
      isOrder: isOrder === 1 ? '1' : '0',
      userEmail: this.userInfo.userAccount,
      class: '.kmoa.MealRequest'
    };
    const body: HttpParams = new HttpParams({encoder: new CustomEncoder()})
      .set('VER', '4.24')
      .set('OS', 'ANDROID')
      .set('vkey', this.userInfo.token)
      .set('devId', this.DEVICE_ID)
      .set('account', this.userInfo.userAccount)
      .set('method', 'OrderMeal')
      .set('params', this.desEncrypt(JSON.stringify(paramsBody)));

    return this.http.post(`oa/interface/mobile.do?action=kmoa`, body, this.formHttpOptions);
  }

  // DES 加密
  desEncrypt(message: string): string {
    const result = CryptoJS.DES.encrypt(message, CryptoJS.enc.Utf8.parse('kedacom0'), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    // 60个字符分为一组
    const block = Math.ceil(result.length / 60);
    let temp = '';
    for (let i = 0; i < block; i++) {
      const t = result.substr(i * 60, 60);
      if (i === 0) {
        temp = t;
      } else {
        temp = temp + ' ' + t;
      }
    }
    return temp;
  }

  // DES 解密
  desDecrypt(message) {
    return CryptoJS.DES.decrypt(message.replace(/\s+/g, ''), CryptoJS.enc.Utf8.parse('kedacom0'), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  // 退出登录
  signOut() {
    localStorage.removeItem(USER_INFO)
    this.router.navigate(['/login']);
  }
}

export class UserInfo {
  deptName: string;
  switchMail: number;
  level: number;
  switchPush: number;
  roleId: number; // 1、管理员 2、部门经理 3、项目经理 4、UI设计师 5、开发 6、测试
  deptId: number;
  mobile: string;
  levelName: string;
  switchNotice: number;
  token: string;
  tags: string;
  head = '../../assets/default-avatar.jpg';
  score: number;
  userAccount: string;
  name: string; // 姓名
  id = 38;
  exp: number;
}

export class Task {
  createTime: string;
  userNames: string;
  startTime: string;
  id: number;
  endTime: string;
  /**
   * 1、正常  2、关闭  3、延期
   */
  state: number;
  projectName: string;
  title: string;
  /**
   * 1、项目  2、任务  3、会议 4、周报
   */
  type: number;
  typeState: number;
  projectId: number;
  workHours: number;
  hours: number; // 任务时长
  color: any; // 项目颜色,根据项目id进行区分
}

export class TaskClose {
  task: TaskInfo;
  workHours: number;
}

export class TaskCreate {
  constructor(date: Date, content: string, project: Project, parent: Project) {
    this.date = date;
    this.content = content;
    this.project = project;
    this.parent = parent;
  }

  date: Date;
  content: string;
  project: Project;
  parent: Project;
}

export class Gift {
  id: number;
  img: string;
  leftCount: number;
  name: string;
  price: number;
}

export class ScoreAndExp {
  score: number;
  exp: number;
}

export class Project {
  endDate: string;
  state: number;
  projectName: string;
  projectId: number;
  startDate: string;
}

export class HttpResponse<T> {
  code: number;
  msg: string;
  result: T;
}


export class TaskInfo {
  id: string;
  attachments: string;
  endDate: string;
  oaProjectCode: string;
  taskTypeState: number;
  leaders: string;
  content: string;
  alarmFlag: number;
  beginDate: string;
  taskType: number;
  createBy: string;
  oaProjectName: string;
  leaderIds: string;
  createById: number;
  state: number;
  projectName: string;
  projectId: number;
  subProjectId: number;
  subProjectName: string;
  workHours: number;
}

export class Daily {
  date: Date;
  events: Array<Task> = [];
  lunar: string; // 阴历
  currentMonth: boolean; // 属于当前月
  today: boolean; // 是否是当天
  workDay: boolean; // 工作日
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
