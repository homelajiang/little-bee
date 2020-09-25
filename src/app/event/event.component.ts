import {Component, Input, OnInit} from '@angular/core';
import {WeekSelectEvent} from '../bee/bee.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() weekSelectEvent: WeekSelectEvent
  public displayWeekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']


  constructor() {
  }

  ngOnInit(): void {
  }

  onWeekSelected(event: WeekSelectEvent) {
    this.weekSelectEvent = event;
  }

}
