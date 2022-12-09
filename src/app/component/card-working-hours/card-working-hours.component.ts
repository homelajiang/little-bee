import {Component, OnInit} from '@angular/core';
import {BeeService} from "../../service/bee.service";
import {getQuarter} from "date-fns";
import {RankUser} from "../../common/bee.entity";

@Component({
  selector: 'app-card-working-hours',
  templateUrl: './card-working-hours.component.html',
  styleUrls: ['./card-working-hours.component.css']
})
export class CardWorkingHoursComponent implements OnInit{
  searchType = '1'// 1 月 2 季度 3 年
  searchDate = new Date()
  quarter = getQuarter(this.searchDate) // 季度
  userRanking?: RankUser
  rankingUsers: RankUser[] = []
  ranking = '--'
  workHours = '--'

  constructor(private beeService: BeeService) {
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
