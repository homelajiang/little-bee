import {Component, OnInit} from '@angular/core';
import {BeeService} from '../bee/bee.service';
import {MatSnackBar} from '@angular/material';
import {SnackBar} from '../utils/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private username: string;
  private password: string;
  private loading: boolean;

  constructor(private beeService: BeeService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
  }

  login() {

    if (!this.username) {
      SnackBar.open(this.snackBar, '用户名不能为空');
      return;
    }

    if (!this.password) {
      SnackBar.open(this.snackBar, '密码不能为空');
      return;
    }

    this.loading = true;
    this.beeService.loginBee(this.username, this.password)
      .subscribe(userInfo => {
        this.router.navigate(['/']);
      }, error => {
        this.loading = false;
        SnackBar.open(this.snackBar, error.toString());
      });
  }
}
