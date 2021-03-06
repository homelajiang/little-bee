import {Component, OnInit, ViewChild} from '@angular/core';
import {BeeService, Daily, Task} from '../bee/bee.service';
import {EventTitleComponent} from '../event-title/event-title.component';
import {EventComponent} from '../event/event.component';
import {CalendarComponent} from '../calendar/calendar.component';
import {SnackBar} from '../utils/snack-bar';

@Component({
  selector: 'app-home-calendar',
  templateUrl: './home-calendar.component.html',
  styleUrls: ['./home-calendar.component.css']
})
export class HomeCalendarComponent implements OnInit {


  @ViewChild(EventTitleComponent)
  eventTitleComponent: EventTitleComponent
  @ViewChild(EventComponent)
  eventComponent: EventComponent
  @ViewChild(CalendarComponent)
  calendarComponent: CalendarComponent

  public selectWeek: Array<Daily>; // 选中并正在展示的周
  public selectDaily:Daily; // 选中的Daily

  constructor(private beeService: BeeService, private snackBar: SnackBar) {
  }

  ngOnInit(): void {
    this.checkIn()
  }

  checkIn() {
    this.beeService.checkIn()
      .subscribe(res => {
        if (res) {
          let msg;
          if (res.exp) {
            if (res.score) {
              msg = `Exp +${res.exp} Score +${res.score}`
            } else {
              msg = `Exp +${res.exp}`
            }
          } else if (res.score) {
            msg = `Score +${res.score}`
          }

          if (msg) {
            this.snackBar.tipsSuccess(`每日登录：${msg}`)
          }
        }
      }, () => null, () => {
        this.beeService.refreshUserInfo()
      })
  }

  onSelectWeek(week: Array<Daily>) {
    this.selectWeek = week;
  }

  onSelectDaily(daily: Daily) {
    this.selectDaily = daily
  }

  changeWeek(event: number) {
    this.calendarComponent.changeWeek(event);
  }

}
