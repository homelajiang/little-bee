import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {DailyComponent} from './pages/daily/daily.component';
import {Page404Component} from './pages/page404/page404.component';
import {HomeComponent} from "./pages/home/home.component";
import {ProjectsComponent} from "./pages/projects/projects.component";
import {ProjectInfoComponent} from "./pages/project-info/project-info.component";
import {RankingComponent} from "./pages/ranking/ranking.component";
import {DiningComponent} from "./pages/dining/dining.component";

const router: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: HomeComponent,
    children: [
      {path: '', redirectTo: '/daily', pathMatch: 'full'},
      {path: 'daily', component: DailyComponent},
      {path: 'projects', component: ProjectsComponent},
      {path: 'projects/:id', component: ProjectInfoComponent},
      {path: 'ranking', component: RankingComponent},
      {path: 'dining', component: DiningComponent}
    ]
  },
  {path: '**', component: Page404Component}
]

export const appRouting = RouterModule.forRoot(router);
