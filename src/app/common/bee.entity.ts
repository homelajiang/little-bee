export class HttpResponse<T> {
  code = 0
  msg = ""
  result: T | undefined;
}

export class Daily {
  date: Date;
  tasks: Array<Task> = []
  currentMonth: boolean;
  today: boolean

  constructor(date: Date, currentMonth: boolean,today:boolean) {
    this.date = date
    this.currentMonth = currentMonth
    this.today = today
  }

}

export class Task {

}

export class UserInfo {
  deptName = "";
  switchMail = 0;
  level = 0;
  switchPush = 0;
  roleId = 0; // 1、管理员 2、部门经理 3、项目经理 4、UI设计师 5、开发 6、测试
  deptId = 0;
  mobile = "";
  levelName = "";
  switchNotice = 0;
  token = "";
  tags = "";
  head = '';
  score = 0;
  userAccount = "";
  name = ""; // 姓名
  id = 0;
  exp = 0;
}
