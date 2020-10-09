import {Component, OnInit} from '@angular/core';
import {BeeService, Gift} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {ConfirmDialog} from '../utils/confirm-dialog';
import {MatDialog} from '@angular/material/dialog';
import {filter, flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public gifts: Array<Gift> = [];

  constructor(private matDialog: MatDialog, private beeService: BeeService, private snackBar: SnackBar) {
  }

  ngOnInit(): void {
    this.beeService.getGifts()
      .subscribe(res => {
        this.gifts = res
      }, error => {
        this.snackBar.tipsError(error)
      })
  }

  exchangeGift(gift: Gift) {
    if (this.beeService.userInfo.score < gift.price) {
      this.snackBar.tipsError('积分不足')
      return
    }
    ConfirmDialog.open(this.matDialog, '确定兑换', '', '提示')
      .afterClosed()
      .pipe(
        filter(ok => {
          return ok;
        }),
        flatMap(() => {
          return this.beeService.exchangeGift(gift.id)
        })
      )
      .subscribe(() => {
        this.snackBar.tipsSuccess('兑换成功')
      }, error => {
        this.snackBar.tipsError(error)
      }, () => {
        this.beeService.refreshUserInfo()
      })
  }
}
