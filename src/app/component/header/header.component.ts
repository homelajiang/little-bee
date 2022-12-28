import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router:ActivatedRoute) {
    console.log("111111")
    this.router.paramMap
  }

  selectMenuIndex = 0

  menus = [{
    name: '主页',
    link: '/daily',
  }, {
    name: '项目管理',
    link: '/projects',
  }, {
    name: '排行榜',
    link: '/ranking',
  }]


}
