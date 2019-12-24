import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Page404Component} from './page404/page404.component';
import {DailyComponent} from './daily/daily.component';
import {SettingComponent} from './setting/setting.component';
import {OrderMealComponent} from './order-meal/order-meal.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import {appRouting} from './app.router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule, MatNativeDateModule,
  MatToolbarModule
} from '@angular/material';
import {MainComponent} from './main/main.component';
import {NewTodoComponent} from './new-todo/new-todo.component';

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    DailyComponent,
    SettingComponent,
    OrderMealComponent,
    LoginComponent,
    MainComponent,
    NewTodoComponent
  ],
  imports: [
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
    MatDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
