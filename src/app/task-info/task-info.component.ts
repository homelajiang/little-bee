import {Component, Inject, OnInit} from '@angular/core';
import {TASK_INFO} from '../tokens';
import {MatDialog, MatSnackBar} from '@angular/material';
import {OverlayRef} from '@angular/cdk/overlay';
import {BeeService, Task, TaskClose, TaskInfo} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {ConfirmDialog} from '../utils/confirm-dialog';
import {WorkHoursDialogComponent} from '../new-task/work-hours-dialog';
import {pipe} from 'rxjs';
import {filter, flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css']
})
export class TaskInfoComponent implements OnInit {

  constructor(@Inject(TASK_INFO) public task: Task, private beeService: BeeService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog, public overlayRef: OverlayRef) {
  }

  ngOnInit() {
  }

  close() {
    this.overlayRef.dispose();
  }

  deleteTask() {
    this.beeService.deleteTask(this.task.id.toString())
      .subscribe(res => {
        SnackBar.open(this.snackBar, `删除成功`);
        this.beeService.refreshTasks.next(new Date(this.task.startTime));
        this.close();
      }, error => {
        SnackBar.open(this.snackBar, `删除失败${error}`);
      });
  }

  // 关闭任务
  closeTask() {
    const sycOaWorkHours = this.beeService.checkSyncOa(this.task.endTime);
    if (!sycOaWorkHours) {
      ConfirmDialog.open(this.dialog, '当前关闭的任务不可同步工时' +
        '<br/>' +
        '是否继续关闭？', '', '提示')
        .afterClosed()
        .pipe(
          filter(ok => {
            return ok;
          }),
          flatMap(ok => {
            return this.beeService.getTaskInfo(this.task.id.toString());
          })
        )
        .subscribe(taskInfo => {
          const taskClose = new TaskClose();
          taskClose.task = taskInfo;
          this.beeService.notifyCloseTask.next(taskClose);
          this.overlayRef.dispose();
        }, error => {
          SnackBar.open(this.snackBar, error);
        });
    } else {
      this.showInputWorkHoursDialog();
    }
  }

  // 填写工时
  showInputWorkHoursDialog(): void {
    let workHours = 0;
    this.dialog.open(WorkHoursDialogComponent, {})
      .afterClosed()
      .pipe(
        filter(hours => {
          return hours;
        }),
        flatMap(hours => {
          workHours = hours;
          return this.beeService.getTaskInfo(this.task.id.toString());
        })
      )
      .subscribe(taskInfo => {
        const taskClose = new TaskClose();
        taskClose.task = taskInfo;
        taskClose.workHours = workHours;
        this.beeService.notifyCloseTask.next(taskClose);
        this.overlayRef.dispose();
      }, error => {
        SnackBar.open(this.snackBar, error);
      });
  }

  getTaskStateColorClass(state: number) {
    if (state === 2) {
      return 'task-closed';
    } else if (state === 3) {
      return 'task-delay';
    } else {
      return 'task-opened';
    }
  }

  getTaskStateDes(state: number) {
    if (state === 2) {
      return '已关闭';
    } else if (state === 3) {
      return '已延期';
    } else if (state === 1) {
      return '正常';
    } else {
      return '其他状态';
    }
  }

}
