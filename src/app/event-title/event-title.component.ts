import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WeekSelectEvent} from '../bee/bee.service';

@Component({
  selector: 'app-event-title',
  templateUrl: './event-title.component.html',
  styleUrls: ['./event-title.component.css']
})
export class EventTitleComponent implements OnInit {
  @Input() weekSelectEvent: WeekSelectEvent;
  @Output() weekChanged: EventEmitter<number>;

  constructor() {
  }

  ngOnInit(): void {
  }

}
