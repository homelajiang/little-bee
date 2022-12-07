import {zhCN} from 'date-fns/locale';

export class DateConfig {
  static dateOptions: object = {
    locale: zhCN,
    weekStartsOn: 1, // 周一
    // firstWeekContainsDate: 1
  };

}
