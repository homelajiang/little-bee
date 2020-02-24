import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DailyComponent} from './daily/daily.component';
import {SettingComponent} from './setting/setting.component';
import {Page404Component} from './page404/page404.component';
import {MainComponent} from './main/main.component';
import {DinnerComponent} from './dinner/dinner.component';
import {TaskInfoComponent} from './task-info/task-info.component';
import {AuthGuard} from './auth/auth.guard';

const router: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: MainComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: '/daily', pathMatch: 'full'},
      {path: 'daily', component: DailyComponent},
      {path: 'test', component: TaskInfoComponent},
      {path: 'dinner', component: DinnerComponent},
      {path: 'setting', component: SettingComponent},
    ]
  },
  {path: '**', component: Page404Component}
];

export const appRouting = RouterModule.forRoot(router);
