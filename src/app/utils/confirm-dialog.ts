import {ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';

export class ConfirmDialog {

  static open(dialog: MatDialog, data: ConfirmData, config?: MatDialogConfig): MatDialogRef<ConfirmDialogComponent, boolean> {
    if (config) {
      config.data = data;
    } else {
      config = {
        minWidth: '360px',
        maxWidth: '400px',
        data
      };
    }
    return dialog.open(ConfirmDialogComponent, config);
  }
}

export class ConfirmData {

  constructor(title: string = '', content: string = '',
              negativeText: string = '取消',
              positiveText: string = '确定',
              color: string = 'primary') {
    this.title = title;
    this.content = content;
    this.color = color;
    this.positiveText = positiveText;
    this.negativeText = negativeText;
  }

  title = ''
  content = ''
  color = 'primary'
  positiveText = '确定'
  negativeText = '取消'
}
