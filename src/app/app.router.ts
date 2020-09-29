import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {Page404Component} from './page404/page404.component';
import {AuthGuard} from './auth/auth.guard';
import {HomeComponent} from './home/home.component';
import {ShopComponent} from './shop/shop.component';
import {HomeCalendarComponent} from './home-calendar/home-calendar.component';

const router: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: '/daily', pathMatch: 'full'},
      {path: 'daily', component: HomeCalendarComponent},
      {path: 'gift', component: ShopComponent}
    ]
  },
  {path: '**', component: Page404Component}
];

export const appRouting = RouterModule.forRoot(router);
