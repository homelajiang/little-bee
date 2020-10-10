import {Component, OnInit} from '@angular/core';
import {addDays} from 'date-fns';
import {Observable, Subscriber} from 'rxjs';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'app-create-vacation',
  templateUrl: './create-vacation.component.html',
  styleUrls: ['./create-vacation.component.css']
})
export class CreateVacationComponent implements OnInit {

  startDate = new Date()
  endDate

  constructor() {
  }

  ngOnInit(): void {
    this.startDate.setHours(9, 0, 0, 0)
    this.startDate.setHours(9, 0, 0, 0)
    this.endDate = addDays(this.startDate, 1)
    this.endDate.setHours(18)
  }

  changeDate(startDate:boolean,event:MatDatepickerInputEvent<Date>) {
    console.log(event.value)
  }

  changeHour(startDate: boolean, hour: number) {
    if (hour >= 1 && hour <= 24) {
      if (startDate) {
        this.startDate.setHours(hour)
        this.startDate = new Date(this.startDate)
      } else {
        this.endDate.setHours(hour)
        this.endDate = new Date(this.endDate)
      }
    }
  }

}
