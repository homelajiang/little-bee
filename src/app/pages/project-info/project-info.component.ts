import {Component, OnInit} from '@angular/core';
import {BeeService} from "../../service/bee.service";
import {ProjectInfo} from "../../common/bee.entity";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {
  projectId = 0

  projectInfo = new ProjectInfo()

  constructor(private beeService: BeeService, private router: ActivatedRoute) {
    this.projectId = parseInt(router.snapshot.params['id'])
  }

  ngOnInit(): void {
  }

  onGetProjectInfo(projectInfo: ProjectInfo) {
    this.projectInfo = projectInfo
    console.log(this.projectInfo)
  }


}
