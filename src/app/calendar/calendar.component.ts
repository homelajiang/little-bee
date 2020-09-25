import {Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Daily} from '../daily/daily.component';
import {
  addDays,
  addMonths, addWeeks,
  differenceInDays,
  endOfMonth,
  endOfWeek, isAfter, isBefore, isEqual,
  isSameDay,
  isSameMonth, isSameWeek,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import {Config} from '../config';

import solarLunar from 'solarLunar';
import {SnackBar} from '../utils/snack-bar';
import {Overlay} from '@angular/cdk/overlay';
import {BeeService, Task} from '../bee/bee.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {


  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef,
              private beeService: BeeService, private snackBar: MatSnackBar, private injector: Injector) {
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

  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']; // ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  private reqTasking = false;

  ngOnInit(): void {
    this.updateCalendar(true);
  }


  // 选择一周
  onSelectWeek(week: Array<Daily>) {
    this.selectWeek = week;
    this.selectWeekEvent.emit(week);
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
        SnackBar.open(this.snackBar, error.toString());
      });
  }

  // 不全当月的task
  private handleMonthTask() {
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
  }
}
