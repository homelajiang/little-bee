import {Component, OnInit} from '@angular/core';
import {BeeService, UserInfo} from '../bee/bee.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  public userInfo: UserInfo

  constructor(private beeService: BeeService) {
  }

  ngOnInit(): void {
    this.userInfo = this.beeService.userInfo
  }

}
