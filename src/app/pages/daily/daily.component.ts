import { Component } from '@angular/core';
import {Daily} from "../../common/bee.entity";

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent {
  public selectWeek: Array<Daily> = []; // 选中并正在展示的周


  onSelectWeek(week:Array<Daily>){
    this.selectWeek = week
  }
}
