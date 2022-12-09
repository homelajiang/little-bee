import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {TaskClose, TaskCreate, TaskInfo, UserInfo} from "../common/bee.entity";
import {Daily, Task} from "../common/bee.entity";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  // 通知刷新某天的task
  public notifyRefreshDaily = new Subject<Date>();

  // 通知关闭某个任务
  public notifyCloseTask = new Subject<TaskClose>();

  // 通知创建任务
  public notifyCreateTask = new Subject<TaskCreate>();

  // 通知删除任务
  public notifyDeleteTask = new Subject<Task>();

  // 通知编辑任务
  public notifyEditTask = new Subject<TaskInfo>();

  // 通知更新任务信息
  public notifyUpdateTask = new Subject<TaskInfo>();

  // 通知更新用户信息
  public notifyUserInfoUpdated = new Subject<UserInfo>();
  constructor() { }
}
