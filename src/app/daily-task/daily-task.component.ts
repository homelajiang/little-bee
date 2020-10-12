import {Component, Input, OnInit} from '@angular/core';
import {Daily} from '../daily/daily.component';

@Component({
  selector: 'app-daily-task',
  templateUrl: './daily-task.component.html',
  styleUrls: ['./daily-task.component.css']
})
export class DailyTaskComponent implements OnInit {

  @Input() daily: Daily

  constructor() { }

  ngOnInit(): void {
  }

}
