import {Component, OnInit} from '@angular/core';
import {BeeService, RankUser} from '../bee/bee.service';
import {getQuarter} from 'date-fns';

@Component({
    selector: 'app-work-hour',
    templateUrl: './work-hour.component.html',
    styleUrls: ['./work-hour.component.css']
})
export class WorkHourComponent implements OnInit {

    searchType = '1'// 1 月 2 季度 3 年
    searchDate = new Date()
    quarter = getQuarter(this.searchDate) // 季度
    userRanking: RankUser
    rankingUsers: RankUser[]
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

    private getRanking() {
        this.beeService.getHourRanking(this.searchType, this.searchDate, this.quarter)
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
