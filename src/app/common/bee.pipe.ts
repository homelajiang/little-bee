import {Pipe, PipeTransform} from '@angular/core';
import {differenceInDays, differenceInHours, differenceInMinutes, format, parse} from "date-fns";
import {DateConfig} from "./config";

@Pipe({
  name: 'dateFnsFormat'
})
export class DateFnsFormatPipe implements PipeTransform {
  transform(inputDate: string | Date, formantString: string = 'yyyy/MM/dd'): string {
    let date: Date;
    if (inputDate instanceof Date) {
      date = inputDate
    } else {
      date = parse(inputDate, 'yyyy-MM-dd HH:mm:ss', new Date())
    }
    return format(date, formantString, DateConfig.dateOptions)
  }


}

@Pipe({
  name: 'dateAgoFormat'
})
export class DateAgoFormatPipe implements PipeTransform {
  transform(inputDate: string | Date, inputFormat: string = 'yyyy-MM-dd HH:mm:ss'): string {
    const currentDate = new Date()
    let date: Date;
    if (inputDate instanceof Date) {
      date = inputDate
    } else {
      date = parse(inputDate, inputFormat, currentDate)
    }
    console.log("ffdfd")

    const diffDays = differenceInDays(currentDate, date)
    if (diffDays <= 0) {
      const diffHours = differenceInHours(currentDate, date)
      if (diffHours <= 0) {
        const diffMin = differenceInMinutes(currentDate, date)
        if (diffMin <= 0) {
          return '刚刚'
        } else {
          return `${diffMin}分钟前`
        }
      } else {
        return `${diffHours}小时前`
      }
    } else {
      return `${diffDays}天前`
    }
  }

}
