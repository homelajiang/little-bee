import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';

export class ConfirmDialog {

  static open(dialog: MatDialog, content: string, color?: string,
              title?: string, config?: MatDialogConfig): MatDialogRef<ConfirmDialogComponent, boolean> {
    if (config) {
      config.data = {
        content,
        title,
        color
      };
    } else {
      config = {
        minWidth: '360px',
        maxWidth: '400px',
        data: {
          content,
          title,
          color
        }
      };
    }
    return dialog.open(ConfirmDialogComponent, config);
  }
}
