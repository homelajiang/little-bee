import {Component, Input, OnInit} from '@angular/core';
import {BeeService} from "../../../service/bee.service";
import {ProjectInfo} from "../../../common/bee.entity";

@Component({
  selector: 'app-project-state',
  templateUrl: './project-state.component.html',
  styleUrls: ['./project-state.component.css']
})
export class ProjectStateComponent implements OnInit {

  @Input()
  projectInfo? :ProjectInfo

  constructor(private beeService: BeeService) {
  }

  ngOnInit(): void {
  }

}
