import {Pipe, PipeTransform} from '@angular/core';
import locale from 'date-fns/esm/locale/zh-CN';
import {format} from 'date-fns';
import {zhCN} from 'date-fns/locale';
import {Config} from '../config';

@Pipe({name: 'dateFnsFormat'})
export class DateFnsFormatPipe implements PipeTransform {
  // 2020-01-28 04:06:16 -> 2月 8日 (星期六)
  transform(datetimeString: string | Date, formatString: string = 'yyyy/MM/dd'): string {
    const date = new Date(datetimeString);
    return format(date, formatString, Config.dateOptions);
  }
}

@Pipe({name: 'taskStateColor'})
export class TaskStateColorPip implements PipeTransform {
  //  1、正常  2、关闭  3、延期
  transform(state: number): string {
    if (state === 2) {
      return '#B3E0DB';
    } else if (state === 3) {
      return '#039BE5';
    } else {
      return '#009688';
    }
  }
}