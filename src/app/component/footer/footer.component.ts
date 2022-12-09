import {Component} from '@angular/core';
import {environment} from '../../environments/environment'
import {getYear} from "date-fns";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  appVersion: string
  year = getYear(new Date)

  constructor() {
    this.appVersion = environment.version
  }
}
