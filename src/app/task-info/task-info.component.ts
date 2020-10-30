import {Component, Inject, OnInit} from '@angular/core';
import {TASK_INFO} from '../tokens';
import {OverlayRef} from '@angular/cdk/overlay';
import {BeeService, Task, TaskClose, TaskInfo} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {ConfirmDialog} from '../utils/confirm-dialog';
import {ConfirmData} from '../component/confirm-dialog/confirm-dialog.component';
import {WorkHoursDialogComponent} from '../new-task/work-hours-dialog';
import {filter, flatMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {isSameDay, parse} from 'date-fns';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css']
})
export class TaskInfoComponent implements OnInit {

  constructor(@Inject(TASK_INFO) public task: Task, private beeService: BeeService,
              private snackBar: SnackBar,
              public dialog: MatDialog, public overlayRef: OverlayRef) {
  }

  ngOnInit() {
  }

  close() {
    this.overlayRef.dispose();
  }

  editTask(task: Task) {
    const startDate = parse(task.startTime, 'yyyy-MM-dd HH:mm:ss', new Date())
    const endDate = parse(task.endTime, 'yyyy-MM-dd HH:mm:ss', new Date())
    if (!isSameDay(startDate, endDate)) {
      this.snackBar.tipsError('暂不支持编辑跨天任务')
      return;
    }
    const ref = this.snackBar.tipsForever('获取任务详情中...')
    this.beeService.getTaskInfo(task.id.toString())
      .subscribe(res => {
        ref.dismiss()
        this.close()
        this.beeService.notifyEditTask.next(res)
      }, error => {
        this.snackBar.tipsError(error)
      })
  }

  deleteTask() {
    this.beeService.notifyDeleteTask.next(this.task)
    this.close()
  }

  // 关闭任务
  closeTask() {
    const sycOaWorkHours = this.beeService.checkSyncOa(this.task.endTime);
    if (!sycOaWorkHours) {
      ConfirmDialog.open(this.dialog, new ConfirmData('提示', '当前关闭的任务不可同步工时' + '<br/>' + '是否继续关闭？'))
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
          this.snackBar.tipsError(error);
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
        this.snackBar.tipsError(error);
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
