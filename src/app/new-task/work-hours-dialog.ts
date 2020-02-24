import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {SnackBar} from '../utils/snack-bar';

@Component({
  selector: 'app-work-hours-dialog',
  templateUrl: 'work-hours-dialog.html',
  styleUrls: ['./work-hours-dialog.css']

})
export class WorkHoursDialogComponent {
  workHours: number;

  constructor(public dialogRef: MatDialogRef<WorkHoursDialogComponent>,
              public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  closeDialog() {
    this.dialogRef.close();
  }

  ensureDialog() {
    if (this.workHours <= 0 || !this.workHours) {
      SnackBar.open(this.snackBar, '工时格式不正确');
      this.workHours = undefined;
      return;
    }

    if (this.workHours > 24) {
      SnackBar.open(this.snackBar, '你一天超过24小时？！ 你咋不上天呢！');
      this.workHours = undefined;
      return;
    }
    this.dialogRef.close(this.workHours);
  }
}
