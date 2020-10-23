import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';
import {Daily} from '../daily/daily.component';
import {
  addDays,
  addMonths, addWeeks,
  differenceInDays,
  endOfMonth,
  endOfWeek, isAfter, isBefore, isEqual,
  isSameDay,
  isSameMonth, isSameWeek, parse, parseJSON,
  startOfMonth,
  startOfWeek, toDate
} from 'date-fns';
import {Config} from '../config';

import solarLunar from 'solarlunar';
import {SnackBar} from '../utils/snack-bar';
import {Overlay} from '@angular/cdk/overlay';
import {BeeService, Task} from '../bee/bee.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {


  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef,
              private beeService: BeeService, private snackBar: SnackBar, private injector: Injector) {
  }

  private rows; // 日历行数
  private today: Date = new Date(); // 今天日期
  public displayDays: Array<Array<Daily>>; // 二维本月日期
  private listDays: Array<Daily>; // 一维本月日期
  public selectWeek: Array<Daily>; // 选中的周
  private tasks: Array<Task> = []; // 任务列表

  public currentDate: Date = new Date(this.today); // 当前使用日期
  // 选中一周
  @Output() selectWeekEvent = new EventEmitter<Array<Daily>>();

  // 选中一天
  @Output() selectDailyEvent = new EventEmitter<Daily>();

  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']; // ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  private colorPool = [
    {primary: '#8365db', secondary: '#eeeaff'},
    {primary: '#5bab75', secondary: '#e0f3e7'},
    // {primary: '#ff562d', secondary: '#fff0e9'},
    {primary: '#29a5d3', secondary: '#e2f5ff'},
    {primary: '#455af7', secondary: '#e5f6ff'},
  ];

  private projectColorMap = {};

  private reqTasking = false;

  private refreshTaskEvent: Subscription;
  private createTaskEvent: Subscription;
  private closeTaskEvent: Subscription;
  private deleteTaskEvent: Subscription;

  ngOnInit(): void {
    this.updateCalendar(true);
    this.subscribeEvent();
  }


  // 选择一周
  onSelectWeek(week: Array<Daily>, column = -1) {
    this.selectWeek = week;
    this.selectWeekEvent.emit(week);

    if (column !== -1) {
      this.selectDailyEvent.emit(week[column]);
    }
  }

  preMonth() {
    this.currentDate = addMonths(this.currentDate, -1);
    this.updateCalendar(false);
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1);
    this.updateCalendar(false);
  }


  changeWeek(event: number) {
    const index = this.displayDays.indexOf(this.selectWeek);
    console.log(index);
    if (event < 0) {
      if (index < 1) { // 需要跳转上一月
        this.preMonth();

        const sameWeek = isSameDay(this.selectWeek[0].date, this.displayDays[this.displayDays.length - 1][0].date);

        // 找到则找倒数第二，否则为倒数第一
        this.onSelectWeek(this.displayDays[this.displayDays.length - (sameWeek ? 2 : 1)]);
      } else {
        this.onSelectWeek(this.displayDays[index - 1]);
      }
    } else if (event > 0) {
      if (index > this.displayDays.length - 2) { // 需要跳转下一月
        this.nextMonth();
        const sameWeek = isSameDay(this.selectWeek[0].date, this.displayDays[0][0].date);

        this.onSelectWeek(this.displayDays[sameWeek ? 1 : 0]);
      } else {
        this.onSelectWeek(this.displayDays[index + 1]);
      }
    }
  }

  weekIsSelected(week: Array<Daily>) {
    return isSameWeek(week[0].date, this.selectWeek[0].date);
  }

  // 订阅事件
  private subscribeEvent() {

    // 刷新指定日期的任务
    this.refreshTaskEvent = this.beeService.notifyRefreshDaily.subscribe(date => {
        if (date) {
          this.beeService.getTasksByDate(date, 0)
            .subscribe(tasks => {

              tasks.forEach(task => {
                this.assignProjectColor(task);
              });

              this.listDays.forEach(daily => {
                if (isSameDay(date, daily.date)) {

                  // 更新任务源数据
                  daily.events.forEach(e => {
                    const index = this.tasks.indexOf(e);
                    this.tasks.splice(index, 1);
                  });
                  this.tasks.push.apply(this.tasks, tasks);

                  // 更新daily数据
                  daily.events = tasks;
                }
              });
            });
        }
      }
    );

    // 关闭任务
    this.closeTaskEvent = this.beeService.notifyCloseTask.subscribe(task => {
      if (task) {
        this.beeService.closeTask(task.task, task.workHours)
          .subscribe(res => {
            this.snackBar.tipsSuccess('关闭成功');
          }, error => {
            this.snackBar.tipsError('关闭失败');
          }, () => {
            this.beeService.notifyRefreshDaily.next(parse(task.task.endDate,'yyyy-MM-dd HH:mm:ss',new Date()));
          });
      }
    });

    // 创建任务
    this.createTaskEvent = this.beeService.notifyCreateTask.subscribe(task => {
      if (task) {
        this.beeService.createTask(task)
          .subscribe(res => {
            this.snackBar.tipsSuccess('创建成功');
          }, error => {
            this.snackBar.tipsSuccess('创建失败');
          }, () => {
            this.beeService.notifyRefreshDaily.next(task.date);
          });
      }
    });

    // 删除任务
    this.deleteTaskEvent = this.beeService.notifyDeleteTask.subscribe(task => {
      console.log(task)
      if (task) {
          this.beeService.deleteTask(task.id.toString())
            .subscribe(res => {
              this.snackBar.tipsSuccess('已删除');
            }, error => {
              this.snackBar.tipsSuccess('删除失败');
            }, () => {
              console.log(task.startTime)
              this.beeService.notifyRefreshDaily.next(parse(task.startTime,'yyyy-MM-dd HH:mm:ss',new Date()));
            });
        }
      }
    );
  }

  updateCalendar(onInit: boolean) {
    const startMonthDay = startOfMonth(this.currentDate); // 当月的开始
    const endMonthDay = endOfMonth(this.currentDate); // 当月的结束
    const startWeekDay = startOfWeek(startMonthDay, Config.dateOptions); // 当月第一周周一
    const endWeekDay = endOfWeek(endMonthDay, Config.dateOptions); // 当月最后一周周日
    const betweenDays = differenceInDays(endWeekDay, startWeekDay);

    this.rows = (betweenDays + 1) / 7; // 日历行数

    this.displayDays = new Array(this.rows);
    this.listDays = [];

    let day = startWeekDay;

    for (let row = 0; row < this.rows; row++) {
      const arr = [];

      let currentWeek = false;
      for (let column = 0; column < 7; column++) {
        const daily = new Daily();
        daily.date = day;
        const lunar = solarLunar.solar2lunar(day.getFullYear(), day.getMonth() + 1, day.getDate());
        daily.lunar = lunar.dayCn;
        daily.today = isSameDay(day, this.today);
        daily.currentMonth = isSameMonth(this.today, day);
        arr[column] = daily;
        this.listDays.push(daily);
        if (daily.today && onInit) { // 初始化时初始化选择日期
          currentWeek = true;
        }
        day = addDays(day, 1);
      }

      if (onInit && currentWeek) {  // 初始化
        this.selectWeek = arr;
        this.selectWeekEvent.emit(this.selectWeek);
      }
      this.displayDays[row] = arr;

      arr.map(value => value.date);
    }

    // 将task和日期对应起来
    if (this.tasks.length === 0) {
      this.getTasks();
    } else {
      this.handleMonthTask();
    }
  }

  private getTasks() {
    if (this.reqTasking) {
      return;
    }
    this.reqTasking = true;
    this.beeService.getTasks()
      .subscribe(tasks => {
        this.tasks = tasks;
        this.handleMonthTask();
        this.reqTasking = false;
      }, error => {
        this.reqTasking = false;
        this.snackBar.tipsError(error.toString());
      });
  }

  // 补全当月的task
  private handleMonthTask() {
    this.tasks.forEach(task => {

      this.assignProjectColor(task);

      this.listDays.forEach(daily => {
        const startDate = parse(task.startTime,'yyyy-MM-dd HH:mm:ss',new Date());
        const endDate = parse(task.endTime,'yyyy-MM-dd HH:mm:ss',new Date());
        if ((isAfter(daily.date, startDate) || isEqual(daily.date, startDate)) &&
          (isBefore(daily.date, endDate) || isEqual(daily.date, endDate))) {
          daily.events.push(task);
        }

        if (daily.today) {
          this.selectDailyEvent.emit(daily);
        }
      });
    });

    console.log(this.projectColorMap)
  }

  private assignProjectColor(task: Task) {
    if (!this.projectColorMap[task.projectId]) {
      this.projectColorMap[task.projectId] =
        this.colorPool[this.randomNum(0, this.colorPool.length - 1)];
    }
    task.color = this.projectColorMap[task.projectId];
  }

  private randomNum(minNum: number, maxNum: number) {
    switch (arguments.length) {
      case 1:
        return parseInt((Math.random() * minNum + 1) + '', 10);
      case 2:
        return parseInt((Math.random() * (maxNum - minNum + 1) + minNum) + '', 10);
      default:
        return 0;
    }
  }


  ngOnDestroy(): void {
    this.refreshTaskEvent.unsubscribe();
    this.createTaskEvent.unsubscribe();
    this.closeTaskEvent.unsubscribe();
    this.deleteTaskEvent.unsubscribe();
  }
}
