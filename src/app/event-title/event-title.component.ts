import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {format, isSameMonth, isSameYear} from 'date-fns';
import {Config} from '../config';
import {Daily} from '../bee/bee.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateTaskDialogComponent} from '../create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-event-title',
  templateUrl: './event-title.component.html',
  styleUrls: ['./event-title.component.css']
})
export class EventTitleComponent implements OnInit {
  @Input() week: Array<Daily>;
  @Output() weekChanged = new EventEmitter<number>();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  // December 15 - 21,2019
  getDisplayWeekName() {
    if (this.week && this.week.length === 7) {
      const sameMonth = isSameMonth(this.week[0].date, this.week[6].date);
      const sameYear = isSameYear(this.week[0].date, this.week[6].date);
      let res = format(this.week[0].date, 'MMM d', Config.dateOptions);

      if (!sameYear) {
        res += '，' + format(this.week[0].date, 'yyyy', Config.dateOptions);
      }
      res += ' - ';

      if (!sameMonth) {
        res += format(this.week[6].date, 'MMM d，yyyy', Config.dateOptions);
      } else {
        res += format(this.week[6].date, 'd，yyyy', Config.dateOptions);
      }
      return res;
    }
  }

  newTask() {
    this.dialog.open(CreateTaskDialogComponent, {
      disableClose: true,
      data: {}
    })
  }
}
