import {Component, Inject, OnInit} from '@angular/core';
import {BeeService, Project, Task, TaskCreate} from '../bee/bee.service';
import {MatDialog} from '@angular/material/dialog';
import {SnackBar} from '../utils/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-task-page',
  templateUrl: './create-task-page.component.html',
  styleUrls: ['./create-task-page.component.css']
})
export class CreateTaskPageComponent implements OnInit {


  selectedDate: Date;
  // 选中维护项目时该project为维护项目项
  selectedProject: Project;
  isClosedProject: boolean;
  projects: Array<Project> = [];
  closedProject: Project;
  closedProjects: Array<Project> = [];
  taskInput = '';

  scene = '';
  selectedScene: string; // 选中的现场
  sceneList = []; // 现场列表

  constructor(private beeService: BeeService, private snackBar: SnackBar,
              public dialog: MatDialog, private router: Router) {
    this.selectedDate = new Date();
  }

  ngOnInit() {
    this.initProject();
  }

  checkDefaultProject(projects: Array<Project>) {
    if (this.beeService.defaultProject) {
      let temp: Project = null;
      projects.forEach(p => {
        if (this.beeService.defaultProject.projectId === p.projectId) {
          temp = p;
        }
      });
      if (temp) {
        this.selectedProject = temp;
      }
    }
  }

  initProject() {
    this.getAllProjects();
  }

  getAllProjects() {
    this.beeService.getProjects().subscribe(projects => {
      this.projects = projects;
      let theOneIndex = -1;
      this.projects.forEach((value, index) => {
        if (value.projectName === '维护项目') {
          theOneIndex = index;
        }
      });

      if (theOneIndex !== -1) {
        this.closedProject = this.projects[theOneIndex];
        this.projects.splice(theOneIndex, 1);
      }
    }, error => this.snackBar.tipsError(error));

    this.beeService.getClosedProjects().subscribe(projects => {
      this.closedProjects = projects;
    }, error => this.snackBar.tipsError(error));
  }

  onDateChanged(event: any) {
    this.selectedDate = event.value;
  }

  selectProject(isClosedProject: boolean, project: Project) {
    if (this.selectedProject !== project) {
      // 清空已经选择的现场
      this.selectedScene = ''
    }
    this.sceneList = project.scene ? project.scene.split(',') : []
    this.isClosedProject = isClosedProject;
    this.selectedProject = project;
  }

  getSelectProjectTitle() {
    if (this.selectedProject) {
      if (this.isClosedProject) {
        return `${this.selectedProject.projectName}（${this.closedProject.projectName}）`;
      } else {
        return this.selectedProject.projectName;
      }
    } else {
      return '请选择一个项目';
    }
  }

  selectScene(scene: string) {
    this.selectedScene = scene
  }

  // 获取现场
  getSelectSceneTitle() {
    return this.selectedScene ? this.selectedScene : '请选择一个现场'
  }


  saveTask() {
    if (!this.taskInput) {
      this.snackBar.tipsError('请输入任务简述');
      return;
    }

    if (!this.selectedProject) {
      this.snackBar.tipsError('请选择一个项目');
      return;
    }

    if (!this.selectedScene && this.selectedProject.scene) {
      this.snackBar.tipsError('请选择一个现场');
      return;
    }

    this.snackBar.tipsForever('任务创建中，请稍等');

    this.beeService.createTask(
      new TaskCreate(this.selectedDate, this.taskInput, this.selectedProject,
        this.isClosedProject ? this.closedProject : null, this.selectedScene)
    )
      .subscribe(res => {
        this.snackBar.tipsSuccess('创建成功');
        this.beeService.clearCache('tasks')
        setTimeout(() => {
          this.router.navigate(['/daily']);
        }, 1000);
      }, error => {
        this.snackBar.tipsError(`创建失败:${error}`);
      });

  }
}
