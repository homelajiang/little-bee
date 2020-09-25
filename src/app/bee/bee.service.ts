import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParameterCodec, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, of, Subject, throwError} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {
  addDays,
  differenceInDays,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  isSameWeek,
  startOfWeek
} from 'date-fns';
import {Config} from '../config';
import CryptoJS from 'crypto-js';
import {Daily} from "../daily/daily.component";

const DEFAULT_PROJECT = 'default_project';
const USER_INFO = 'user_info';

@Injectable({
  providedIn: 'root'
})
export class BeeService {

  // 通知刷新某天的task
  public refreshTasks = new Subject<Date>();

  // 通知关闭某个任务
  public notifyCloseTask = new Subject<TaskClose>();

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
  projects: Array<Project> = []; // 用户项目列表
  defaultProject: Project = null; // 默认选中的项目
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
            this.userInfo = event.result;
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        }),
      );
  }

  // 从小蜜蜂获取搜索代办事项
  getTasks(): Observable<Array<Task>> {
    const body: HttpParams = new HttpParams()
      .set('pageNo', '1')
      .set('pageSize', '100') // 为加快速度只获取最近100条
      .set('userId', this.userInfo.id.toString());
    return this.http.post<HttpResponse<Array<Task>>>(`bee/user/historyCreate`,
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

  // 获取所有项目
  getProjects(): Observable<Array<Project>> {
    return this.http.post<HttpResponse<Array<Project>>>(`bee/user/myProjects`,
      {}, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            this.projects = event.result;
            return of(event.result);
          } else {
            return throwError(event.msg);
          }
        })
      );
  }

  // 创建任务
  createTask(date: Date, content: string, project: Project): Observable<any> {
    const body: HttpParams = new HttpParams()
      .set('beginDate', format(date, 'yyyy-MM-dd'))
      .set('attachments', '')
      .set('taskContent', content)
      .set('endDate', format(date, 'yyyy-MM-dd'))
      .set('userIds', this.userInfo.id.toString())
      .set('createMore', '1')
      .set('taskType', '1')  // 1 普通任务 2 风险
      .set('restFlag', '0') // 1、休假任务  0或不传表示正常任务
      .set('projectId', project.projectId.toString())
      .set('alarmFlag', '0');
    // TODO 支持子项目
    // TODO 支持休假
    // params.put("subProjectId", childProjectId); 只有维护项目才传子项目id
    return this.http.post<HttpResponse<any>>(`bee/task/operate`,
      body, this.formHttpOptions)
      .pipe(
        flatMap(event => {
          if (event.code === 0) {
            localStorage.setItem(DEFAULT_PROJECT, JSON.stringify(project));
            this.defaultProject = project;
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
                      const task: Task = {
                        createTime: '',
                        userNames: '',
                        startTime: res.result.beginDate,
                        id: event.result[index].id,
                        endTime: res.result.endDate,
                        state: res.result.state,
                        projectName: res.result.projectName,
                        title: res.result.content,
                        type: res.result.taskType,
                        typeState: res.result.taskType,
                        projectId: res.result.projectId,
                        workHours: res.result.workHours,
                        hours: 0
                      };
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

  /**
   *  检查是否可以同步工时
   *  1、不可同步未来的工时
   *  2、周一可同步上一周的工时
   *  3、周二及以后只能同步当前周的工时
   */
  checkSyncOa(taskEndDate: Date | string) {
    const endDate = new Date(taskEndDate);
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
    const taskEndTime = new Date(task.endDate);
    const taskDay = format(taskEndTime, 'yyyy-MM-dd', Config.dateOptions);
    let dayOfWeek: number = getDay(taskEndTime);
    // 周六是7、周日是1
    if (dayOfWeek === 0) {
      dayOfWeek = 7;
    }

    if (workHours) {
      // oa创建任务
      return this.queryOaTask(new Date(task.endDate), new Date(task.endDate))
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
                    if (t.taskName === `【${task.projectName}】${task.content}`) {
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
                      taskName: `【${task.projectName}】${task.content}`
                    };
                    targetTask.dateFlag[dayOfWeek - 1] = '1';
                  }
                  return true;
                }
              });

              if (readOnly) {
                return throwError('已提交， 无法编辑');
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
      .set('params', this.desEncrypt(JSON.stringify(paramsBody), 'kedacom0'));
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

      .set('params', this.desEncrypt(weeklyDataString, 'kedacom0'));
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

  // DES 加密
  desEncrypt(message: string, key: string): string {
    const result = CryptoJS.DES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
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
  desDecrypt(message, key) {
    return CryptoJS.DES.decrypt(message.replace(/\s+/g, ''), CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  // 退出登录
  signOut() {
    localStorage.clear();
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
}

export class WeekSelectEvent {
  daily: Daily;
  weekDaily: Array<Daily>;

  constructor(d: Daily, week: Array<Daily>) {
    this.daily = d;
    this.weekDaily = week;
  }
}

export class TaskClose {
  task: TaskInfo;
  workHours: number;
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
  workHours: number;
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
