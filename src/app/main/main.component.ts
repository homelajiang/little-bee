import {Component, OnInit} from '@angular/core';
import {BeeService, UserInfo} from '../bee/bee.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public userInfo: UserInfo;

  constructor(private beeService: BeeService) {
  }

  ngOnInit() {
    this.userInfo = this.beeService.userInfo;

    this.beeService.notifyUserInfoUpdated.subscribe(userInfo=>{
      this.userInfo = userInfo
    })
  }

  signOut() {
    this.beeService.signOut();
  }
}
