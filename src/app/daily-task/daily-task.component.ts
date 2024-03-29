import {Component, Input, OnInit} from '@angular/core';
import {BeeService, Daily, Task, TaskClose} from '../bee/bee.service';
import {MatDialog} from '@angular/material/dialog';
import {SnackBar} from '../utils/snack-bar';
import {ConfirmDialog} from '../utils/confirm-dialog';
import {ConfirmData} from '../component/confirm-dialog/confirm-dialog.component';
import {filter, flatMap} from 'rxjs/operators';
import {WorkHoursDialogComponent} from '../new-task/work-hours-dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-daily-task',
  templateUrl: './daily-task.component.html',
  styleUrls: ['./daily-task.component.css']
})
export class DailyTaskComponent implements OnInit {

  @Input() daily: Daily;

  constructor(private matDialog: MatDialog, private beeService: BeeService,
              private snackBar: SnackBar, private  router: Router) {
  }

  ngOnInit(): void {
  }

  getStateDesc(task: Task) {
    switch (task.state) {
      case 2:
        return task.workHours + '小时';
      case 3:
        return '已延期';
      default:
        return '';
    }
  }

  removeTask(task: Task) {
    this.beeService.notifyDeleteTask.next(task)
  }

  closeTask(task: Task) {
    this.showInputWorkHoursDialog(task);
    return
    // 任务不同步到oa

    if (!this.beeService.checkSyncOa(task.endTime)) {
      ConfirmDialog.open(this.matDialog, new ConfirmData('提示', '当前关闭的任务不可同步工时' + '<br/>' + '是否继续关闭？'))
        .afterClosed()
        .pipe(
          filter(ok => {
            return ok;
          }),
          flatMap(ok => {
            return this.beeService.getTaskInfo(task.id.toString());
          })
        )
        .subscribe(taskInfo => {
          const taskClose = new TaskClose();
          taskClose.task = taskInfo;
          this.beeService.notifyCloseTask.next(taskClose);
        }, error => {
          this.snackBar.tipsError(`关闭失败：${error}`)
        });
    } else {
      this.showInputWorkHoursDialog(task);
    }
  }

  // 填写工时
  showInputWorkHoursDialog(task: Task): void {
    let workHours = 0;
    this.matDialog.open(WorkHoursDialogComponent, {})
      .afterClosed()
      .pipe(
        filter(hours => {
          return hours;
        }),
        flatMap(hours => {
          workHours = hours;
          return this.beeService.getTaskInfo(task.id.toString());
        })
      )
      .subscribe(taskInfo => {
        const taskClose = new TaskClose();
        taskClose.task = taskInfo;
        taskClose.workHours = workHours;
        this.beeService.notifyCloseTask.next(taskClose);
      }, error => {
        this.snackBar.tipsError(`关闭失败：${error}`)
      });
  }

  toCreatePage() {
    this.router.navigate(['/newTask'])
  }
}
