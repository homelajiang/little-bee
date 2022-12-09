import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BeeColor, Daily, Task} from "../../common/bee.entity";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  endOfWeek, isAfter, isBefore, isEqual, isSameDay, isSameMonth, parse,
  startOfMonth,
  startOfWeek
} from "date-fns";
import {DateConfig} from "../../common/config";
import {BeeService} from "../../service/bee.service";
import {SnackBar} from "../../common/snack-bar";
import {tr} from "date-fns/locale";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-daily-calendar',
  templateUrl: './daily-calendar.component.html',
  styleUrls: ['./daily-calendar.component.css']
})
export class DailyCalendarComponent implements OnInit {
  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  private rows = 0; // 日历行数
  displayDays: Array<Array<Daily>> = [] // 二维日历
  private listDays: Array<Daily> = [] //一维日历
  private today = new Date(); // 当前日期
  currentDate = new Date(this.today); // 正在使用的日期
  private tasks: Array<Task> = []; // 任务列表
  public selectWeek: Array<Daily> = []; // 选中的周
  private projectColorMap: any = {};
  private assignColorIndex = 0;
  private reqTasking = false
  // 选中一周
  @Output() selectWeekEvent = new EventEmitter<Array<Daily>>();

  // 选中一天
  @Output() selectDailyEvent = new EventEmitter<Daily>();
  private refreshTaskEvent: Subscription | undefined;
  private createTaskEvent: Subscription | undefined;
  private closeTaskEvent: Subscription | undefined;
  private deleteTaskEvent: Subscription | undefined;
  private editTaskEvent: Subscription | undefined;
  private updateTaskEvent: Subscription | undefined;

  constructor(private beeService: BeeService, private snackBar: SnackBar) {
  }

  ngOnInit(): void {
    this.setUpCalendar(true)
    this.subscribeEvent();
    this.refreshProjects();
  }

  private subscribeEvent() {
    // 刷新指定日期的任务
    /*    this.refreshTaskEvent = this.beeService.notifyRefreshDaily.subscribe(date => {
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

                // 更新缓存
                this.beeService.cacheTasks(this.tasks);
              });
          }
        }*/
  }

  setUpCalendar(onInit: boolean) {
    const startMonthDay = startOfMonth(this.currentDate); // 当月开始日期
    const endMonthDay = endOfMonth(this.currentDate); // 当月结束日期
    const startWeekDay = startOfWeek(startMonthDay, DateConfig.dateOptions)
    const endWeekDay = endOfWeek(endMonthDay, DateConfig.dateOptions)
    const betweenDays = differenceInDays(endWeekDay, startWeekDay)

    this.rows = (betweenDays + 1) / 7; // 日历行数
    this.displayDays = new Array(this.rows)
    this.listDays = []

    let day = startWeekDay;

    for (let row = 0; row < this.rows; row++) {
      const arr = [];
      let currentWeek = false

      for (let column = 0; column < 7; column++) {
        const daily = new Daily(day, isSameMonth(day, this.currentDate), isSameDay(day, this.today))
        arr[column] = daily
        this.listDays.push(daily)

        if (daily.today && onInit) {
          currentWeek = true
        }
        day = addDays(day, 1)
      }

      if (onInit && currentWeek) {
        this.selectWeek = arr
        this.selectWeekEvent.emit(this.selectWeek)
      }
      this.displayDays[row] = arr
    }

    if (this.tasks.length === 0) {
      this.getTasks();
    } else {
      this.setSelectedMonthTasks()
    }


  }

  private getTasks() {
    if (this.reqTasking) return;
    this.reqTasking = true
    this.beeService.getTasks()
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks
          this.setSelectedMonthTasks()
        },
        error: (err) => {
          this.snackBar.tipsError(err.toString())
        },
        complete: () => {
          this.reqTasking = false
        }
      })
  }

  private setSelectedMonthTasks() {
    this.tasks.forEach(task => {
      this.assignProjectColor(task);
      this.listDays.forEach(daily => {
        const startDate = parse(task.startTime, 'yyyy-MM-dd HH:mm:ss', new Date());
        const endDate = parse(task.endTime, 'yyyy-MM-dd HH:mm:ss', new Date());
        // 三种情况可以判断任务属于当天
        const nextDate = addDays(daily.date, 1);
        const inStart = (isAfter(startDate, daily.date) || isEqual(startDate, daily.date)) &&
          isBefore(startDate, nextDate);
        const inEnd = isAfter(endDate, daily.date) && isBefore(endDate, nextDate);
        const inMiddle = isBefore(startDate, daily.date) && isAfter(endDate, nextDate);

        if (inStart || inMiddle || inEnd) {
          daily.tasks.push(task);
        }
        if (daily.today) {
          this.selectDailyEvent.emit(daily);
        }
      })
    })
  }

  preMonth() {
    this.currentDate = addMonths(this.currentDate, -1)
    this.setUpCalendar(false)
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1)
    this.setUpCalendar(false)
  }

  private assignProjectColor(task: Task) {
    if (!this.projectColorMap[task.projectId]) {
      if (task.type === 6) {
        this.projectColorMap[task.projectId] = BeeColor.vacationColor;
      } else {
        this.projectColorMap[task.projectId] =
          BeeColor.colorPool()[this.assignColorIndex % BeeColor.colorPool().length];
        // this.colorPool[this.randomNum(0, this.colorPool.length - 1)];
        this.assignColorIndex++;
      }
    }

    if (task.type === 6) {
      task.projectName = '休假';
    }
    task.color = this.projectColorMap[task.projectId];
  }


  private refreshProjects() {
    // TODO
  }
}
