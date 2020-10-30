import {ConfirmData, ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';
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
