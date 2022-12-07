import {Pipe, PipeTransform} from '@angular/core';
import {format, parse} from "date-fns";
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
    return format(date,formantString,DateConfig.dateOptions)
  }


}
