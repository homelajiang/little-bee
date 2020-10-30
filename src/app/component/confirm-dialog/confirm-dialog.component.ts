import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmData) {
  }

  ngOnInit() {
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
