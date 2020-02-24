import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Page404Component} from './page404/page404.component';
import {DailyComponent} from './daily/daily.component';
import {SettingComponent} from './setting/setting.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import {appRouting} from './app.router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatDatepickerModule, MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatRippleModule, MatSelectModule, MatSnackBarModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {MainComponent} from './main/main.component';
import {NewTaskComponent} from './new-task/new-task.component';
import {DinnerComponent} from './dinner/dinner.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {httpInterceptorProviders} from './http-interceptor';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TaskInfoComponent} from './task-info/task-info.component';
import {DateFnsFormatPipe, TaskStateColorPip} from './bee/bee.pipe';
import {ConfirmDialogComponent} from './component/confirm-dialog/confirm-dialog.component';
import {WorkHoursDialogComponent} from './new-task/work-hours-dialog';

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    DailyComponent,
    SettingComponent,
    LoginComponent,
    MainComponent,
    WorkHoursDialogComponent,
    NewTaskComponent,
    DinnerComponent,
    TaskInfoComponent,
    DateFnsFormatPipe,
    TaskStateColorPip,
    ConfirmDialogComponent
  ],
  imports: [
    OverlayModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    appRouting,
    FlexLayoutModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRippleModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule
  ],
  entryComponents: [NewTaskComponent, TaskInfoComponent, WorkHoursDialogComponent, ConfirmDialogComponent],
  providers: [httpInterceptorProviders, {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
