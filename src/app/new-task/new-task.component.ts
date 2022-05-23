import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {BeeService, Project, Task, TaskCreate} from '../bee/bee.service';
import {OverlayRef} from '@angular/cdk/overlay';
import {TASK_INFO} from '../tokens';
import {SnackBar} from '../utils/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {parse} from 'date-fns';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

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

  constructor(@Inject(TASK_INFO) public task: Task, private beeService: BeeService, private snackBar: MatSnackBar,
              public dialog: MatDialog, public overlayRef: OverlayRef) {
    if (this.task && this.task.createTime) {
      this.selectedDate = parse(this.task.createTime, 'yyyy-MM-dd HH:mm:ss', new Date());
    } else {
      this.selectedDate = new Date();
    }
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
    }, error => SnackBar.open(this.snackBar, error));

    this.beeService.getClosedProjects().subscribe(projects => {
      this.closedProjects = projects;
    }, error => SnackBar.open(this.snackBar, error));
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

  closeEdit() {
    this.overlayRef.dispose();
  }

  saveTask() {
    if (!this.taskInput) {
      SnackBar.open(this.snackBar, '请输入任务简述');
      return;
    }

    if (!this.selectedProject) {
      SnackBar.open(this.snackBar, '请选择一个项目');
      return;
    }

    if (!this.selectedScene && this.selectedProject.scene) {
      SnackBar.open(this.snackBar, '请选择一个现场');
      return;
    }

    this.beeService.notifyCreateTask.next(new TaskCreate(this.selectedDate, this.taskInput, this.selectedProject,
      this.isClosedProject ? this.closedProject : null, this.selectedScene));

    this.closeEdit();
  }
}
