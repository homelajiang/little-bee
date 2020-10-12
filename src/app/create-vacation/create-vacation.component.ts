import {Component, OnInit} from '@angular/core';
import {addDays, differenceInDays, format, isAfter} from 'date-fns';
import {SnackBar} from '../utils/snack-bar';
import {ConfirmDialog} from '../utils/confirm-dialog';
import {MatDialog} from '@angular/material/dialog';
import {filter, flatMap} from 'rxjs/operators';
import {BeeService} from '../bee/bee.service';

@Component({
  selector: 'app-create-vacation',
  templateUrl: './create-vacation.component.html',
  styleUrls: ['./create-vacation.component.css']
})
export class CreateVacationComponent implements OnInit {

  startDate = new Date();
  endDate;

  constructor(private snackBar: SnackBar, private matDialog: MatDialog, private beeService: BeeService) {
  }

  ngOnInit(): void {
    this.startDate.setHours(9, 0, 0, 0);
    this.startDate = addDays(this.startDate, 1);
    this.endDate = new Date(this.startDate);
    this.endDate.setHours(18);
  }

  changeDate(start: boolean, event) {
    const date: Date = event.value;
    if (start) {
      this.startDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      this.startDate = new Date(this.startDate);
    } else {
      this.endDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      this.endDate = new Date(this.endDate);
    }
  }

  changeHour(startDate: boolean, hour: number) {
    if (hour >= 1 && hour <= 24) {
      if (startDate) {
        this.startDate.setHours(hour);
        this.startDate = new Date(this.startDate);
      } else {
        this.endDate.setHours(hour);
        this.endDate = new Date(this.endDate);
      }
    }
  }

  applyVacation() {
    if (differenceInDays(this.startDate, this.endDate) > 365) {
      this.snackBar.tipsError('开始时间和结束时间跨度过大');
      return;
    }

    if (this.startDate === this.endDate || isAfter(this.startDate, this.endDate)) {
      this.snackBar.tipsError('结束时间需要大于开始时间');
      return;
    }

    ConfirmDialog.open(this.matDialog,
      `请确认休假时间：</br>
                开始时间：<b>${format(this.startDate, 'yyyy-MM-dd HH:mm')}</b></br>
                结束时间：<b>${format(this.endDate, 'yyyy-MM-dd HH:mm')}</b>`,
      '', '提示')
      .afterClosed()
      .pipe(
        filter(ok => {
          return ok;
        }),
        flatMap(() => {
          return this.beeService.createVacation(this.startDate, this.endDate)
        })
      )
      .subscribe(res => {
        this.snackBar.tipsSuccess('休假创建成功')
      }, error => {
        this.snackBar.tipsError('休假创建失败')
      }, () => {
        this.beeService.notifyRefreshDaily.next(this.startDate)
      });
  }


}
