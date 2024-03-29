import {Component, OnInit} from '@angular/core';
import {BeeService} from '../bee/bee.service';
import {SnackBar} from '../utils/snack-bar';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loading: boolean;

  loginForm = new FormGroup({
    username:new FormControl(this.beeService.getLastUsername()),
    password:new FormControl('')
  })

  constructor(private beeService: BeeService,
              private snackBar: SnackBar, private router: Router) {
  }

  ngOnInit() {
    // this.username = this.beeService.getLastUsername();
  }

  login() {

    if (!this.loginForm.get('username').value) {
      this.snackBar.tipsError('用户名不能为空');
      return;
    }

    if (!this.loginForm.get('password').value) {
      this.snackBar.tipsError('密码不能为空');
      return;
    }

    this.loading = true;
    this.beeService.loginBee(this.loginForm.get('username').value,this.loginForm.get('password').value)
      .subscribe(userInfo => {
        this.router.navigate(['/']);
      }, error => {
        this.loading = false;
        this.snackBar.tipsError(error.toString());
      });
  }
}
