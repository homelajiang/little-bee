import {Component, OnInit} from '@angular/core';
import {
  addDays, addMonths,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import {zhCN} from 'date-fns/locale';
import {Daily} from '../daily/daily.component';
import solarLunar from 'solarLunar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  // ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  private rows; // 日历行数
  private today: Date = new Date(); // 今天日期
  public displayDays: Array<Array<Daily>>; // 二维本月日期
  private listDays: Array<Daily>; // 一维本月日期
  public selectDaily: Daily; // 点击选中的日期
  public selectWeek: Array<Daily>; // 选中的周

  private dateOptions: object = { // 周一为一周的第一天
    locale: zhCN,
    weekStartsOn: 1, // 周一
    // firstWeekContainsDate: 1
  }

  public currentDate: Date = new Date(this.today); // 当前使用日期


  constructor() {
  }

  ngOnInit(): void {
    this.updateCalendar()
  }

  updateCalendar() {
    const startMonthDay = startOfMonth(this.currentDate); // 当月的开始
    const endMonthDay = endOfMonth(this.currentDate); // 当月的结束
    const startWeekDay = startOfWeek(startMonthDay, this.dateOptions); // 当月第一周周一
    const endWeekDay = endOfWeek(endMonthDay, this.dateOptions); // 当月最后一周周日
    const betweenDays = differenceInDays(endWeekDay, startWeekDay);

    this.rows = (betweenDays + 1) / 7; // 日历行数

    this.displayDays = new Array(this.rows);
    this.listDays = [];

    let day = startWeekDay;

    for (let row = 0; row < this.rows; row++) {
      const arr = [];
      for (let column = 0; column < 7; column++) {
        const daily = new Daily();
        daily.date = day;
        const lunar = solarLunar.solar2lunar(day.getFullYear(), day.getMonth() + 1, day.getDate());
        daily.lunar = lunar.dayCn;
        daily.today = isSameDay(day, this.today)
        daily.currentMonth = isSameMonth(this.today, day);
        arr[column] = daily
        this.listDays.push(daily)
        if (daily.today) {
          this.selectDaily = daily;
        }
        day = addDays(day, 1)
      }
      this.displayDays[row] = arr;
    }
  }


  // 选择一个日期
  onSelectDay(daily: Daily, week: Array<Daily>) {
    this.selectDaily = daily;
    this.selectWeek = week;
  }

  preMonth(){
    this.currentDate = addMonths(this.currentDate, -1);
    this.updateCalendar();
  }

  nextMonth(){
    this.currentDate = addMonths(this.currentDate, 1);
    this.updateCalendar();
  }

}
