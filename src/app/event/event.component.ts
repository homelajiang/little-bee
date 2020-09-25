import {Component, Input, OnInit} from '@angular/core';
import {Daily} from '../daily/daily.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() week: Array<Daily>
  public displayWeekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

  constructor() {
  }

  ngOnInit(): void {
  }

}
