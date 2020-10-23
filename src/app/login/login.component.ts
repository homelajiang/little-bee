import {Component, OnInit} from '@angular/core';
import {BeeService} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  public loading: boolean;

  constructor(private beeService: BeeService,
              private snackBar: SnackBar, private router: Router) {
  }

  ngOnInit() {
    this.username = this.beeService.getLastUsername();
  }

  login() {

    if (!this.username) {
      this.snackBar.tipsError('用户名不能为空');
      return;
    }

    if (!this.password) {
      this.snackBar.tipsError('密码不能为空');
      return;
    }

    this.loading = true;
    this.beeService.loginBee(this.username, this.password)
      .subscribe(userInfo => {
        this.router.navigate(['/']);
      }, error => {
        this.loading = false;
        this.snackBar.tipsError(error.toString());
      });
  }
}
