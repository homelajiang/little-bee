import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Daily} from "../../common/bee.entity";
import {format, isSameMonth, isSameYear} from "date-fns";
import {DateConfig} from "../../common/config";

@Component({
  selector: 'app-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['./sub-toolbar.component.css']
})
export class SubToolbarComponent {

  @Input() week: Array<Daily> = []
  @Output() weekChanged = new EventEmitter<number>();

  getWeekName() {
    if (this.week && this.week.length === 7) {
      const sameMonth = isSameMonth(this.week[0].date, this.week[6].date);
      const sameYear = isSameYear(this.week[0].date, this.week[6].date);
      let res = format(this.week[0].date, 'MMM d', DateConfig.dateOptions);

      if (!sameYear) {
        res += '，' + format(this.week[0].date, 'yyyy', DateConfig.dateOptions);
      }
      res += ' - ';

      if (!sameMonth) {
        res += format(this.week[6].date, 'MMM d，yyyy', DateConfig.dateOptions);
      } else {
        res += format(this.week[6].date, 'd，yyyy', DateConfig.dateOptions);
      }
      return res;
    } else return ''
  }

  newTask() {

  }

  newVacation() {

  }

}
