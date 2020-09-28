import {Component, OnInit} from '@angular/core';
import {BeeService} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {Observable} from 'rxjs';
import {isAfter, isBefore} from 'date-fns';

@Component({
  selector: 'app-dinner',
  templateUrl: './dinner.component.html',
  styleUrls: ['./dinner.component.css']
})
export class DinnerComponent implements OnInit {

  isOrder = false;
  readonly = false;

  constructor(private beeService: BeeService, private snackBar: SnackBar) {
  }

  ngOnInit() {

    const today = new Date()

    const startDate = new Date(today)
    startDate.setHours(9)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)

    const endDate = new Date(today)
    endDate.setHours(14)
    endDate.setMinutes(0)
    endDate.setSeconds(0)
    endDate.setMilliseconds(0)

    this.readonly = !((isAfter(today, startDate) && isBefore(today, endDate))
      || today === startDate
      || today === endDate)

    this.handleOrderRes(this.beeService.getDinnerOrder())
  }

  switchOrder() {
    if (this.readonly) {
      this.snackBar.tips('当前不可操作')
      return;
    }
    this.handleOrderRes(this.beeService.orderDinner(this.isOrder ? 0 : 1));
  }

  getOrderDesc() {
    if (this.isOrder) {
      return '已预订'
    } else {
      if (this.readonly) {
        return '不可操作'
      } else {
        return '预定'
      }
    }
  }


  private handleOrderRes(observable: Observable<any>) {
    observable.subscribe(r => {
      const res = JSON.parse(JSON.stringify(r))
      if (res.sid === 1) {
        this.isOrder = res.info.isOrder === '1'
        this.readonly = res.info.readonly === '1'

        console.log(`${this.isOrder} - ${this.readonly}`)
      } else {
        this.snackBar.tipsError(res.desc)
      }
    }, error => {
      this.snackBar.tipsError(error)
    })
  }
}
