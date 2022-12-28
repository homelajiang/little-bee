import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BeeService} from "../../service/bee.service";
import {Router} from "@angular/router";
import {SnackBar} from "../../common/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('liangxiyuan@kedacom.com'),
    password: new FormControl('13949875668Ll')
  })
  loading = false

  constructor(private beeService: BeeService, private router: Router, private snackBar: SnackBar) {
  }

  startLogin() {
    if (!this.loginForm.get('username')?.value) {
      this.snackBar.tipsError('用户名不能为空');
      return;
    }

    if (!this.loginForm.get('password')?.value) {
      this.snackBar.tipsError('密码不能为空');
      return;
    }

    this.loading = true;
    this.beeService.login(this.loginForm.get('username')?.value!, this.loginForm.get('password')?.value!)
      .subscribe({
        next: (userInfo) => {
          this.router.navigate(['/']).then(r => {
          });
        },
        error: (e) => {
          this.snackBar.tipsError(e.toString());
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

}
