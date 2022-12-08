import {Component, OnInit} from '@angular/core';
import {Daily, Task} from "../../common/bee.entity";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  endOfWeek, isSameDay, isSameMonth,
  startOfMonth,
  startOfWeek
} from "date-fns";
import {DateConfig} from "../../common/config";
import {BeeService} from "../../service/bee.service";

@Component({
  selector: 'app-daily-calendar',
  templateUrl: './daily-calendar.component.html',
  styleUrls: ['./daily-calendar.component.css']
})
export class DailyCalendarComponent implements OnInit {
  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  private rows = 0; // 日历行数
  displayDays: Array<Array<Daily>> = [] // 二维日历
  private listDays: Array<Daily> = [] //一维日历
  private today = new Date(); // 当前日期
  currentDate = new Date(this.today); // 正在使用的日期
  private tasks: Array<Task> = []; // 任务列表
  public selectWeek: Array<Daily>  =[]; // 选中的周

  private colorPool = [
    {primary: '#8365db', secondary: '#eeeaff'},
    {primary: '#5bab75', secondary: '#e0f3e7'},
    {primary: '#29a5d3', secondary: '#e2f5ff'},
    {primary: '#455af7', secondary: '#e5f6ff'},
  ];

  private vacationColor = {primary: '#ff562d', secondary: '#fff0e9'};

  constructor(private beeService:BeeService) {
  }

  ngOnInit(): void {
    this.setUpCalendar()

    this.beeService.getTasks().subscribe()
  }

  setUpCalendar() {
    const startMonthDay = startOfMonth(this.currentDate); // 当月开始日期
    const endMonthDay = endOfMonth(this.currentDate); // 当月结束日期
    const startWeekDay = startOfWeek(startMonthDay, DateConfig.dateOptions)
    const endWeekDay = endOfWeek(endMonthDay, DateConfig.dateOptions)
    const betweenDays = differenceInDays(endWeekDay, startWeekDay)

    this.rows = (betweenDays + 1) / 7; // 日历行数
    this.displayDays = new Array(this.rows)
    this.listDays = []

    let day = startWeekDay;

    for(let row=0;row<this.rows;row++){
      const arr = [];
      let currentWeek = false

      for(let column=0;column<7;column++){
        const daily = new Daily(day,isSameMonth(day,this.currentDate),isSameDay(day,this.today))

        arr[column] = daily
        this.listDays.push(daily)

        day = addDays(day,1)
      }


      this.displayDays[row] = arr

    }


  }

  private setSelectedMonthTasks(){
    this.tasks.forEach(task=>{

    })
  }

  preMonth(){
    this.currentDate = addMonths(this.currentDate,-1)
    this.setUpCalendar()
  }

  nextMonth(){
    this.currentDate = addMonths(this.currentDate,1)
    this.setUpCalendar()
  }

  private assignProjectColor(task: Task) {
    if (!this.projectColorMap[task.projectId]) {
      if (task.type === 6) {
        this.projectColorMap[task.projectId] = this.vacationColor;
      } else {
        this.projectColorMap[task.projectId] =
          this.colorPool[this.assignColorIndex % this.colorPool.length];
        // this.colorPool[this.randomNum(0, this.colorPool.length - 1)];
        this.assignColorIndex++;
      }
    }

    if (task.type === 6) {
      task.projectName = '休假';
    }
    task.color = this.projectColorMap[task.projectId];
  }


}
