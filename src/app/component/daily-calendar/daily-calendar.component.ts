import { Component } from '@angular/core';

@Component({
  selector: 'app-daily-calendar',
  templateUrl: './daily-calendar.component.html',
  styleUrls: ['./daily-calendar.component.css']
})
export class DailyCalendarComponent {
  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
}
