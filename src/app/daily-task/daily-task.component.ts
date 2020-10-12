import {Component, Input, OnInit} from '@angular/core';
import {Daily} from '../daily/daily.component';
import {Task} from '../bee/bee.service';
import {MatDialog} from '@angular/material/dialog';
import {TaskInfoComponent} from '../task-info/task-info.component';
import {ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-daily-task',
    templateUrl: './daily-task.component.html',
    styleUrls: ['./daily-task.component.css']
})
export class DailyTaskComponent implements OnInit {

    @Input() daily: Daily;

    constructor(private matDialog: MatDialog) {
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

    showEventInfo(event: any, task: Task) {
        /*    this.createOverlayRef(event);
            const popupComponentPortal = new ComponentPortal(TaskInfoComponent, this.viewContainerRef,
                this.createInjector(task, this.overlayRef));
            this.overlayRef.attach(popupComponentPortal);
            this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());

            event.stopPropagation();*/

        const config = {
            data: {
                task
            }
        };

        this.matDialog.open(TaskInfoComponent, config);
    }
}
