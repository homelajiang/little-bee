import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {DailyComponent} from './pages/daily/daily.component';
import {Page404Component} from './pages/page404/page404.component';
import {HomeComponent} from "./pages/home/home.component";
import {ProjectsComponent} from "./pages/projects/projects.component";

const router: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: HomeComponent,
    children: [
      {path: '', redirectTo: '/daily', pathMatch: 'full'},
      {path: 'daily', component: DailyComponent},
      {path: 'projects', component: ProjectsComponent},
      // {path: 'ranking', component: Ra}
    ]
  },
  {path: '**', component: Page404Component}
]

export const appRouting = RouterModule.forRoot(router);
