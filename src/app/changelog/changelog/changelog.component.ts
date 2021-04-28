import {Component, Input, OnInit} from '@angular/core';
import {BeeService, ChangeLog} from '../../bee/bee.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {

  constructor(private beeService: BeeService) {
  }

  @Input()
  changeLog: ChangeLog = new ChangeLog();

  ngOnInit(): void {
/*    this.beeService.getChangeLogs().subscribe((res:ChangeLog) => {
      this.log = res;
    });*/
  }

}
