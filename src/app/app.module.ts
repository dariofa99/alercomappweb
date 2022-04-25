import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './core/pages/home/home.component';
import { LoginComponent } from './core/pages/login/login.component';
import { RegisterComponent } from './core/pages/register/register.component';
import { ForgotComponent } from './core/pages/forgot/forgot.component';
import { UserComponent } from './core/pages/user/user.component';
import { AlertComponent } from './core/pages/alert/alert.component';
import { RolesPermissionsComponent } from './core/pages/roles-permissions/roles-permissions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ArrowDivDirective } from './core/directives/arrow-div.directive';
import { KeyBoardService } from './core/services/keyboard.service';
import { UserAdminComponent } from './core/pages/user-admin/user-admin.component';
import { MyalertsComponent } from './core/pages/myalerts/myalerts.component';
import { InstitutionsComponent } from './core/pages/institutions/institutions.component';
import { DialogNewEditUserComponent } from './core/pages/dialog-new-edit-user/dialog-new-edit-user.component';
import { DialogNewEditRoleComponent } from './core/pages/dialog-new-edit-role/dialog-new-edit-role.component';
import { DialogNewEditPermissionComponent } from './core/pages/dialog-new-edit-permission/dialog-new-edit-permission.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotComponent,
    UserComponent,
    AlertComponent,
    RolesPermissionsComponent,
    ArrowDivDirective,
    UserAdminComponent,
    MyalertsComponent,
    InstitutionsComponent,
    DialogNewEditUserComponent,
    DialogNewEditRoleComponent,
    DialogNewEditPermissionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [RolesPermissionsComponent, KeyBoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
