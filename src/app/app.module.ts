import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
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
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {CalendarComponent} from './calendar/calendar.component';
import {CommonModule} from '@angular/common';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {EventComponent} from './event/event.component';
import {EventTitleComponent} from './event-title/event-title.component';
import {FooterComponent} from './footer/footer.component';
import {EventFilterComponent} from './event-filter/event-filter.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ShopComponent} from './shop/shop.component';
import {HomeCalendarComponent} from './home-calendar/home-calendar.component';
import {ClockInComponent} from './clock-in/clock-in.component';
import { ActionCardComponent } from './action-card/action-card.component';
import { CreateVacationComponent } from './create-vacation/create-vacation.component';
import { DailyTaskComponent } from './daily-task/daily-task.component';

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
    ConfirmDialogComponent,
    HomeComponent,
    CalendarComponent,
    ToolbarComponent,
    EventComponent,
    EventTitleComponent,
    FooterComponent,
    EventFilterComponent,
    ShopComponent,
    HomeCalendarComponent,
    ClockInComponent,
    ActionCardComponent,
    CreateVacationComponent,
    DailyTaskComponent
  ],
  imports: [
    CommonModule,
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
    MatMenuModule,
    MatCheckboxModule
  ],
  entryComponents: [NewTaskComponent, TaskInfoComponent, WorkHoursDialogComponent, ConfirmDialogComponent],
  providers: [
    httpInterceptorProviders,
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {
      provide: LocationStrategy, // 导航路径的策略设置
      useClass: HashLocationStrategy // 使用'#'方式的策略
    }],
  bootstrap: [AppComponent]
})
export class AppModule {

  // https://www.jianshu.com/p/4e5755f38065
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconInNamespace('bee', 'gift',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/gift.svg'))
    this.matIconRegistry.addSvgIconInNamespace('bee','daily',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/calendar.svg'))
  }
}
