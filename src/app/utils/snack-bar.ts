import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackBar {

  constructor(private snackBar: MatSnackBar) {
  }

  static open(snack: MatSnackBar, msg: string) {
    snack.open(msg, '', {duration: 2000});
  }

  tips(msg: string, action?: string, config?: MatSnackBarConfig) {
    this.snackBar.open(msg, action, config)
  }

  tipsError(msg: string, action?: string, config?: MatSnackBarConfig) {
    this.snackBar.open(msg, action, config)
  }

  tipsSuccess(msg: string, action?: string, config?: MatSnackBarConfig) {
    this.snackBar.open(msg, action, config)
  }

  tipsForever(msg: string, action?: string) {
    return this.snackBar.open(msg, action, {duration: 0})
  }

}
