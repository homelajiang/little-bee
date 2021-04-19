import {Component, OnInit} from '@angular/core';
import {BeeService} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {Observable} from 'rxjs';
import {getDay, isAfter, isBefore} from 'date-fns';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-dinner',
  templateUrl: './dinner.component.html',
  styleUrls: ['./dinner.component.css']
})
export class DinnerComponent implements OnInit {

  isOrder = false;
  readonly = false;
  moreAction = false;
  actionUrl = ''
  tips = ''
  isLoading = true;
  weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekDay = ''
  weekMealOrder = []
  mealOrder

  constructor(private beeService: BeeService, private snackBar: SnackBar) {
  }

  ngOnInit() {

    const today = new Date()
    this.currentWeekDay = this.weekDays[getDay(today)]

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

    this.getMealOrder()
  }

  switchOrder() {
    if (this.moreAction) {
      window.open(this.actionUrl)
      return;
    }

    if (this.readonly) {
      this.snackBar.tips('当前不可操作')
      return;
    }
    this.handleOrderRes(this.beeService.orderDinner(this.isOrder ? 0 : 1), true);
  }

  getOrderDesc() {

    if (this.moreAction) {
      return '点击进入'
    }

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


  private handleOrderRes(observable: Observable<any>, showTips: boolean = false) {
    this.isLoading = true
    observable.subscribe(r => {
      const res = JSON.parse(JSON.stringify(r))
      if (res.sid === 1) {
        this.isOrder = res.info.isOrder === '1'
        this.readonly = res.info.readonly === '1'
        if (res.info.qUrl && res.info.qMsg) {
          this.moreAction = true
          this.actionUrl = res.info.qUrl
          this.tips = res.info.qMsg
        } else {
          if (showTips) {
            this.snackBar.tipsSuccess(this.isOrder ? '订餐成功' : '已取消订餐')
          }
        }
      } else {
        this.snackBar.tipsError(res.desc)
      }
    }, error => {
      this.snackBar.tipsError(error)
    }, () => {
      this.isLoading = false
    })
  }

  private getMealOrder() {
    this.beeService.getMealOrder()
      .subscribe(res => {
        this.weekMealOrder = res
        this.mealOrder = this.weekMealOrder[this.currentWeekDay]
      })
  }

  getMealDes(key: string): string {
    return this.mealOrder[key].join().replace(/,/g,' | ')
  }
}
