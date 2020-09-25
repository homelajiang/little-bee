import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Daily} from '../daily/daily.component';
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import {WeekSelectEvent} from '../bee/bee.service';
import {Config} from '../config';

import solarLunar from 'solarLunar'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  private rows; // 日历行数
  private today: Date = new Date(); // 今天日期
  public displayDays: Array<Array<Daily>>; // 二维本月日期
  private listDays: Array<Daily>; // 一维本月日期
  public selectDaily: Daily; // 点击选中的日期
  public selectWeek: Array<Daily>; // 选中的周

  public currentDate: Date = new Date(this.today); // 当前使用日期
  private weekSelectedEvent: WeekSelectEvent;

  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']; // ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']


  constructor() {
  }

  ngOnInit(): void {
    this.updateCalendar(true)
  }


  // 选择一个日期
  onSelectDay(daily: Daily, week: Array<Daily>) {
    this.selectDaily = daily;
    this.selectWeek = week;
  }

  preMonth() {
    this.currentDate = addMonths(this.currentDate, -1);
    this.updateCalendar(false);
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1);
    this.updateCalendar(false);
  }

  onWeekSelected(event: WeekSelectEvent) {
    this.weekSelectedEvent = event
  }

  preWeek() {

  }

  nextWeek() {

  }

  dailyInWeek(daily: Daily, weekDaily: Array<Daily>) {
    return weekDaily.map(d => d.date).filter(d => isSameDay(d, daily.date)).length === 1
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
        daily.today = isSameDay(day, this.today)
        daily.currentMonth = isSameMonth(this.today, day);
        arr[column] = daily
        this.listDays.push(daily)
        if (daily.today && onInit) { // 初始化时初始化选择日期
          this.selectDaily = daily;
          currentWeek = true;
        }
        day = addDays(day, 1)
      }

      if (onInit && currentWeek) {  // 初始化
        this.selectWeek = arr;
        this.weekSelectedEvent = new WeekSelectEvent(this.selectDaily, this.selectWeek)
      }
      this.displayDays[row] = arr;

      arr.map(value => value.date)
    }
  }
}
