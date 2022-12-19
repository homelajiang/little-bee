import {Component, OnInit} from '@angular/core';
import {BeeService} from "../../service/bee.service";
import {SnackBar} from "../../common/snack-bar";
import {ProjectOverview} from "../../common/bee.entity";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Array<ProjectOverview> = []
  isMyProject = true

  constructor(private beeService: BeeService, private snackBar: SnackBar) {
  }

  ngOnInit(): void {
    this.refreshProjects();
  }

  changeProjectType(myProject: boolean) {
    this.isMyProject = myProject
    this.refreshProjects()
  }

  private refreshProjects() {
    if (this.isMyProject) {
      this.getMyProjects()
    } else {
      this.getNormalProjects()
    }
  }


  private getMyProjects() {
    this.beeService.getMyProjects()
      .subscribe({
        next: (myProjects) => {
          this.projects = myProjects;
        },
        error: (err) => {
          this.snackBar.tipsError(err.toString())
        },
        complete: () => {

        }
      })
  }

  private getNormalProjects() {
    this.beeService.getNormalProjects()
      .subscribe({
        next: (myProjects) => {
          this.projects = myProjects;
        },
        error: (err) => {
          this.snackBar.tipsError(err.toString())
        },
        complete: () => {

        }
      })
  }

}
