import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Daily, ProjectInfo, ProjectMember} from "../../../common/bee.entity";
import {BeeService} from "../../../service/bee.service";

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  @Input()
  projectId = 0

  @Output() projectInfoEvent = new EventEmitter<ProjectInfo>();

  projectInfo = new ProjectInfo()
  projectMembers: Array<ProjectMember> = []

  constructor(private beeService: BeeService) {
  }

  ngOnInit(): void {
    this.getProjectInfo()
    this.getProjectMembers()
    this.getProjectRecentTask()
  }

  getProjectInfo() {
    this.beeService.getProjectInfo(this.projectId)
      .subscribe({
        next: (projectInfo) => {
          this.projectInfo = projectInfo
          this.projectInfo.projectId = this.projectId
          this.projectInfoEvent.next(this.projectInfo)
        },
        error: (e) => {
        },
        complete: () => {
        }
      })
  }

  getProjectScenes(): Array<string> {
    if (this.projectInfo.scene) {
      return this.projectInfo.scene.split(',')
    } else {
      return []
    }
  }

  getProjectMembers() {
    this.beeService.getProjectMembers(this.projectId)
      .subscribe({
        next: (members) => {
          this.projectMembers = members
        },
        error: (e) => {
        },
        complete: () => {
        }
      })
  }

  getProjectRecentTask(){
    this.beeService.getProjectRecentTasks(this.projectId)
      .subscribe({
        next: (recentTasks) => {
          this.projectInfo.taskCount = recentTasks.page?.totalCount
          this.projectInfo.recentTasks = recentTasks.result!
          this.projectInfoEvent.next(this.projectInfo)
        },
        error: (e) => {
        },
        complete: () => {
        }
      })
  }

}
