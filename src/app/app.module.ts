import { ModuleWithProviders, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';

import { LoginModule }  from './login/login.module';
import { LoginService } from './login/login.service';

import { DashboardModule }  from './dashboard/dashboard.module';
import { DashboardService } from './dashboard/dashboard.service';

import { RoomModule }  from './room/room.module';
import { RoomService } from './room/room.service';

import { SharedModule }  from './shared/shared.module';
import { HttpClientService } from './shared/services/httpclient.service';

import { LoginBackOfficeModule }  from './loginBackOffice/loginBackOffice.module';
import { LoginBackOfficeService } from './loginBackOffice/loginBackOffice.service';

import { DashboardBackOfficeModule }  from './dashboardBackOffice/dashboardBackOffice.module';
import { DashboardBackOfficeService } from './dashboardBackOffice/dashboardBackOffice.service';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

@NgModule({
  imports:      [ BrowserModule, rootRouting, LoginModule, DashboardModule, RoomModule, LoginBackOfficeModule, DashboardBackOfficeModule],
  declarations: [ AppComponent ],
  providers: [ RoomService, DashboardService, LoginService, HttpClientService, LoginBackOfficeService, DashboardBackOfficeService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

// import { NgModule }      from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule, Routes } from '@angular/router';
// import { FormsModule } from '@angular/forms'
// import { ReactiveFormsModule } from '@angular/forms';

// import { AppComponent }  from './app.component';
// import { LoginFormComponent }  from './login/loginForm.component';
// import { AdminAreaComponent }  from './adminarea/adminarea.component';


// const appRoutes: Routes = [
//  { path: '', component: LoginFormComponent},
//  { path: 'admin', component: AdminAreaComponent}
// ];

// @NgModule({
//   imports:      [ BrowserModule, RouterModule.forRoot(appRoutes), FormsModule, ReactiveFormsModule ],
//   declarations: [ AppComponent, LoginFormComponent, AdminAreaComponent ],
//   bootstrap:    [ AppComponent ]
// })
// export class AppModule { }