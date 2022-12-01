import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DailyComponent } from './pages/daily/daily.component';
import { LoginComponent } from './pages/login/login.component';
import { FooterComponent } from './component/footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {appRouting} from './app.router';
import { HomeComponent } from './pages/home/home.component';
import { Page404Component } from './pages/page404/page404.component';
import { HeaderComponent } from './component/header/header.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DailyCalendarComponent } from './component/daily-calendar/daily-calendar.component';
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonModule} from "@angular/material/button";
import { DailyListComponent } from './component/daily-list/daily-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DailyComponent,
    LoginComponent,
    FooterComponent,
    HomeComponent,
    Page404Component,
    HeaderComponent,
    DailyCalendarComponent,
    DailyListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterOutlet,
    appRouting,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
