import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {BeeService, Project, ProjectMenu, Task, TaskCreate} from '../bee/bee.service';
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
  projectMenus: Array<ProjectMenu> = []
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
    this.initProject()
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
    /*  // todo 适时的刷新项目列表
      if (this.beeService.projects.length === 0) {
        this.getAllProjects();
      } else {
        this.projectList = this.beeService.projects;
        this.checkDefaultProject();
      }*/
    this.getAllProjects()
  }

  getAllProjects() {
    this.beeService.getProjects().subscribe(projects => {

      // 处理菜单
      this.expandProjectMenu(null, projects)

      console.log(this.projectMenus)

      this.checkDefaultProject(projects);
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

    this.beeService.notifyCreateTask.next(new TaskCreate(this.selectedDate, this.taskInput, this.selectedProject))

    this.closeEdit();

    /*    this.beeService.createTask(this.selectedDate, this.taskInput, this.selectedProject)
          .subscribe(res => {
            SnackBar.open(this.snackBar, '创建成功');
            this.beeService.refreshTasks.next(this.selectedDate);
            this.closeEdit();
            // 刷新任务列表
          }, error => {
            SnackBar.open(this.snackBar, `创建失败 ${error}`);
          });*/

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

  private expandProjectMenu(parent: Project, projects: Array<Project>) {

    this.projectMenus.push(new ProjectMenu(parent, projects))

    projects.forEach(project => {
      if (project.subProjects && project.subProjects.length > 0) {
        this.expandProjectMenu(project, project.subProjects)
      }
    })

    /*    projects.forEach(project => {
          if (project.subProjects && project.subProjects.length > 0) {
            this.projectMenus.push(new ProjectMenu(parent, project, project.subProjects));
            this.expandProjectMenu(project,project.subProjects)
          } else {
            this.projectMenus.push(new ProjectMenu(parent, project, []));
          }
        })*/
  }
}
