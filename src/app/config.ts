import {zhCN} from 'date-fns/locale';

export class Config {
  static weekStartsOnMonday = true; // 周一为一周的第一天
  static dateOptions: object = {
    locale: zhCN,
    weekStartsOn: Config.weekStartsOnMonday ? 1 : 0, // 周一
    // firstWeekContainsDate: 1
  };

}
