import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {BeeService, Project, Task} from '../bee/bee.service';
import {OverlayRef} from '@angular/cdk/overlay';
import {TASK_INFO} from '../tokens';
import {SnackBar} from '../utils/snack-bar';
import {WorkHoursDialogComponent} from './work-hours-dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  selectedDate: Date;
  selectedProject: Project;
  projectList: Array<Project> = [];
  taskInput = '';

  constructor(@Inject(TASK_INFO) public task: Task, private beeService: BeeService, private snackBar: MatSnackBar,
              public dialog: MatDialog, public overlayRef: OverlayRef) {
    if (this.task && this.task.createTime) {
      this.selectedDate = new Date(this.task.createTime);
    } else {
      this.selectedDate = new Date();
    }
  }

  ngOnInit() {
    if (this.beeService.projects.length === 0) {
      this.getAllProjects();
    } else {
      this.projectList = this.beeService.projects;
      this.checkDefaultProject();
    }

  }

  checkDefaultProject() {
    if (this.beeService.defaultProject) {
      let temp: Project = null;
      this.projectList.forEach(p => {
        if (this.beeService.defaultProject.projectId === p.projectId) {
          temp = p;
        }
      });
      if (temp) {
        this.selectedProject = temp;
      }
    }
  }

  getAllProjects() {
    this.beeService.getProjects().subscribe(projects => {
      this.projectList = projects;
      this.checkDefaultProject();
    }, error => SnackBar.open(this.snackBar, error));
  }

  onDateChanged(event: any) {
    this.selectedDate = event.value;
  }

  // projectSelected(event: any) {
  //   this.selectedProject = event;
  // }

  selectProject() {
    const selectProjectForm = document.getElementById('selectProjectForm') as HTMLInputElement;
    selectProjectForm.click();
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

    this.beeService.createTask(this.selectedDate, this.taskInput, this.selectedProject)
      .subscribe(res => {
        SnackBar.open(this.snackBar, '创建成功');
        this.beeService.refreshTasks.next(this.selectedDate);
        this.closeEdit();
        // 刷新任务列表
      }, error => {
        SnackBar.open(this.snackBar, `创建失败 ${error}`);
      });

  }

  saveAndCloseTask() {
    this.showInputWorkHoursDialog();
  }

  // 填写工时
  showInputWorkHoursDialog(): void {
    const dialogRef = this.dialog.open(WorkHoursDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
