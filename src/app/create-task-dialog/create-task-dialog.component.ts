import {Component, Inject, OnInit} from '@angular/core';
import {BeeService, Project, Task, TaskCreate, TaskInfo} from '../bee/bee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SnackBar} from '../utils/snack-bar';
import {parse} from 'date-fns';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css']
})
export class CreateTaskDialogComponent implements OnInit {


  selectedDate: Date;
  // 选中维护项目时该project为维护项目项
  selectedProject: Project;
  isClosedProject: boolean;
  projects: Array<Project> = [];
  closedProject: Project;
  closedProjects: Array<Project> = [];
  taskInput = '';

  editMode = false;
  taskInfo: TaskInfo;
  projectName = '';
  scene = '';
  selectedScene: string; // 选中的现场
  sceneList = []; // 现场列表

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private beeService: BeeService,
              private snackBar: MatSnackBar, public dialog: MatDialog,
              public dialogRef: MatDialogRef<CreateTaskDialogComponent>) {
    if (data.taskInfo) {
      this.editMode = true
      this.taskInfo = data.taskInfo
      this.selectedDate = parse(this.taskInfo.beginDate, 'yyyy-MM-dd HH:mm:ss', new Date());
      this.taskInput = this.taskInfo.content
      this.projectName = '维护项目' === this.taskInfo.projectName ? `${this.taskInfo.subProjectName} （维护项目）` : this.taskInfo.projectName
      this.scene = data.taskInfo.scene
    } else {
      this.selectedDate = new Date();
    }
  }

  ngOnInit() {
    if (!this.editMode) {
      this.initProject();
    }
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
    if (this.editMode) {
      return this.projectName
    } else {
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
  }

  selectScene(scene: string) {
    this.selectedScene = scene
  }

  // 获取现场
  getSelectSceneTitle() {
    if (this.editMode) {
      return this.scene
    } else {
      return this.selectedScene ? this.selectedScene : '请选择一个现场'
    }
  }

  closeEdit() {
    this.dialogRef.close()
  }

  updateTask() {
    if (!this.taskInput) {
      SnackBar.open(this.snackBar, '请输入任务简述');
      return;
    }
    this.taskInfo.content = this.taskInput
    this.beeService.notifyUpdateTask.next(this.taskInfo)
    this.closeEdit()
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
