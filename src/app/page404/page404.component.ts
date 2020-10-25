import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component implements OnInit {

  active = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    setTimeout(() => {
      // document.querySelector('.cont_principal').className = 'cont_principal cont_error_active';
      this.active = true;
    }, 500);
  }

  toHome() {
    this.router.navigate(['/']);
  }

}
