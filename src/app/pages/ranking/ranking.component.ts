import {Component, OnInit} from '@angular/core';
import {BeeService} from "../../service/bee.service";
import {RankUser, UserInfo} from "../../common/bee.entity";
import {getQuarter} from "date-fns";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  userInfo: UserInfo;
  searchType = '1'// 1 月 2 季度 3 年
  searchDate = new Date()
  quarter = getQuarter(this.searchDate) // 季度
  userRanking?: RankUser
  rankingUsers: RankUser[] = []
  ranking = '--'
  workHours = '--'

  constructor(private beeService: BeeService) {
    this.userInfo = this.beeService.userInfo
  }

  ngOnInit(): void {
    this.getRanking()
  }

  changeSearchType() {
    this.getRanking()
  }
  getRanking() {
    this.beeService.getWorkHoursRanking(this.searchType, this.searchDate, this.quarter)
      .subscribe(res => {
        res.forEach((value, index) => {
          if (value.userId === this.beeService.userInfo.id) {
            this.userRanking = value
            this.rankingUsers = res
            this.ranking = (index + 1).toString()
            this.workHours = value.workHours.toString()
          }
        })
      })
  }

}
