import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef, Injector,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {CdkOverlayOrigin, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {MatButton} from '@angular/material';
import {NewTodoComponent} from '../new-todo/new-todo.component';
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
  differenceInDays, addMonths, subMonths, isSameMonth, getMonth
} from 'date-fns';
import {zhCN} from 'date-fns/locale';
import locale from 'date-fns/esm/locale/zh-CN';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit, AfterViewInit {
  @ViewChild('originFab', {static: false}) originFab: MatButton;
  private overlayRef: OverlayRef;

  private today: Date = new Date(); // 现在日期
  private currentDate: Date = new Date(this.today); // 当前使用日期
  private sundayIsFirstDay = false; // 星期日是第一天
  private rows; // 行数
  private displayDays: Array<Array<Daily>>;
  private weekStartsOnMonday = true; // 周一为一周的第一天
  private dateOptions: object = {
    locale: zhCN,
    weekStartsOn: this.weekStartsOnMonday ? 1 : 0, // 周一
    // firstWeekContainsDate: 1
  };

  private weekdays = [...Array(7).keys()].map(i => locale.localize.day(i, {width: 'abbreviated'}));
  private months = [...Array(12).keys()].map(i => locale.localize.month(i, {width: 'wide'}));

  constructor(public overlay: Overlay, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.updateCalendar();
  }

  updateCalendar() {
    const startMonthDay = startOfMonth(this.currentDate); // 当月的开始
    const endMonthDay = endOfMonth(this.currentDate); // 当月的结束
    const startWeekDay = startOfWeek(startMonthDay, this.dateOptions); // 当月首周的开始
    const endWeekDay = endOfWeek(endMonthDay, this.dateOptions); // 当月末周的结束
    const betweenDays = differenceInDays(endWeekDay, startWeekDay);

    this.rows = (betweenDays + 1) / 7; // 确定行数
    this.displayDays = new Array(this.rows);

    let startDay = startWeekDay;
    for (let row = 0; row < this.rows; row++) {
      const arr = [];
      for (let column = 0; column < 7; column++) {
        const daily = new Daily();
        daily.date = startDay;
        daily.currentMonth = isSameMonth(this.currentDate, startDay);
        arr[column] = daily;
        startDay = addDays(startDay, 1);
      }
      this.displayDays[row] = arr;
    }

    console.log(this.months);
    console.log(this.displayDays);

    console.log(
      `startMonthDay : ${startMonthDay}\n` +
      `endMonthDay : ${endMonthDay}\n` +
      `startWeekDay : ${startWeekDay}\n` +
      `endWeekDay : ${endWeekDay}\n` +
      `betweenDays : ${betweenDays}\n`
    );
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

  showMissionInfo(){

  }

  newMission(event: any) {
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
    const popupComponentPortal = new ComponentPortal(NewTodoComponent);
    this.overlayRef.attach(popupComponentPortal);
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());
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
}

export class Daily {
  date: Date;
  events: Array<any>;
  Lunar: string; // 阴历
  currentMonth: boolean; // 属于当前月
  workDay: boolean; // 工作日
}

