import {Component, Input} from '@angular/core';
import {Daily} from "../../common/bee.entity";

@Component({
  selector: 'app-daily-list',
  templateUrl: './daily-list.component.html',
  styleUrls: ['./daily-list.component.css']
})
export class DailyListComponent {
  @Input() week: Array<Daily>=[]
  public displayWeekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

}
