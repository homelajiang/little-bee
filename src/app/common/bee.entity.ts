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

  constructor(date: Date, currentMonth: boolean, today: boolean) {
    this.date = date
    this.currentMonth = currentMonth
    this.today = today
  }

}

export class TaskInfo {
  id = '';
  attachments = '';
  endDate = '';
  oaProjectCode = '';
  taskTypeState = 0;
  leaders = '';
  content = '';
  alarmFlag = 0;
  beginDate = '';
  taskType = 0;
  createBy = '';
  oaProjectName = '';
  leaderIds = '';
  createById = 0;
  scene? = '';
  state = 0;
  projectName = '';
  projectId = 0;
  subProjectId = 0;
  subProjectName = '';
  workHours = 0;
}

export class TaskClose {
  task!: TaskInfo;
  workHours!: number;
}

export class TaskCreate {
  constructor(date: Date, content: string, project: Project, parent: Project, scene?: string) {
    this.date = date;
    this.content = content;
    this.project = project;
    this.parent = parent;
    this.scene = scene;
  }

  date: Date;
  content: string;
  project: Project;
  parent: Project;
  scene?: string;
}

export class Gift {
  id = 0;
  img = '';
  leftCount = 0;
  name = '';
  price = 0;
}

export class ScoreAndExp {
  score = 0;
  exp = 0;
}

export class Project {
  endDate = '';
  state = 0;
  projectName = '';
  projectId = 0;
  startDate = '';
  scene?: string; // 现场，用逗号分割
}

export class ProjectOverview {
  projectNo = '';
  createTime = '';
  state = 0;
  projectName = '';
  projectId = 0;
  orderState = 0;
  projectIcon?: string
  scene?: string = ''
}

export class NormalProjectOverview extends ProjectOverview {
  deptName = '';
  startDate = '';
  endDate = '';
  manageName = '';
}

export class MyProjectOverview extends ProjectOverview {
  projectManagerId = ''
  taskCount = 0;
}

export class Task {
  createTime = '';
  userNames = '';
  startTime = '';
  id = 0;
  endTime = '';
  /**
   * 1、正常  2、关闭  3、延期
   */
  state = 0;
  projectName = '';
  title = '';
  /**
   * 1、项目  2、任务  3、会议 4、周报  6、休假
   */
  type = 0;
  typeState = '';
  projectId = '';
  scene? = null;
  workHours = 0;
  hours = 0; // 任务时长
  color!: BeeColor; // 项目颜色,根据项目id进行区分
}

export class BeeColor {
  primary = '#000000'
  secondary = '#ffffff'

  constructor(primary: string, secondary: string) {
    this.primary = primary
    this.secondary = secondary
  }

  static colorPool(): Array<BeeColor> {
    return [
      {primary: '#8365db', secondary: '#eeeaff'},
      {primary: '#5bab75', secondary: '#e0f3e7'},
      {primary: '#29a5d3', secondary: '#e2f5ff'},
      {primary: '#455af7', secondary: '#e5f6ff'},
    ]
  }

  static vacationColor = {primary: '#ff562d', secondary: '#fff0e9'};
}

export class RankUser {
  head = '';
  workHours = 0;
  userName = '';
  userId = 0;
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
