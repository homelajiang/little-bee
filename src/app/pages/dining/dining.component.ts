import {Component, OnInit} from '@angular/core';
import {addDays, addWeeks, daysInWeek, format, getDay, startOfWeek} from "date-fns";
import {DateConfig} from "../../common/config";

@Component({
  selector: 'app-dining',
  templateUrl: './dining.component.html',
  styleUrls: ['./dining.component.css']
})
export class DiningComponent implements OnInit {

  menus = "{\"20221128\":{\"中餐\":{\"一楼\":[\"蒜香排条\",\"韭黄炒蛋\",\"雪菜炒豆芽\",\"青菜\"],\"二楼\":[\"仔鱼块\",\"芸豆炒牛柳\",\"雪菜炒豆芽\",\"青菜\"],\"B餐\":[]},\"晚餐\":[\"脆皮鸡腿\",\"风味茄丁\",\"青椒干丝\"]},\"20221129\":{\"中餐\":{\"一楼\":[\"酱骨鸡\",\"萝卜烧肉\",\"青椒炒莲藕\",\"白菜\"],\"二楼\":[\"红烧大排\",\"咖喱土豆鸡块\",\"青椒炒莲藕\",\"白菜\"],\"B餐\":[]},\"晚餐\":[\"粉蒸排骨\",\"客家小炒\",\"榨菜粉皮\"]},\"20221130\":{\"中餐\":{\"一楼\":[\"梅干菜肉圆\",\"萝卜炖牛腩\",\"红烧老豆腐\",\"茼蒿菜\"],\"二楼\":[\"酱油虾\",\"卤蛋\",\"红烧老豆腐\",\"茼蒿菜\"],\"B餐\":[\"荠菜肉丝蛋炒饭\"]},\"晚餐\":[\"糖醋带鱼\",\"\",\"百叶结炖咸肉\",\"葱油南瓜\"]},\"20221201\":{\"中餐\":{\"一楼\":[\"小米椒烧鸡\",\"西芹炒鱼丸\",\"青椒土豆丝\",\"蒜泥生菜\"],\"二楼\":[\"糖醋排骨\",\"黄瓜炒鸡柳\",\"青椒土豆丝\",\"蒜泥生菜\"],\"B餐\":[]},\"晚餐\":[\"陈皮猪爪\",\"青椒炒蛋\",\"炒花菜\"]},\"20221202\":{\"中餐\":{\"一楼\":[\"面拖大排\",\"木须菜\",\"清炒豆芽\",\"青菜\"],\"二楼\":[\"可乐鸡翅\",\"四季豆炒牛肉片\",\"清炒豆芽\",\"青菜\"],\"B餐\":[\"酱爆茄子盖浇饭\"]},\"晚餐\":[\"清蒸咸肉\",\"芹菜炒鱿鱼\",\"西兰花\"]}}"
  public weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  dateStrings = ['']
  lunch1 = new Array<Array<string>>()
  lunch2 = new Array<Array<string>>()
  lunchB = new Array<Array<string>>()
  dinner = new Array<Array<string>>()

  ngOnInit(): void {
    let currentDate = addWeeks(new Date(),-4)
    this.formatMenus(startOfWeek(currentDate, DateConfig.dateOptions));
  }


  private formatMenus(startOfWeek: Date) {
    let dateDur = []
    for (let index of [0, 1, 2, 3, 4, 5, 6]) {
      dateDur.push(addDays(startOfWeek, index))
    }

    const menusObj = JSON.parse(this.menus)
    dateDur.forEach((date) => {
      const menu = menusObj[format(date, 'yyyyMMdd', DateConfig.dateOptions)]
      this.dateStrings.push(`${format(date,'MM/dd',DateConfig.dateOptions)}(${this.weekdays[getDay(date)]})`)

      try {
        this.lunch1.push(menu['中餐']['一楼'])
      }catch (e) {
        this.lunch1.push([])
      }

      try {
        this.lunch2.push(menu['中餐']['二楼'])
      }catch (e) {
        this.lunch2.push([])
      }

      try {
        console.log('3333')
        this.lunchB.push(menu['中餐']['B餐'])
      }catch (e) {
        this.lunchB.push([])
      }

      try {
        this.dinner.push(menu['晚餐'])
      }catch (e) {
        this.dinner.push([])
      }
    })

  }

}
