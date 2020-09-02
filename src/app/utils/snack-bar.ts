import {MatSnackBar} from "@angular/material/snack-bar";

export class SnackBar {

  static open(snack: MatSnackBar, msg: string) {
    snack.open(msg, '', {duration: 2000});
  }
}
