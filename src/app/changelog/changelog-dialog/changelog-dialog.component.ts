import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BeeService, ChangeLog} from '../../bee/bee.service';

@Component({
  selector: 'app-changelog-dialog',
  templateUrl: './changelog-dialog.component.html',
  styleUrls: ['./changelog-dialog.component.css']
})
export class ChangelogDialogComponent implements OnInit {

  log: ChangeLog = null

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private beeService: BeeService) {
    this.log = this.data.log
  }

  ngOnInit(): void {
  }

}
