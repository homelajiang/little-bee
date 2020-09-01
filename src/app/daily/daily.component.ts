import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef, Injector, OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ComponentPortal, PortalInjector, TemplatePortal} from '@angular/cdk/portal';
import {CdkOverlayOrigin, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {NewTaskComponent} from '../new-task/new-task.component';
import {
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  getWeek,
  getISOWeek,
  getDay,
  addDays,
  differenceInDays, addMonths, subMonths, isSameMonth, getMonth, isSameDay, isAfter, isEqual, isBefore, isSameWeek
} from 'date-fns';
import {zhCN} from 'date-fns/locale';
import locale from 'date-fns/esm/locale/zh-CN';
import {BeeService, Task, TaskClose} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {TaskInfoComponent} from '../task-info/task-info.component';
import {TASK_INFO} from '../tokens';
import solarLunar from 'solarLunar';
import {Config} from '../config';
import CryptoJS from 'crypto-js';
import {Subscription} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('originFab', {static: false}) originFab: MatButton;
  private overlayRef: OverlayRef;
  private reqTasking = false;
  private today: Date = new Date(); // 现在日期
  public currentDate: Date = new Date(this.today); // 当前使用日期
  private sundayIsFirstDay = false; // 星期日是第一天
  private rows; // 行数
  public displayDays: Array<Array<Daily>>;
  private listDays: Array<Daily>; // 列表的形式存储

  public weekdays = [...Array(7).keys()].map(i => locale.localize.day(i, {width: 'abbreviated'}));
  private months = [...Array(12).keys()].map(i => locale.localize.month(i, {width: 'wide'}));

  private tasks: Array<Task> = []; // 任务列表
  private taskChanges: Subscription;
  private closeTaskChnages: Subscription;

  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef,
              private beeService: BeeService, private snackBar: MatSnackBar, private injector: Injector) {
  }

  ngOnInit() {
    if (Config.weekStartsOnMonday) {
      this.weekdays.push(this.weekdays[0]);
      this.weekdays.shift();
    }
    this.updateCalendar();
    // 监听刷新事件
    this.taskChanges = this.beeService.refreshTasks.subscribe((date: Date) => {
      if (date) {
        this.refreshTask(date);
      }
    });

    // 监听关闭任务事件
    this.closeTaskChnages = this.beeService.notifyCloseTask.subscribe((taskClose: TaskClose) => {
      if (taskClose) {
        const temp = this.beeService.closeTask(taskClose.task, taskClose.workHours);
        temp.subscribe(res => {
          SnackBar.open(this.snackBar, '关闭成功');
          this.refreshTask(new Date(taskClose.task.endDate));
        }, error => {
          SnackBar.open(this.snackBar, `关闭失败:${error}`);
          this.refreshTask(new Date(taskClose.task.endDate));
        });
      }
    });
  }

  // 刷新某天的task
  private refreshTask(date: Date) {
    this.beeService.getTasksByDate(date, 0)
      .subscribe(tasks => {
        // console.log(tasks);
        this.listDays.forEach(task => {
          if (isSameDay(date, task.date)) {
            // 删除数据源中的数据
            task.events.forEach(e => {
              const i = this.tasks.indexOf(e);
              this.tasks.splice(i, 1);
            });

            // 添加到数据源中
            this.tasks.push.apply(this.tasks, tasks);
            // console.log(this.tasks);

            task.events = tasks; // 更新视图中的task项
          }
        });
      });
  }

  private getTasks() {
    if (this.reqTasking) {
      return;
    }
    this.reqTasking = true;
    this.beeService.getTasks()
      .subscribe(tasks => {
        this.tasks = tasks;
        this.reqTasking = false;
        this.handleDailyTask();
      }, error => {
        this.reqTasking = false;
        SnackBar.open(this.snackBar, error.toString());
      });
  }

  // 对比当前日期的任务
  private handleDailyTask() {
    this.tasks.forEach(task => {
      this.listDays.forEach(daily => {
        const startDate = new Date(task.startTime);
        const endDate = new Date(task.endTime);
        if ((isAfter(daily.date, startDate) || isEqual(daily.date, startDate)) &&
          (isBefore(daily.date, endDate) || isEqual(daily.date, endDate))) {
          daily.events.push(task);
        }
      });
    });
    // console.log(`当前月：`, this.listDays);

    // 获取oa实际工时
    /*    this.beeService.getOaTaskInfoBatch(this.listDays[0].date, this.listDays[this.listDays.length - 1].date).subscribe(taskBatch => {
          this.listDays.forEach(daily => {
            taskBatch.forEach(t => {
              if (isSameDay(daily.date, new Date(t.date))) {
                daily.events.forEach(event => {
                  t.tasks.forEach(tt => {
                    if (event.title == tt.taskName) {
                      event.hours = tt.hours;
                    }
                  });
                });
              }
            });
          });

          console.log(this.listDays);

        });*/
  }

  updateCalendar() {
    const startMonthDay = startOfMonth(this.currentDate); // 当月的开始
    const endMonthDay = endOfMonth(this.currentDate); // 当月的结束
    const startWeekDay = startOfWeek(startMonthDay, Config.dateOptions); // 当月首周的开始
    const endWeekDay = endOfWeek(endMonthDay, Config.dateOptions); // 当月末周的结束
    const betweenDays = differenceInDays(endWeekDay, startWeekDay);

    this.rows = (betweenDays + 1) / 7; // 确定行数
    this.displayDays = new Array(this.rows);
    this.listDays = [];

    let startDay = startWeekDay;
    for (let row = 0; row < this.rows; row++) {
      const arr = [];
      for (let column = 0; column < 7; column++) {
        const daily = new Daily();
        daily.date = startDay;
        const lunar = solarLunar.solar2lunar(startDay.getFullYear(), startDay.getMonth() + 1, startDay.getDate());
        daily.lunar = lunar.dayCn;
        daily.currentMonth = isSameMonth(this.currentDate, startDay);
        daily.today = isSameDay(this.today, startDay);
        arr[column] = daily;
        this.listDays.push(daily);
        startDay = addDays(startDay, 1);
      }
      this.displayDays[row] = arr;
    }

    // console.log(this.months);
    // console.log(this.listDays);

/*
    console.log(
      `startMonthDay : ${startMonthDay}\n` +
      `endMonthDay : ${endMonthDay}\n` +
      `startWeekDay : ${startWeekDay}\n` +
      `endWeekDay : ${endWeekDay}\n` +
      `betweenDays : ${betweenDays}\n`
    );
*/

    if (this.tasks.length === 0) {
      this.getTasks();
    } else {
      this.handleDailyTask();
    }
  }

  ngAfterViewInit() {


  }

  getMonthString(date: Date) {
    return this.months[getMonth(date)];
  }

  preMonth() {
    this.currentDate = subMonths(this.currentDate, 1);
    this.updateCalendar();
  }

  thisMonth() {
    this.currentDate = this.today;
    this.updateCalendar();
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1);
    this.updateCalendar();
  }

  showMissionInfo(event: any, task: Task) {
    this.createOverlayRef(event);
    const popupComponentPortal = new ComponentPortal(TaskInfoComponent, this.viewContainerRef,
      this.createInjector(task, this.overlayRef));
    this.overlayRef.attach(popupComponentPortal);
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());

    event.stopPropagation();
  }

  newMission(event: any, daily: Daily) {
    this.createOverlayRef(event);
    const popupComponentPortal = new ComponentPortal(NewTaskComponent, this.viewContainerRef,
      this.createInjector({createTime: daily.date}, this.overlayRef));
    this.overlayRef.attach(popupComponentPortal);
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());
  }

  createOverlayRef(event: any) {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    const target = {
      getBoundingClientRect: (): ClientRect => ({
        bottom: event.clientY - event.offsetY + event.target.offsetHeight,
        height: 0,
        left: event.clientX - event.offsetX,
        right: event.clientX - event.offsetX + event.target.offsetWidth,
        top: event.clientY - event.offsetY,
        width: 0,
      }),
    };
    const element = new ElementRef(target);
    this.overlayRef = this.overlay.create({
      backdropClass: 'transparent-drop-bg',
      hasBackdrop: true,
      positionStrategy: this.getFlexiblePosition(element),
      maxHeight: 300,
    });
  }

  createInjector(data: any, overlayRef: OverlayRef): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(OverlayRef, overlayRef);
    injectorTokens.set(TASK_INFO, data);
    return new PortalInjector(this.injector, injectorTokens);
  }

  getFlexiblePosition(element: any) {
    return this.overlay.position().flexibleConnectedTo(element)
      .withLockedPosition()
      // .withFlexibleDimensions(true)
      .withPush(true)
      .withPositions([
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 10,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -10,
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: 10,
          offsetY: -10
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX: -10,
          offsetY: -10
        }
      ]);
  }

  getTaskStateColorClass(state: number) {
    if (state === 2) {
      return 'task-closed';
    } else if (state === 3) {
      return 'task-delay';
    } else {
      return 'task-opened';
    }
  }

  headerClicked(event) {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    if (this.taskChanges) {
      this.taskChanges.unsubscribe();
    }
    if (this.closeTaskChnages) {
      this.closeTaskChnages.unsubscribe();
    }
  }
}

export class Daily {
  date: Date;
  events: Array<Task> = [];
  lunar: string; // 阴历
  currentMonth: boolean; // 属于当前月
  today: boolean; // 是否是当天
  workDay: boolean; // 工作日
}

